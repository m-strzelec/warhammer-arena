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

await connectRabbitMQ();
await startRPCServer('skill_rpc_queue', skillRPCHandler);

app.get('/health', (req, res) => res.send('OK'));

app.use('/api/skills', skillRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Skill Service is running on port ${PORT}`);
  });
});
