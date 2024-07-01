const HttpStatus = require('http-status-codes');
const Armor = require('../models/Armor');

const createArmor = async (req, res) => {
    try {
        const armor = new Armor(req.body);
        await armor.save();
        res.status(HttpStatus.StatusCodes.CREATED).json(armor);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
};

const getArmors = async (req, res) => {
    try {
        const armors = await Armor.find().populate('traits');
        res.status(HttpStatus.StatusCodes.OK).json(armors);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
};

const getArmorById = async (req, res) => {
    try {
        const armor = await Armor.findById(req.params.id).populate('traits');
        if (!armor) {
            return res.status(HttpStatus.StatusCodes.NOT_FOUND).json({ error: 'Armor not found' });
        }
        res.status(HttpStatus.StatusCodes.OK).json(armor);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
};

module.exports = {
    createArmor,
    getArmors,
    getArmorById
};
