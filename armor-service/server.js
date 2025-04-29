const express = require('express');
const connectDB = require('./config/db');
const armorRoutes = require('./routes/armorRoutes');
const cors = require('cors');
const { connectRabbitMQ } = require('./rabbitmq/connection');
const { startRPCServer } = require('./rabbitmq/rpcServer');
const armorRPCHandler = require('./rabbitmq/rpcHandler');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.send('OK'));
app.use('/api/armors', armorRoutes);

async function startServer() {
  try {
    await connectRabbitMQ();
    await startRPCServer('armor_rpc_queue', armorRPCHandler);

    await connectDB();
    app.listen(PORT, () => {
      console.log(`Armor Service is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
