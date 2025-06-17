const Weapon = require('../models/Weapon');

async function weaponRPCHandler(message) {
    const { action, weaponIds, traitId } = message;

    switch (action) {
        case 'checkWeaponsExist': {
            if (!weaponIds || !weaponIds.length) return { valid: false };
            const uniqueWeaponIds = Array.from(new Set(weaponIds));
            const count = await Weapon.countDocuments({ _id: { $in: uniqueWeaponIds } });
            return { valid: count === uniqueWeaponIds.length };
        }
        case 'getWeaponsByIds': {
            const weapons = await Weapon.find({ _id: { $in: weaponIds } });
            return weapons;
        }
        case 'checkTraitUsage': {
            if (!traitId) return { inUse: false };
            const weapons = await Weapon.find({ traits: traitId }).select('_id name').lean();
            return {
                inUse: weapons.length > 0,
                usedBy: weapons
            };
        }
        default:
            throw new Error('Unknown action type');
    }
};

module.exports = weaponRPCHandler;