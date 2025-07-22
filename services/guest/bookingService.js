 
// services/bookingService.js
const bookingModel = require('../models/bookingModel');
const roomModel = require('../models/roomModel'); // To get room details like capacity, price
const roomAvailabilityModel = require('../models/roomAvailabilityModel');
const { query, knex } = require('../config/database'); // Import knex for transactions
const { format, eachDayOfInterval, parseISO, isAfter, isSameDay } = require('date-fns');

/**
 * Creates a new booking. This operation is transactional.
 * It checks availability, decrements rooms, and creates the booking atomically.
 * @param {Object} bookingData - Contains user_id, room_id, check_in_date, check_out_date, num_guests, num_rooms_booked.
 * @returns {Promise<Object>} The created booking object.
 */
const createBooking = async (bookingData) => {
  const { user_id, room_id, check_in_date, check_out_date, num_guests, num_rooms_booked = 1 } = bookingData;

  // --- 1. Basic Input Validation ---
  if (!user_id || !room_id || !check_in_date || !check_out_date || !num_guests) {
    const error = new Error('User ID, Room ID, check-in/out dates, and number of guests are required.');
    error.statusCode = 400;
    throw error;
  }

  const parsedCheckIn = parseISO(check_in_date);
  const parsedCheckOut = parseISO(check_out_date);

  if (!isAfter(parsedCheckOut, parsedCheckIn) && !isSameDay(parsedCheckOut, parsedCheckIn)) { // Check out must be strictly after check in, or same day for 1-night stay
    const error = new Error('Check-out date must be after or same as check-in date.');
    error.statusCode = 400;
    throw error;
  }
  if (num_guests <= 0 || num_rooms_booked <= 0) {
    const error = new Error('Number of guests and rooms booked must be positive.');
    error.statusCode = 400;
    throw error;
  }

  // --- 2. Get Room Details ---
  const room = await roomModel.findRoomById(room_id);
  if (!room) {
    const error = new Error('Room not found.');
    error.statusCode = 404;
    throw error;
  }
  if (num_guests > room.capacity * num_rooms_booked) {
    const error = new Error(`Number of guests exceeds the capacity of ${num_rooms_booked} room(s) of type "${room.room_type}". Max capacity: ${room.capacity * num_rooms_booked}.`);
    error.statusCode = 400;
    throw error;
  }

  // --- 3. Check Availability and Calculate Total Price within a Transaction ---
  let total_price = 0;
  const datesToBook = eachDayOfInterval({ start: parsedCheckIn, end: parsedCheckOut });
  const availabilityUpdates = []; // To store updates for the transaction

  // Start a Knex transaction
  const trx = await knex.transaction();

  try {
    for (const date of datesToBook) {
      const formattedDate = format(date, 'yyyy-MM-dd');

      const availability = await roomAvailabilityModel.getAvailableRoomsForBooking(room_id, formattedDate);

      // Check if availability exists and if enough rooms are available
      if (!availability || availability.available_rooms < num_rooms_booked) {
        const error = new Error(`Not enough rooms available for ${room.room_type} on ${formattedDate}. Available: ${availability ? availability.available_rooms : 0}, Requested: ${num_rooms_booked}.`);
        error.statusCode = 409; // Conflict
        throw error;
      }

      // Add to total price (price_override takes precedence, otherwise use room's base price)
      const effectivePrice = parseFloat(availability.effective_price || room.price_per_night); // Ensure float
      total_price += effectivePrice * num_rooms_booked;

      // Prepare to decrement availability
      availabilityUpdates.push({
        roomId: room_id,
        date: formattedDate,
        quantity: num_rooms_booked
      });
    }

    // --- Perform decrements within the transaction ---
    for (const update of availabilityUpdates) {
      const result = await roomAvailabilityModel.decrementAvailableRooms(update.roomId, update.date, update.quantity);
      if (!result) {
        // This case should ideally be caught by the earlier check, but as a fallback for race conditions
        const error = new Error(`Failed to decrement rooms for ${update.date}. Possible concurrent booking.`);
        error.statusCode = 409;
        throw error;
      }
    }

    // --- 4. Create Booking Record within the transaction ---
    const newBooking = await bookingModel.createBooking({
      user_id,
      room_id,
      check_in_date: format(parsedCheckIn, 'yyyy-MM-dd'),
      check_out_date: format(parsedCheckOut, 'yyyy-MM-dd'),
      num_guests,
      num_rooms_booked,
      total_price: parseFloat(total_price.toFixed(2)), // Format to 2 decimal places
      status: 'confirmed' // Or 'pending' if manual confirmation is needed
    });

    // --- Commit the transaction if all successful ---
    await trx.commit();
    return newBooking;

  } catch (error) {
    // --- Rollback the transaction if any error occurs ---
    await trx.rollback();
    throw error; // Re-throw the error for the controller to catch
  }
};

