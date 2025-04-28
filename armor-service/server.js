const express = require('express');
const connectDB = require('./config/db');
const armorRoutes = require('./routes/armorRoutes');
const cors = require('cors');
const { connectRabbitMQ } = require('./rabbitmq/connection');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

await connectRabbitMQ();

app.get('/health', (req, res) => res.send('OK'));

app.use('/api/armors', armorRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Armor Service is running on port ${PORT}`);
  });
});
