const { pool } = require('../config/db');

const createUser = async ({ username, password, type = 'USER' }) => {
  const result = await pool.query(
    `INSERT INTO users (username, password, type)
     VALUES ($1, $2, $3) RETURNING id, username, type, created_at`,
    [username, password, type]
  );
  return result.rows[0];
};

const getUserByUsername = async (username) => {
  const res = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  return res.rows[0];
};

const getUserById = async (id) => {
  const res = await pool.query('SELECT id, username, type, created_at FROM users WHERE id = $1', [id]);
  return res.rows[0];
};

const getAllUsers = async () => {
  const res = await pool.query('SELECT id, username, type, created_at FROM users');
  return res.rows;
};

const updateUser = async (id, { username, password }) => {
  const fields = [];
  const values = [];
  let idx = 1;

  if (username) fields.push(`username = $${idx++}`), values.push(username);
  if (password) fields.push(`password = $${idx++}`), values.push(password);
  if (!fields.length) return null;

  values.push(id);
  const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${idx} RETURNING id, username, type, created_at`;

  const res = await pool.query(query, values);
  return res.rows[0];
};

const blacklistToken = async (token) => {
    await db.query('INSERT INTO blacklisted_tokens (token) VALUES ($1) ON CONFLICT DO NOTHING', [token]);
};

const isTokenBlacklisted = async (token) => {
    const result = await db.query('SELECT 1 FROM blacklisted_tokens WHERE token = $1', [token]);
    return result.rowCount > 0;
};

module.exports = {
  createUser,
  getUserByUsername,
  getUserById,
  getAllUsers,
  updateUser,
  blacklistToken,
  isTokenBlacklisted
};
