const mongoose = require('mongoose');
const Int32 = require('mongoose-int32').loadType(mongoose);
const { sendRPCMessage } = require('../rabbitmq/rpcClient');

const weaponSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    damageFactor: { type: Int32, required: true, min: -10, max: 10 },
    traits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trait' }],
    type: { type: String, enum: ['melee', 'range']},
    handedness: { type: String, enum: ['one-handed', 'two-handed']}
});

weaponSchema.pre('save', async function(next) {
    try {
        const response = await sendRPCMessage('trait_rpc_queue', { action: 'checkTraitsExist', traitIds: this.traits });
        if (!response.valid) {
            throw new Error('One or more traits are invalid.');
        }
        next();
    } catch (err) {
        next(err);
    }
});

weaponSchema.pre('findOneAndUpdate', async function (next) {
    try {
        const update = this.getUpdate();
        if (update.traits && Array.isArray(update.traits)) {
            const response = await sendRPCMessage('trait_rpc_queue', { action: 'checkTraitsExist', traitIds: update.traits });
            if (!response.valid) {
                throw new Error('One or more traits do not exist');
            }
        }
        next();
    } catch (err) {
      next(err);
    }
});

module.exports = mongoose.model('Weapon', weaponSchema);