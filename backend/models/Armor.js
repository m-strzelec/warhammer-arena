const mongoose = require('mongoose');
const Int32 = require('mongoose-int32').loadType(mongoose);
const Trait = require('./Trait');

const armorSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    location: { type: [String], required: true },
    protectionFactor: { type: Int32, required: true, min: 0, max: 10 },
    traits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trait' }]
});

armorSchema.pre('save', async function(next) {
    try {
        await Trait.find({ _id: { $in: this.traits } }).exec();
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('Armor', armorSchema);
