const HttpStatus = require('http-status-codes');
const Weapon = require('../models/Weapon');

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
        const weapons = await Weapon.find().populate('traits');
        res.status(HttpStatus.StatusCodes.OK).json(weapons);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching weapons', error: error.message });
    }
};

const getWeaponById = async (req, res) => {
    try {
        const weapon = await Weapon.findById(req.params.id).populate('traits');
        if (!weapon) {
            return res.status(HttpStatus.StatusCodes.NOT_FOUND).json({ message: 'Weapon not found' });
        }
        res.status(HttpStatus.StatusCodes.OK).json(weapon);
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
