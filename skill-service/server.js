const express = require('express');
const connectDB = require('./config/db');
const skillRoutes = require('./routes/skillRoutes');
const cors = require('cors');
const { startRPCServer } = require('./rabbitmq/rpcServer');
const { connectRabbitMQ } = require('./rabbitmq/connection');
const skillRPCHandler = require('./rabbitmq/rpcHandler');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.send('OK'));
app.use('/skills', skillRoutes);

async function startServer() {
  try {
    await connectRabbitMQ();
    await startRPCServer('skill_rpc_queue', skillRPCHandler);

    await connectDB();
    app.listen(PORT, () => {
      console.log(`Skill Service is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
