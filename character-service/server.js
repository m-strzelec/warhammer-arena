const express = require('express');
const connectDB = require('./config/db');
const characterRoutes = require('./routes/characterRoutes');
const cors = require('cors');
const { connectRabbitMQ } = require('./rabbitmq/connection');
const { startRPCServer } = require('./rabbitmq/rpcServer');
const characterRPCHandler = require('./rabbitmq/rpcHandler');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

await connectRabbitMQ();
await startRPCServer('character_rpc_queue', characterRPCHandler);

app.get('/health', (req, res) => res.send('OK'));

app.use('/api/characters', characterRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Character Service is running on port ${PORT}`);
  });
});
