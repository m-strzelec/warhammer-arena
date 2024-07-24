const HttpStatus = require('http-status-codes');
const Character = require('../models/Character');

const createCharacter = async (req, res) => {
    try {
        const { name, race, primaryStats, secondaryStats, armor, weapons, skills, talents } = req.body;
        if (!name || !race || !primaryStats) {
            return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ 
                message: !name ? 'No character name was given' : 
                    !race ? 'No character race was given' :
                        !primaryStats ? 'No primary stats were given' :
                            'No secondary stats were given'
            });
        }
        const existingCharacter = await Character.findOne({ name });
        if (existingCharacter) {
            return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ message: 'Character with given name already exists' });
        }
        const newCharacter = new Character({ name, race, primaryStats, secondaryStats, armor, weapons, skills, talents });
        await newCharacter.save();
        res.status(HttpStatus.StatusCodes.CREATED).json(newCharacter);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error creating character', error: error.message });
    }
};

const getCharacters = async (req, res) => {
    try {
        const characters = await Character.find({}, '_id name');
        res.status(HttpStatus.StatusCodes.OK).json(characters);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching characters', error: error.message });
    }
};

const getCharacterById = async (req, res) => {
    try {
        const character = await Character.findById(req.params.id).populate(
            'armor.head armor.body armor.leftArm armor.rightArm armor.leftLeg armor.rightLeg weapons skills.skill talents'
        );
        if (!character) {
            return res.status(HttpStatus.StatusCodes.NOT_FOUND).json({ message: 'Character not found' });
        }
        res.status(HttpStatus.StatusCodes.OK).json(character);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching character data', error: error.message });
    }
};

module.exports = {
    createCharacter,
    getCharacters,
    getCharacterById
};