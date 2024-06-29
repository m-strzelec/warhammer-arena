const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    name: { type: String, required: true },
    baseStat: { type: String, required: true },
    factor: { type: Number, required: true }
});

module.exports = mongoose.model('Skill', skillSchema);
