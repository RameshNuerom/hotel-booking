// seeds/YYYYMMDDHHMMSS_seed_rooms.js
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // This seeder relies on 00_clear_all_hotel_data.js to clear rooms if needed.
  // No 'del()' here.

  const hotels = await knex('hotels').select('id', 'name');

  if (hotels.length === 0) {
    console.warn('No hotels found. Please run the hotels seeder first.');
    return;
  }

  const roomsToInsert = [];
  const roomTypes = ['Standard', 'Deluxe', 'Suite', 'Executive'];
  const amenitiesList = [
    ['WiFi', 'AC', 'TV'],
    ['WiFi', 'AC', 'TV', 'Mini-bar'],
    ['WiFi', 'AC', 'TV', 'Mini-bar', 'Bathtub'],
    ['WiFi', 'AC', 'TV', 'Mini-bar', 'Bathtub', 'Balcony']
  ];

  for (const hotel of hotels) {
    for (let i = 0; i < roomTypes.length; i++) {
      const type = roomTypes[i];
      const capacity = i < 2 ? 2 : 4; // Standard/Deluxe for 2, Suite/Executive for 4
      const basePrice = (i + 1) * 100 + 50; // 150, 250, 350, 450
      const numRooms = Math.floor(Math.random() * (20 - 5) + 5); // 5-20 rooms of each type

      roomsToInsert.push({
        hotel_id: hotel.id,
        room_type: type,
        description: `${type} room at ${hotel.name}. Comfortable stay for ${capacity} guests.`,
        capacity: capacity,
        price_per_night: basePrice.toFixed(2),
        num_rooms_available: numRooms, // Total count of this type in the hotel
        amenities: JSON.stringify(amenitiesList[i]), // Store as JSON string
        image_urls: JSON.stringify([`https://placehold.co/600x400/${Math.floor(Math.random()*16777215).toString(16)}/${Math.floor(Math.random()*16777215).toString(16)}?text=${encodeURIComponent(hotel.name)}+${type}`]),
        created_at: knex.fn.now(),
        updated_at: knex.fn.now()
      });
    }
  }

  await knex('rooms').insert(roomsToInsert);
  console.log(`Seeded ${roomsToInsert.length} room types.`);
};