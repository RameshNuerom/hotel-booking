// models/userModel.js
const db = require('../config/database');

const createUser = async (username, email, passwordHash, role) => {
  const res = await db(
    `INSERT INTO users (username, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, username, email, role, created_at, updated_at`,
    [username, email, passwordHash, role]
  );
  return res.rows[0];
};

const findUserByEmail = async (email) => {
  const res = await db(
    `SELECT id, username, email, password_hash, role
     FROM users WHERE email = $1`,
    [email]
  );
  return res.rows[0];
};

const findUserById = async (id) => {
  const res = await db(
    `SELECT id, username, email, role
     FROM users WHERE id = $1`,
    [id]
  );
  return res.rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
}; 
