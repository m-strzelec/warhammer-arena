const HttpStatus = require('http-status-codes');
const Talent = require('../models/Talent');

const createTalent = async (req, res) => {
    try {
        const talent = new Talent(req.body);
        await talent.save();
        res.status(HttpStatus.StatusCodes.CREATED).json(talent);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
};

const getTalents = async (req, res) => {
    try {
        const talents = await Talent.find();
        res.status(HttpStatus.StatusCodes.OK).json(talents);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
};

const getTalentById = async (req, res) => {
    try {
        const talent = await Talent.findById(req.params.id);
        if (!talent) {
            return res.status(HttpStatus.StatusCodes.NOT_FOUND).json({ error: 'Talent not found' });
        }
        res.status(HttpStatus.StatusCodes.OK).json(talent);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
};

module.exports = {
    createTalent,
    getTalents,
    getTalentById
};
