// migrations/YYYYMMDDHHMMSS_create_bookings_table.js
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('bookings', function(table) {
    table.increments('id').primary();
    table.integer('user_id').notNullable().unsigned();
    table.integer('room_id').notNullable().unsigned();
    table.date('check_in_date').notNullable();
    table.date('check_out_date').notNullable();
    table.integer('num_guests').notNullable();
    table.integer('num_rooms_booked').notNullable();
    table.decimal('total_price', 10, 2).notNullable();
    table.specificType('booking_status', 'booking_status_enum_hotel').notNullable().defaultTo('pending');
    table.specificType('payment_status', 'payment_status_enum_hotel').notNullable().defaultTo('pending');
    table.text('special_requests'); // nullable by default
    table.timestamp('booked_at').defaultTo(knex.fn.now());
    table.timestamps(false, true); // Only updated_at will be auto-updated, booked_at is separate

    table.foreign('user_id').references('id').inTable('users').onDelete('RESTRICT'); // Don't delete user if they have bookings
    table.foreign('room_id').references('id').inTable('rooms').onDelete('RESTRICT'); // Don't delete room if it has bookings
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('bookings');
};