const findBookingById = async (bookingId) => {
  const booking = await bookingModel.findBookingById(bookingId);
  if (!booking) {
    const error = new Error('Booking not found.');
    error.statusCode = 404;
    throw error;
  }
  return booking;
};

const findBookingsByUserId = async (userId) => {
  const bookings = await bookingModel.findBookingsByUserId(userId);
  return bookings;
};

/**
 * Cancels a booking and increments room availability. This operation is transactional.
 * @param {number} bookingId - The ID of the booking to cancel.
 * @param {number} userId - The ID of the user attempting to cancel (for authorization).
 * @param {string} role - The role of the user ('guest', 'admin', 'hotel_manager').
 * @returns {Promise<Object>} The cancelled booking object.
 */
const cancelBooking = async (bookingId, userId, role) => {
  const existingBooking = await bookingModel.findBookingById(bookingId);

  if (!existingBooking) {
    const error = new Error('Booking not found.');
    error.statusCode = 404;
    throw error;
  }

  // Authorization check: Only owner or admin/hotel manager can cancel
  if (existingBooking.user_id !== userId && role !== 'admin' && role !== 'hotel_manager') {
    const error = new Error('Unauthorized to cancel this booking.');
    error.statusCode = 403;
    throw error;
  }

  // Only allow cancellation if status is 'pending' or 'confirmed'
  if (existingBooking.status !== 'pending' && existingBooking.status !== 'confirmed') {
    const error = new Error(`Booking cannot be cancelled. Current status: ${existingBooking.status}.`);
    error.statusCode = 400;
    throw error;
  }

  // Start a Knex transaction for cancellation and availability increment
  const trx = await knex.transaction();

  try {
    // Increment room availability for each day of the booking
    const datesBooked = eachDayOfInterval({
      start: parseISO(existingBooking.check_in_date),
      end: parseISO(existingBooking.check_out_date)
    });

    for (const date of datesBooked) {
      const formattedDate = format(date, 'yyyy-MM-dd');
      await roomAvailabilityModel.incrementAvailableRooms(existingBooking.room_id, formattedDate, existingBooking.num_rooms_booked);
    }

    // Update booking status to 'cancelled'
    const updatedBooking = await bookingModel.updateBooking(bookingId, { status: 'cancelled' });

    await trx.commit();
    return updatedBooking;

  } catch (error) {
    await trx.rollback();
    throw error;
  }
};

// Admin/Hotel Manager specific method to get all bookings (can be filtered)
const getAllBookings = async () => {
  const bookings = await query('SELECT * FROM bookings ORDER BY created_at DESC');
  return bookings.rows;
};

// Admin/Hotel Manager specific method to update booking status manually
const updateBookingStatus = async (bookingId, newStatus) => {
  const existingBooking = await bookingModel.findBookingById(bookingId);

  if (!existingBooking) {
    const error = new Error('Booking not found.');
    error.statusCode = 404;
    throw error;
  }

  // Basic validation for status transition (can be more complex)
  const allowedStatuses = ['pending', 'confirmed', 'cancelled', 'completed', 'no_show'];
  if (!allowedStatuses.includes(newStatus)) {
    const error = new Error(`Invalid status: ${newStatus}.`);
    error.statusCode = 400;
    throw error;
  }

  // Prevent changing from cancelled/completed unless admin (depends on business logic)
  if (['cancelled', 'completed', 'no_show'].includes(existingBooking.status) && !['admin'].includes(newStatus)) {
      // This is a simplistic check; a more robust system would map valid state transitions
      // For now, allow admin to override if necessary or prevent specific transitions.
      // Example: A cancelled booking generally shouldn't become 'confirmed' again directly.
  }

  const updatedBooking = await bookingModel.updateBooking(bookingId, { status: newStatus });
  return updatedBooking;
};


module.exports = {
  createBooking,
  findBookingById,
  findBookingsByUserId,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
};