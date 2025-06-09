const HttpStatus = require('http-status-codes');
const Character = require('../models/Character');
const { getFullCharacterById } = require('../services/characterService');
const { sendRPCMessage } = require('../rabbitmq/rpcClient');


const createCharacter = async (req, res) => {
    try {
        const { userId } = req.auth;
        const { name, race, primaryStats, secondaryStats, armor, weapons, skills, talents } = req.body;
        if (!name || !race || !primaryStats) {
            return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({
                message: !name ? 'No character name was given' :
                    !race ? 'No character race was given' :
                        !primaryStats ? 'No primary stats were given' :
                            'No secondary stats were given'
            });
        }
        const existingCharacter = await Character.findOne({ name, userId });
        if (existingCharacter) {
            return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ message: 'Character with given name already exists' });
        }
        const newCharacter = new Character({ name, race, primaryStats, secondaryStats, armor, weapons, skills, talents, userId });
        await newCharacter.save();
        res.status(HttpStatus.StatusCodes.CREATED).json(newCharacter);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error creating character', error: error.message });
    }
};

const getCharacters = async (req, res) => {
    try {
        const { userId, role } = req.auth;
        const characters = role === 'ADMIN'
            ? await Character.find({}, '_id name userId')
            : await Character.find({ userId }, '_id name');
        res.status(HttpStatus.StatusCodes.OK).json(characters);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching characters', error: error.message });
    }
};

const getCharacterById = async (req, res) => {
    try {
        const { userId, role } = req.auth;
        const character = await Character.findById(req.params.id);
        if (!character) {
            return res.status(HttpStatus.StatusCodes.NOT_FOUND).json({ message: 'Character not found' });
        }
        if (role !== 'ADMIN' && character.userId !== userId) {
            return res.status(HttpStatus.StatusCodes.FORBIDDEN).json({ message: 'Access denied' });
        }
        const fullCharacterData = await getFullCharacterById(req.params.id);
        res.status(HttpStatus.StatusCodes.OK).json(fullCharacterData);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching character data', error: error.message });
    }
};

const updateCharacter = async (req, res) => {
    try {
        const { userId, role } = req.auth;
        const character = await Character.findById(req.params.id);
        if (!character) {
            return res.status(HttpStatus.StatusCodes.NOT_FOUND).json({ message: 'Character not found' });
        }
        if (role !== 'ADMIN' && character.userId !== userId) {
            return res.status(HttpStatus.StatusCodes.FORBIDDEN).json({ message: 'Access denied' });
        }
        const allowedUpdates = { ...req.body };
        delete allowedUpdates.userId;
        Object.assign(character, allowedUpdates);
        await character.save();
        res.status(HttpStatus.StatusCodes.OK).json(character);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error updating character', error: error.message });
    }
};

const deleteCharacter = async (req, res) => {
    try {
        const { userId, role } = req.auth;
        const character = await Character.findById(req.params.id);
        if (!character) {
            return res.status(HttpStatus.StatusCodes.NOT_FOUND).json({ message: 'Character not found' });
        }
        if (role !== 'ADMIN' && character.userId !== userId) {
            return res.status(HttpStatus.StatusCodes.FORBIDDEN).json({ message: 'Access denied' });
        }
        await character.deleteOne();
        const deletedCount = await sendRPCMessage('fight-rpc-queue', { action: 'removeCharacterReferences', characterId: character._id });
        res.status(HttpStatus.StatusCodes.OK).json({ message: `Character and related ${deletedCount} fight records removed` });
    } catch (error) {
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error deleting character', error: error.message });
    }
};

module.exports = {
    createCharacter,
    getCharacters,
    getCharacterById,
    updateCharacter,
    deleteCharacter
};