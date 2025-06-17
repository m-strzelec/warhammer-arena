const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.POSTGRES_URI });

const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('PostgreSQL connected for Auth Service');
    client.release();
  } catch (error) {
    console.error('PostgreSQL connection error:', error);
    process.exit(1);
  }
};

module.exports = {
    connectDB,
    pool
};
