const HttpStatus = require('http-status-codes');
const Trait = require('../models/Trait');

const createTrait = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ 
                message: !name ? 'No trait name was given' : 
                    'No description was given'
            });
        }
        const existingTrait = await Trait.findOne({ name });
        if (existingTrait) {
            return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ message: 'Trait with given name already exists' });
        }
        const newTrait = new Trait({ name, description });
        await newTrait.save();
        res.status(HttpStatus.StatusCodes.CREATED).json(newTrait);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error creating trait', error: error.message });
    }
};

const getTraits = async (req, res) => {
    try {
        const traits = await Trait.find();
        res.status(HttpStatus.StatusCodes.OK).json(traits);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching traits', error: error.message });
    }
};

const getTraitById = async (req, res) => {
    try {
        const trait = await Trait.findById(req.params.id);
        if (!trait) {
            return res.status(HttpStatus.StatusCodes.NOT_FOUND).json({ message: 'Trait not found' });
        }
        res.status(HttpStatus.StatusCodes.OK).json(trait);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching trait data', error: error.message });
    }
};

module.exports = {
    createTrait,
    getTraits,
    getTraitById
};
