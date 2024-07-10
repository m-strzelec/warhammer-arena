const mongoose = require('mongoose');
const Int32 = require('mongoose-int32').loadType(mongoose);
const Trait = require('./Trait');

const weaponSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    damageFactor: { type: Int32, required: true, min: -10, max: 10 },
    traits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trait' }],
    type: { type: String, enum: ['melee', 'range']},
    handedness: { type: String, enum: ['one-handed', 'two-handed']}
});

weaponSchema.pre('save', async function(next) {
    try {
        await Trait.find({ _id: { $in: this.traits } }).exec();
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('Weapon', weaponSchema);
