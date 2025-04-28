const mongoose = require('mongoose');
const Int32 = require('mongoose-int32').loadType(mongoose);
const { sendRPCMessage } = require('../rabbitmq/rpcClient');

const armorSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    locations: { type: [String], required: true },
    protectionFactor: { type: Int32, required: true, min: 0, max: 10 },
    traits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trait' }]
});

armorSchema.pre('save', async function(next) {
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

armorSchema.pre('findOneAndUpdate', async function (next) {
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

module.exports = mongoose.model('Armor', armorSchema);