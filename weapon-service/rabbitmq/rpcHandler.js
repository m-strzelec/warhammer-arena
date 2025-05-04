const Weapon = require('../models/Weapon');

async function weaponRPCHandler(message) {
    const { action, weaponIds } = message;

    switch (action) {
        case 'checkWeaponsExist': {
            if (!weaponIds || !weaponIds.length) return { valid: false };
            const count = await Weapon.countDocuments({ _id: { $in: weaponIds } });
            return { valid: count === weaponIds.length };
        }
        case 'getWeaponsByIds': {
            const weapons = await Weapon.find({ _id: { $in: weaponIds } });
            return weapons;
        }
        default:
            throw new Error('Unknown action type');
    }
};

module.exports = weaponRPCHandler;