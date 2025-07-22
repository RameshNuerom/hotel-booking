// migrations/YYYYMMDDHHMMSS_create_hotel_enum_types.js
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.raw(`
    CREATE TYPE user_role_enum_hotel AS ENUM ('guest', 'hotel_manager', 'admin');
    CREATE TYPE booking_status_enum_hotel AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
    CREATE TYPE payment_status_enum_hotel AS ENUM ('pending', 'paid', 'refunded');
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.raw(`
    DROP TYPE IF EXISTS user_role_enum_hotel;
    DROP TYPE IF EXISTS booking_status_enum_hotel;
    DROP TYPE IF EXISTS payment_status_enum_hotel;
  `);
};