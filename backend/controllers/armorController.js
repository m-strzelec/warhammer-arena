const HttpStatus = require('http-status-codes');
const Armor = require('../models/Armor');

const createArmor = async (req, res) => {
    try {
        const { name, location, protectionFactor, traits } = req.body;
        if (!name || !location || !protectionFactor) {
            return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ 
                message: !name ? 'No armor name was given' : 
                    !location ? 'No armor location was given' :
                        'No protection factor was given'
            });
        }
        const existingArmor = await Armor.findOne({ name });
        if (existingArmor) {
            return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ message: 'Armor with given name already exists' });
        }
        const newArmor = new Armor({ name, location, protectionFactor, traits });
        await newArmor.save();
        res.status(HttpStatus.StatusCodes.CREATED).json(newArmor);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error creating armor', error: error.message });
    }
};

const getArmors = async (req, res) => {
    try {
        const armors = await Armor.find().populate('traits');
        res.status(HttpStatus.StatusCodes.OK).json(armors);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching armors', error: error.message });
    }
};

const getArmorById = async (req, res) => {
    try {
        const armor = await Armor.findById(req.params.id).populate('traits');
        if (!armor) {
            return res.status(HttpStatus.StatusCodes.NOT_FOUND).json({ message: 'Armor not found' });
        }
        res.status(HttpStatus.StatusCodes.OK).json(armor);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching armor data', error: error.message });
    }
};

module.exports = {
    createArmor,
    getArmors,
    getArmorById
};
