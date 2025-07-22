// migrations/YYYYMMDDHHMMSS_create_room_availability_table.js
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('room_availability', function(table) {
    table.increments('id').primary();
    table.integer('room_id').notNullable().unsigned();
    table.date('date').notNullable();
    table.integer('available_rooms').notNullable(); // Number of rooms of this type available on this date
    table.decimal('price_override', 10, 2); // nullable by default

    table.foreign('room_id').references('id').inTable('rooms').onDelete('CASCADE');
    table.unique(['room_id', 'date']); // Unique constraint for a specific room type on a specific date
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('room_availability');
};