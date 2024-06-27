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

const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb://${DB_HOSTNAME}:${DB_PORT}/${MONGO_DB}`);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error: ', error);
        process.exit(1);
    }
};

module.exports = connectDB;