const Trait = require('../models/Trait');

async function traitRPCHandler(message) {
    const { action, traitIds } = message;

    switch (action) {
        case 'checkTraitsExist': {
            if (!traitIds || !traitIds.length) return { valid: false };
            const count = await Trait.countDocuments({ _id: { $in: traitIds } });
            return { valid: count === traitIds.length };
        }
        case 'getTraitsByIds': {
            const traits = await Trait.find({ _id: { $in: traitIds } });
            return traits;
        }
        default:
            throw new Error('Unknown action type');
    }
};

module.exports = traitRPCHandler;