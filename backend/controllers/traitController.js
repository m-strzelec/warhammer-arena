const HttpStatus = require('http-status-codes');
const Trait = require('../models/Trait');

const createTrait = async (req, res) => {
    try {
        const trait = new Trait(req.body);
        await trait.save();
        res.status(HttpStatus.StatusCodes.CREATED).json(trait);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
};

const getTraits = async (req, res) => {
    try {
        const traits = await Trait.find();
        res.status(HttpStatus.StatusCodes.OK).json(traits);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
};

const getTraitById = async (req, res) => {
    try {
        const trait = await Trait.findById(req.params.id);
        if (!trait) {
            return res.status(HttpStatus.StatusCodes.NOT_FOUND).json({ error: 'Trait not found' });
        }
        res.status(HttpStatus.StatusCodes.OK).json(trait);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
};

module.exports = {
    createTrait,
    getTraits,
    getTraitById
};
