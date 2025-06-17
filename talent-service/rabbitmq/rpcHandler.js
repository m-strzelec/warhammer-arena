const Talent = require('../models/Talent');

async function talentRPCHandler(message) {
    const { action, talentIds } = message;

    switch (action) {
        case 'checkTalentsExist': {
            if (!talentIds || !talentIds.length) return { valid: false };
            const uniqueTalentIds = Array.from(new Set(talentIds));
            const count = await Talent.countDocuments({ _id: { $in: uniqueTalentIds } });
            return { valid: count === uniqueTalentIds.length };
        }
        case 'getTalentsByIds': {
            const talents = await Talent.find({ _id: { $in: talentIds } });
            return talents;
        }
        default:
            throw new Error('Unknown action type');
    }
};

module.exports = talentRPCHandler;