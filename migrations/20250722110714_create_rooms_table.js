// migrations/YYYYMMDDHHMMSS_create_rooms_table.js
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('rooms', function(table) {
    table.increments('id').primary();
    table.integer('hotel_id').notNullable().unsigned();
    table.string('room_type', 100).notNullable();
    table.text('description'); // nullable by default
    table.integer('capacity').notNullable();
    table.decimal('price_per_night', 10, 2).notNullable();
    table.integer('num_rooms_available').notNullable(); // Total rooms of this type in the hotel
    table.text('amenities'); // nullable by default, e.g., JSON or comma-separated list
    table.text('image_urls'); // nullable by default, e.g., JSON array of URLs or comma-separated list

    table.timestamps(true, true);

    table.foreign('hotel_id').references('id').inTable('hotels').onDelete('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('rooms');
};