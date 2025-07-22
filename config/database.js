// config/database.js
require('dotenv').config();
const knex = require('knex');
const knexConfig = require('../knexfile');

const environment = process.env.NODE_ENV || 'development';

if (!knexConfig[environment]) {
  throw new Error(`Knex configuration not found for environment: ${environment}`);
}

const db = knex(knexConfig[environment]);

module.exports = db;
