const express = require('express');
const cors = require('cors');
const characterRoutes = require('./routes/characterRoutes');
const fightRoutes = require('./routes/fightRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/characters', characterRoutes);
app.use('/api/fights', fightRoutes);

module.exports = app;