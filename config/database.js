// config/database.js
const knexConfig = require('../knexfile');
const knex = require('knex')(knexConfig[process.env.NODE_ENV]);

// Export both query function (for direct pg pool queries) and knex instance (for transactions)
module.exports = {
  query: pool.query.bind(pool),
  knex: knex // Add this line
};