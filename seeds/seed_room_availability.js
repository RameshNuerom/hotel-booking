// seeds/YYYYMMDDHHMMSS_seed_room_availability.js
const { addDays, format } = require('date-fns');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // This seeder relies on 00_clear_all_hotel_data.js to clear room_availability if needed.
  // No 'del()' here.

  const rooms = await knex('rooms').select('id', 'num_rooms_available', 'price_per_night');

  if (rooms.length === 0) {
    console.warn('No rooms found. Please run the rooms seeder first.');
    return;
  }

  const availabilityToInsert = [];
  const today = new Date();
  const numDaysToSeed = 60; // Seed availability for the next 60 days

  for (const room of rooms) {
    for (let i = 0; i < numDaysToSeed; i++) {
      const date = addDays(today, i);
      const formattedDate = format(date, 'yyyy-MM-dd');

      // Simulate some variation in availability and price override
      let availableRooms = room.num_rooms_available;
      let priceOverride = null;

      // Example: Reduce availability on weekends or specific dates
      if (date.getDay() === 0 || date.getDay() === 6) { // Sunday or Saturday
        availableRooms = Math.max(0, Math.floor(room.num_rooms_available * 0.7)); // 70% available
        priceOverride = (parseFloat(room.price_per_night) * 1.2).toFixed(2); // 20% higher price
      } else if (i % 10 === 0) { // Every 10th day, simulate low availability/high price
        availableRooms = Math.max(0, Math.floor(room.num_rooms_available * 0.3)); // 30% available
        priceOverride = (parseFloat(room.price_per_night) * 1.5).toFixed(2); // 50% higher price
      }

      availabilityToInsert.push({
        room_id: room.id,
        date: formattedDate,
        available_rooms: availableRooms,
        price_override: priceOverride,
        created_at: knex.fn.now(),
        updated_at: knex.fn.now()
      });
    }
  }

  // Use batch insert for performance
  const chunkSize = 1000; // Adjust chunk size based on your database and memory
  for (let i = 0; i < availabilityToInsert.length; i += chunkSize) {
    const chunk = availabilityToInsert.slice(i, i + chunkSize);
    await knex('room_availability').insert(chunk);
  }

  console.log(`Seeded ${availabilityToInsert.length} room availability records.`);
};