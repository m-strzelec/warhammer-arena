const express = require('express');
const connectDB = require('./config/db');
const talentRoutes = require('./routes/talentRoutes');
const cors = require('cors');
const { startRPCServer } = require('./rabbitmq/rpcServer');
const { connectRabbitMQ } = require('./rabbitmq/connection');
const talentRPCHandler = require('./rabbitmq/rpcHandler');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

await connectRabbitMQ();
await startRPCServer('talent_rpc_queue', talentRPCHandler);

app.get('/health', (req, res) => res.send('OK'));

app.use('/api/talents', talentRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Talent Service is running on port ${PORT}`);
  });
});