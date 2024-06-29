const mongoose = require('mongoose');

const armorSchema = new mongoose.Schema({
    location: { type: String, required: true },
    protection: { type: Number, required: true },
    traits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trait' }]
});

module.exports = mongoose.model('Armor', armorSchema);
