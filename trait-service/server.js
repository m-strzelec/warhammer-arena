const express = require('express');
const connectDB = require('./config/db');
const traitRoutes = require('./routes/traitRoutes');
const cors = require('cors');
const { startRPCServer } = require('./rabbitmq/rpcServer');
const { connectRabbitMQ } = require('./rabbitmq/connection');
const traitRPCHandler = require('./rabbitmq/rpcHandler');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

await connectRabbitMQ();
await startRPCServer('trait_rpc_queue', traitRPCHandler);

app.get('/health', (req, res) => res.send('OK'));

app.use('/api/traits', traitRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Trait Service is running on port ${PORT}`);
  });
});
