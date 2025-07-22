// seeds/YYYYMMDDHHMMSS_seed_bookings.js
const { addDays, format, parseISO } = require('date-fns');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // This seeder relies on 00_clear_all_hotel_data.js to clear bookings if needed.
  // No 'del()' here.

  const guestUser = await knex('users').where({ email: 'guestuser1@example.com' }).first();
  const adminUser = await knex('users').where({ email: 'admin@example.com' }).first();
  const rooms = await knex('rooms').select('id', 'hotel_id', 'price_per_night', 'capacity');

  if (!guestUser || rooms.length === 0) {
    console.warn('Guest user or rooms not found. Please run previous seeders first.');
    return;
  }

  const bookingsToInsert = [];
  const today = new Date();

  // Create a few bookings for guestuser1
  for (let i = 0; i < 5; i++) { // Create 5 sample bookings
    const randomRoom = rooms[Math.floor(Math.random() * rooms.length)];
    const checkInDate = addDays(today, 7 + i * 5); // Start 7 days from now, spaced out
    const checkOutDate = addDays(checkInDate, Math.floor(Math.random() * 3) + 1); // 1-3 nights

    const numRoomsBooked = Math.floor(Math.random() * 2) + 1; // 1 or 2 rooms
    const numGuests = numRoomsBooked * Math.min(randomRoom.capacity, Math.floor(Math.random() * randomRoom.capacity) + 1); // Guests within capacity

    // Simple total price calculation for seeding (not considering price_override from availability)
    const duration = (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24);
    const totalPrice = (parseFloat(randomRoom.price_per_night) * numRoomsBooked * duration).toFixed(2);

    bookingsToInsert.push({
      user_id: guestUser.id,
      room_id: randomRoom.id,
      check_in_date: format(checkInDate, 'yyyy-MM-dd'),
      check_out_date: format(checkOutDate, 'yyyy-MM-dd'),
      num_guests: numGuests,
      num_rooms_booked: numRoomsBooked,
      total_price: parseFloat(totalPrice),
      booking_status: 'confirmed', // Seed as confirmed
      payment_status: 'paid', // Seed as paid
      special_requests: `Sample request for booking ${i+1}.`,
      booked_at: knex.fn.now(),
      updated_at: knex.fn.now()
    });
  }

  await knex('bookings').insert(bookingsToInsert);
  console.log(`Seeded ${bookingsToInsert.length} bookings.`);
};