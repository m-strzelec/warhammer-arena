const express = require('express');
const connectDB = require('./config/db');
const fightRoutes = require('./routes/fightRoutes');
const cors = require('cors');
const { connectRabbitMQ } = require('./rabbitmq/connection');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.send('OK'));
app.use('/api/fights', fightRoutes);

async function startServer() {
  try {
    await connectRabbitMQ();
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Fight Service is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();