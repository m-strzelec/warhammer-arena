const express = require('express');
const cors = require('cors');
const characterRoutes = require('./routes/characterRoutes');
const fightRoutes = require('./routes/fightRoutes');
const traitRoutes = require('./routes/traitRoutes');
const skillRoutes = require('./routes/skillRoutes');
const abilityRoutes = require('./routes/talentRoutes');
const weaponRoutes = require('./routes/weaponRoutes');
const armorRoutes = require('./routes/armorRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/characters', characterRoutes);
app.use('/api/fights', fightRoutes);
app.use('/api/traits', traitRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/abilities', abilityRoutes);
app.use('/api/weapons', weaponRoutes);
app.use('/api/armor', armorRoutes);

module.exports = app;