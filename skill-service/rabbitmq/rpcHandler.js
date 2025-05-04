const Skill = require('../models/Skill');

async function skillRPCHandler(message) {
    const { action, skillIds } = message;

    switch (action) {
        case 'checkSkillsExist': {
            if (!skillIds || !skillIds.length) return { valid: false };
            const count = await Skill.countDocuments({ _id: { $in: skillIds } });
            return { valid: count === skillIds.length };
        }
        case 'getSkillsByIds': {
            const skills = await Skill.find({ _id: { $in: skillIds } });
            return skills;
        }
        default:
            throw new Error('Unknown action type');
    }
};

module.exports = skillRPCHandler;