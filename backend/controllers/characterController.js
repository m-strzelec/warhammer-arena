const HttpStatus = require('http-status-codes');
const Character = require('../models/Character');

const createCharacter = async (req, res) => {
    try {
        const { name, race, primaryStats, secondaryStats, armor, weapons, skills, talents } = req.body;
        const character = new Character({
            name: name,
            race: race,
            primaryStats: primaryStats,
            secondaryStats: secondaryStats,
            armor: armor,
            weapons: weapons,
            skills: skills,
            talents: talents,
        });
        await character.save();
        res.status(HttpStatus.StatusCodes.CREATED).json(character);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
};

const getCharacters = async (req, res) => {
    try {
        const characters = await Character.find().populate('armor weapons skills talents');
        res.status(HttpStatus.StatusCodes.OK).json(characters);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
};

const getCharacterById = async (req, res) => {
    try {
        const character = await Character.findById(req.params.id).populate('armor weapons skills talents');
        if (!character) {
            return res.status(HttpStatus.StatusCodes.NOT_FOUND).json({ error: 'Character not found' });
        }
        res.status(HttpStatus.StatusCodes.OK).json(character);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
};

module.exports = {
    createCharacter,
    getCharacters,
    getCharacterById
};