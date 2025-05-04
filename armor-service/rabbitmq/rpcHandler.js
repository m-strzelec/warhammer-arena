const Armor = require('../models/Armor');

async function armorRPCHandler(message) {
    const { action, armorIds } = message;

    switch (action) {
        case 'checkArmorsExist': {
            if (!armorIds || !armorIds.length) return { valid: false };
            const count = await Armor.countDocuments({ _id: { $in: armorIds } });
            return { valid: count === armorIds.length };
        }
        case 'getArmorsByIds': {
            const armors = await Armor.find({ _id: { $in: armorIds } });
            return armors;
        }
        default:
            throw new Error('Unknown action type');
    }
};

module.exports = armorRPCHandler;