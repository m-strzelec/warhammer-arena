const Skill = require('../models/Skill');

const skillRPCHandler = async (message) => {
    const { action, skillIds } = JSON.parse(message.content.toString());

    if (action === 'checkSkillsExist') {
        if (!skillIds || !skillIds.length) return { valid: false };
        const count = await Skill.countDocuments({ _id: { $in: skillIds } });
        return { valid: count === skillIds.length };
    }

    if (action === 'getSkillsByIds') {
        const skills = await Skill.find({ _id: { $in: skillIds } });
        return skills;
    }

    throw new Error('Unknown action type');
};

module.exports = skillRPCHandler;