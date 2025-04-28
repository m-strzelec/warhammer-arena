const Trait = require('./models/Trait');

const traitRPCHandler = async (message) => {
    const { action, traitIds } = JSON.parse(message.content.toString());

    if (action === 'checkTraitsExist') {
        if (!traitIds || !traitIds.length) return { valid: false };
        const count = await Trait.countDocuments({ _id: { $in: traitIds } });
        return { valid: count === traitIds.length };
    }

    if (action === 'findTraitsByIds') {
        const traits = await Trait.find({ _id: { $in: traitIds } });
        return traits;
    }

    throw new Error('Unknown action type');
};

module.exports = traitRPCHandler;