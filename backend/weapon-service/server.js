const express = require('express');
const connectDB = require('./config/db');
const weaponRoutes = require('./routes/weaponRoutes');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());


app.get('/health', (req, res) => res.send('OK'));

app.use('/weapons', weaponRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Weapon Service is running on port ${PORT}`);
  });
});
