const mongoose = require('mongoose');

const fightSchema = new mongoose.Schema({
    character1: { type: mongoose.Schema.Types.ObjectId, ref: 'Character', required: true },
    character2: { type: mongoose.Schema.Types.ObjectId, ref: 'Character', required: true },
    winner: { type: mongoose.Schema.Types.ObjectId, ref: 'Character' }
}, { timestamps: true });

module.exports = mongoose.model('Fight', fightSchema);
