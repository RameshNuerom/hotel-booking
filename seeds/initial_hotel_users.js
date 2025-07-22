// seeds/YYYYMMDDHHMMSS_initial_hotel_users.js
const bcrypt = require('bcryptjs');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // This seeder relies on 00_clear_all_hotel_data.js to clear users if needed.
  // No 'del()' here to avoid conflicts if users are managed differently.

  const usersToInsert = [];

  // Admin User
  const adminPassword = 'Admin@123'; // CHANGE THIS FOR PRODUCTION!
  const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
  usersToInsert.push({
    username: 'adminuser',
    email: 'admin@example.com',
    password_hash: hashedAdminPassword,
    role: 'admin',
    created_at: knex.fn.now(),
    updated_at: knex.fn.now()
  });

  // Hotel Manager Users (will be assigned to hotels later)
  const manager1Password = 'Manager@123';
  const hashedManager1Password = await bcrypt.hash(manager1Password, 10);
  usersToInsert.push({
    username: 'manager_hyderabad',
    email: 'manager_hyd@example.com',
    password_hash: hashedManager1Password,
    role: 'hotel_manager',
    created_at: knex.fn.now(),
    updated_at: knex.fn.now()
  });

  const manager2Password = 'Manager@123';
  const hashedManager2Password = await bcrypt.hash(manager2Password, 10);
  usersToInsert.push({
    username: 'manager_bangalore',
    email: 'manager_blr@example.com',
    password_hash: hashedManager2Password,
    role: 'hotel_manager',
    created_at: knex.fn.now(),
    updated_at: knex.fn.now()
  });

  // Guest Users
  const guest1Password = 'Guest@123';
  const hashedGuest1Password = await bcrypt.hash(guest1Password, 10);
  usersToInsert.push({
    username: 'guestuser1',
    email: 'guest1@example.com',
    password_hash: hashedGuest1Password,
    role: 'guest',
    created_at: knex.fn.now(),
    updated_at: knex.fn.now()
  });

  const guest2Password = 'Guest@123';
  const hashedGuest2Password = await bcrypt.hash(guest2Password, 10);
  usersToInsert.push({
    username: 'guestuser2',
    email: 'guest2@example.com',
    password_hash: hashedGuest2Password,
    role: 'guest',
    created_at: knex.fn.now(),
    updated_at: knex.fn.now()
  });

  await knex('users').insert(usersToInsert);
  console.log(`Seeded ${usersToInsert.length} users.`);
};