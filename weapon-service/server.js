const express = require('express');
const connectDB = require('./config/db');
const weaponRoutes = require('./routes/weaponRoutes');
const cors = require('cors');
const { connectRabbitMQ } = require('./rabbitmq/connection');
const { startRPCServer } = require('./rabbitmq/rpcServer');
const weaponRPCHandler = require('./rabbitmq/rpcHandler');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.send('OK'));
app.use('/api/weapons', weaponRoutes);

async function startServer() {
  try {
    await connectRabbitMQ();
    await startRPCServer('weapon_rpc_queue', weaponRPCHandler);

    await connectDB();
    app.listen(PORT, () => {
      console.log(`Weapon Service is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
