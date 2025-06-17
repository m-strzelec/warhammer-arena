const mongoose = require('mongoose');

const talentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true }
});

module.exports = mongoose.model('Talent', talentSchema);