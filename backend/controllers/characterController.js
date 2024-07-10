const HttpStatus = require('http-status-codes');
const Character = require('../models/Character');

const createCharacter = async (req, res) => {
    try {
        const character = new Character(req.body);
        await character.save();
        res.status(HttpStatus.StatusCodes.CREATED).json(character);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
};

const getCharacters = async (req, res) => {
    try {
        const characters = await Character.find({}, '_id name');
        res.status(HttpStatus.StatusCodes.OK).json(characters);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
};

const getCharacterById = async (req, res) => {
    try {
        const character = await Character.findById(req.params.id).populate(
            'armor.head armor.body armor.leftArm armor.rightArm armor.leftLeg armor.rightLeg weapons skills.skill talents'
        );
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