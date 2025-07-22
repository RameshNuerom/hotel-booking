// utils/passwordHash.js
const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds
  return bcrypt.hash(password, salt); // Hash the password using the generated salt
};

const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword); // Compare plain-text password with hashed password
};

module.exports = {
  hashPassword,
  comparePassword,
}; 
