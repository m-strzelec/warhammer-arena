const mongoose = require('mongoose');

const weaponSchema = new mongoose.Schema({
    name: { type: String, required: true },
    damageFactor: { type: Number, required: true },
    traits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trait' }]
});

module.exports = mongoose.model('Weapon', weaponSchema);
