const Character = require('../models/Character');
const { getFullCharacterById } = require('../services/characterService');

const characterRPCHandler = async (message) => {
    const { action, characterIds } = JSON.parse(message.content.toString());

    if (action === 'checkCharactersExist') {
        if (!characterIds || !characterIds.length) return { valid: false };
        const count = await Character.countDocuments({ _id: { $in: characterIds } });
        return { valid: count === characterIds.length };
    }

    if (action === 'getCharacterById') {
        const character = await getFullCharacterById(id);
        return character;
    }

    if (action === 'getCharacterShortById') {
        const character = await Character.findById(id).select('_id name race');
        const response = character ? character.toObject() : null;
        return response;
    }

    throw new Error('Unknown action type');
};

module.exports = characterRPCHandler;