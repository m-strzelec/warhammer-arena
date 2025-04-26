const express = require('express');
const connectDB = require('./config/db');
const armorRoutes = require('./routes/armorRoutes');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());


app.get('/health', (req, res) => res.send('OK'));

app.use('/armors', armorRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Armor Service is running on port ${PORT}`);
  });
});
