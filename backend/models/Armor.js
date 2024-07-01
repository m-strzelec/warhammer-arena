const mongoose = require('mongoose');
const Int32 = require('mongoose-int32').loadType(mongoose);

const armorSchema = new mongoose.Schema({
    location: { type: String, required: true, unique: true },
    protectionFactor: { type: Int32, required: true, min: -10, max: 10 },
    traits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trait' }]
});

module.exports = mongoose.model('Armor', armorSchema);
