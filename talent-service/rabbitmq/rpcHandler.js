const Talent = require('./models/Talent');

const talentRPCHandler = async (message) => {
    const { action, talentIds } = JSON.parse(message.content.toString());

    if (action === 'checkTalentsExist') {
        if (!talentIds || !talentIds.length) return { valid: false };
        const count = await Talent.countDocuments({ _id: { $in: talentIds } });
        return { valid: count === talentIds.length };
    }

    if (action === 'findTalentsByIds') {
        const talents = await Talent.find({ _id: { $in: talentIds } });
        return talents;
    }

    throw new Error('Unknown action type');
};

module.exports = talentRPCHandler;