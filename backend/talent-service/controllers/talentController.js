const HttpStatus = require('http-status-codes');
const Talent = require('../models/Talent');

const createTalent = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ 
                message: !name ? 'No talent name was given' : 'No description was given'
            });
        }
        const existingTalent = await Talent.findOne({ name });
        if (existingTalent) {
            return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ message: 'Talent with given name already exists' });
        }
        const newTalent = new Talent({ name, description });
        await newTalent.save();
        res.status(HttpStatus.StatusCodes.CREATED).json(newTalent);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error creating talent', error: error.message });
    }
};

const getTalents = async (req, res) => {
    try {
        const talents = await Talent.find();
        res.status(HttpStatus.StatusCodes.OK).json(talents);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching talents', error: error.message });
    }
};

const getTalentById = async (req, res) => {
    try {
        const talent = await Talent.findById(req.params.id);
        if (!talent) {
            return res.status(HttpStatus.StatusCodes.NOT_FOUND).json({ message: 'Talent not found' });
        }
        res.status(HttpStatus.StatusCodes.OK).json(talent);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching talent data', error: error.message });
    }
};

const updateTalent = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ 
                message: !name ? 'No talent name was given' : 'No description was given'
            });
        }

        const updatedTalent = await Talent.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true }
        );

        if (!updatedTalent) {
            return res.status(HttpStatus.StatusCodes.NOT_FOUND).json({ message: 'Talent not found' });
        }

        res.status(HttpStatus.StatusCodes.OK).json(updatedTalent);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error updating talent', error: error.message });
    }
};

module.exports = {
    createTalent,
    getTalents,
    getTalentById,
    updateTalent
};
