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

await connectRabbitMQ();
await startRPCServer('weapon_rpc_queue', weaponRPCHandler);

app.get('/health', (req, res) => res.send('OK'));

app.use('/api/weapons', weaponRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Weapon Service is running on port ${PORT}`);
  });
});
