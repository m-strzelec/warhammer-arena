const Weapon = require('./models/Weapon');

const weaponRPCHandler = async (message) => {
    const { action, weaponIds } = JSON.parse(message.content.toString());

    if (action === 'checkWeaponsExist') {
        if (!weaponIds || !weaponIds.length) return { valid: false };
        const count = await Weapon.countDocuments({ _id: { $in: weaponIds } });
        return { valid: count === weaponIds.length };
    }

    if (action === 'getWeaponsByIds') {
        const weapons = await Weapon.find({ _id: { $in: weaponIds } });
        return weapons;
    }

    throw new Error('Unknown action type');
};

module.exports = weaponRPCHandler;