// seeds/YYYYMMDDHHMMSS_seed_hotels.js
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // This seeder relies on 00_clear_all_hotel_data.js to clear hotels if needed.
  // No 'del()' here.

  // Fetch manager user IDs
  const managerHyd = await knex('users').where({ email: 'manager_hyd@example.com' }).first();
  const managerBlr = await knex('users').where({ email: 'manager_blr@example.com' }).first();

  const hotelsToInsert = [
    {
      name: 'Novotel Hyderabad Convention Centre',
      address: 'Kothaguda, Kondapur',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      postal_code: '500084',
      description: 'A contemporary hotel with convention facilities.',
      star_rating: 5,
      image_url: 'https://placehold.co/600x400/000000/FFFFFF?text=Novotel+Hyd',
      manager_id: managerHyd ? managerHyd.id : null,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      name: 'Taj Falaknuma Palace',
      address: 'Engine Bowli, Falaknuma',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      postal_code: '500053',
      description: 'A luxurious 5-star palace hotel.',
      star_rating: 5,
      image_url: 'https://placehold.co/600x400/FF0000/FFFFFF?text=Taj+Falaknuma',
      manager_id: managerHyd ? managerHyd.id : null, // Assign to same manager for simplicity
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      name: 'The Leela Palace Bengaluru',
      address: '23 Old Airport Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      postal_code: '560008',
      description: 'An exquisite palace hotel in Bangalore.',
      star_rating: 5,
      image_url: 'https://placehold.co/600x400/00FF00/FFFFFF?text=Leela+Blr',
      manager_id: managerBlr ? managerBlr.id : null,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
    {
      name: 'Lemon Tree Premier, Delhi Airport',
      address: 'Asset No. 6, Aerocity',
      city: 'Delhi',
      state: 'Delhi',
      country: 'India',
      postal_code: '110037',
      description: 'Modern hotel near Delhi Airport.',
      star_rating: 4,
      image_url: 'https://placehold.co/600x400/0000FF/FFFFFF?text=Lemon+Tree+Delhi',
      manager_id: null, // No manager assigned for this one initially
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    },
  ];

  await knex('hotels').insert(hotelsToInsert);
  console.log(`Seeded ${hotelsToInsert.length} hotels.`);
};