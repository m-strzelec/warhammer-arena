const Armor = require('./models/Armor');

const armorRPCHandler = async (message) => {
    const { action, armorIds } = JSON.parse(message.content.toString());

    if (action === 'checkArmorsExist') {
        if (!armorIds || !armorIds.length) return { valid: false };
        const count = await Armor.countDocuments({ _id: { $in: armorIds } });
        return { valid: count === armorIds.length };
    }

    if (action === 'getArmorsByIds') {
        const armors = await Armor.find({ _id: { $in: armorIds } });
        return armors;
    }

    throw new Error('Unknown action type');
};

module.exports = armorRPCHandler;