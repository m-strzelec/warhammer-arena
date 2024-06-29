const HttpStatus = require('http-status-codes');
const Fight = require('../models/Fight');
const { simulateFight } = require('../services/fightService');

const createFight = async (req, res) => {
    try {
        const { character1Id, character2Id } = req.body;
        const fightResult = await simulateFight(character1Id, character2Id);
        const fight = new Fight({
            character1: character1Id,
            character2: character2Id,
            winner: fightResult.winner._id
        });
        await fight.save();
        res.status(HttpStatus.StatusCodes.CREATED).json(fightResult.log);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
};

const getFights = async (req, res) => {
    try {
        const fights = await Fight.find().populate('character1 character2 winner');
        res.status(HttpStatus.StatusCodes.OK).json(fights);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
};

const getFightById = async (req, res) => {
    try {
        const fight = await Fight.findById(req.params.id).populate('character1 character2 winner');
        if (!fight) {
            return res.status(HttpStatus.StatusCodes.NOT_FOUND).json({ error: 'Fight not found' });
        }
        res.status(HttpStatus.StatusCodes.OK).json(fight);
    } catch (error) {
        res.status(Http.StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
};

module.exports = {
    createFight,
    getFights,
    getFightById
};
