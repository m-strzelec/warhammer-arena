const express = require('express');
const connectDB = require('./config/db');
const talentRoutes = require('./routes/talentRoutes');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());


app.get('/health', (req, res) => res.send('OK'));

app.use('/talents', talentRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Talent Service is running on port ${PORT}`);
  });
});