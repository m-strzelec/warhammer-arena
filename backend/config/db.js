const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const getDbHostname = () => {
    if (process.env.NODE_ENV === 'production') {
        return process.env.DB_HOSTNAME_PROD;
    } else {
        return process.env.DB_HOSTNAME_DEV;
    }
};

const DB_PORT = process.env.DB_PORT;
const MONGO_DB = process.env.MONGO_DB;
const DB_HOSTNAME = getDbHostname();
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;

const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${DB_HOSTNAME}:${DB_PORT}/${MONGO_DB}?authSource=admin`);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error: ', error);
        process.exit(1);
    }
};

module.exports = connectDB;