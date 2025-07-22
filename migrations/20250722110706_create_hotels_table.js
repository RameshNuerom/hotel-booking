// migrations/YYYYMMDDHHMMSS_create_hotels_table.js
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('hotels', function(table) {
    table.increments('id').primary();
    table.string('name', 255).notNullable();
    table.text('address').notNullable();
    table.string('city', 100).notNullable();
    table.string('state', 100).notNullable();
    table.string('country', 100).notNullable();
    table.string('postal_code', 20); // nullable by default
    table.text('description'); // nullable by default
    table.integer('star_rating').notNullable(); // Ensure this is handled by application logic for 1-5
    table.string('image_url', 255); // nullable by default
    table.integer('manager_id').unsigned().nullable(); // can be null initially

    table.timestamps(true, true);

    table.foreign('manager_id').references('id').inTable('users').onDelete('SET NULL');
    // Add check constraint for star_rating if needed, though application validation is preferred.
    // table.check('star_rating >= 1 AND star_rating <= 5', [], 'star_rating_check');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('hotels');
};