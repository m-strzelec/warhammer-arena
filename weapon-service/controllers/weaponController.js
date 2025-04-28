const HttpStatus = require('http-status-codes');
const Weapon = require('../models/Weapon');
const { sendRPCMessage } = require('../rabbitmq/rpcClient');

const createWeapon = async (req, res) => {
    try {
        const { name, damageFactor, traits, type, handedness } = req.body;
        if (!name || !damageFactor || !type || !handedness) {
            return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({
                message: !name ? 'No weapon name was given' :
                    !damageFactor ? 'No damage factor was given' :
                        !type ? 'No weapon type was given' :
                            'No weapon handedness was given'
            });
        }
        const existingWeapon = await Weapon.findOne({ name });
        if (existingWeapon) {
            return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ message: 'Weapon with given name already exists' });
        }
        const newWeapon = new Weapon({ name, damageFactor, traits, type, handedness });
        await newWeapon.save();
        res.status(HttpStatus.StatusCodes.CREATED).json(newWeapon);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error creating weapon', error: error.message });
    }
};

const getWeapons = async (req, res) => {
    try {
        const weapons = await Weapon.find();
        const allTraitIds = [...new Set(weapons.flatMap(weapon => weapon.traits.map(id => id.toString())))];
        const traits = allTraitIds.length > 0 
            ? await sendRPCMessage('trait_rpc_queue', { action: 'findTraitsByIds', traitIds: allTraitIds }) 
            : [];
        const traitsMap = {};
        traits.forEach(trait => {
            traitsMap[trait._id] = trait;
        });
        const weaponsWithTraits = weapons.map(weapon => {
            const weaponObj = weapon.toObject();
            weaponObj.traits = weaponObj.traits.map(id => traitsMap[id.toString()]).filter(Boolean);
            return weaponObj;
        });
        res.status(HttpStatus.StatusCodes.OK).json(weaponsWithTraits);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching weapons', error: error.message });
    }
};

const getWeaponById = async (req, res) => {
    try {
        const weapon = await Weapon.findById(req.params.id);
        if (!weapon) {
            return res.status(HttpStatus.StatusCodes.NOT_FOUND).json({ message: 'Weapon not found' });
        }
        const traitIds = weapon.traits.map(id => id.toString());
        const traits = traitIds.length > 0 
            ? await sendRPCMessage('trait_rpc_queue', { action: 'findTraitsByIds', traitIds: traitIds })
            : [];
        const weaponObj = weapon.toObject();
        weaponObj.traits = weaponObj.traits.map(id => traits.find(trait => trait._id.toString() === id)).filter(Boolean);
        res.status(HttpStatus.StatusCodes.OK).json(weaponObj);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching weapon data', error: error.message });
    }
};

const updateWeapon = async (req, res) => {
    try {
        const { name, damageFactor, traits, type, handedness } = req.body;
        if (!name || !damageFactor || !type || !handedness) {
            return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({
                message: !name ? 'No weapon name was given' :
                    !damageFactor ? 'No damage factor was given' :
                        !type ? 'No weapon type was given' :
                            'No weapon handedness was given'
            });
        }

        const updatedWeapon = await Weapon.findByIdAndUpdate(
            req.params.id,
            { name, damageFactor, traits, type, handedness },
            { new: true }
        );

        if (!updatedWeapon) {
            return res.status(HttpStatus.StatusCodes.NOT_FOUND).json({ message: 'Weapon not found' });
        }
        res.status(HttpStatus.StatusCodes.OK).json(updatedWeapon);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error updating weapon', error: error.message });
    }
};

module.exports = {
    createWeapon,
    getWeapons,
    getWeaponById,
    updateWeapon
};
