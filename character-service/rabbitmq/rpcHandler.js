const Character = require('../models/Character');
const { getFullCharacterById } = require('../services/characterService');

async function characterRPCHandler(message) {
    const { action, characterIds } = message;

    switch (action) {
        case 'checkCharactersExist': {
            if (!characterIds || !characterIds.length) return { valid: false };
            const count = await Character.countDocuments({ _id: { $in: characterIds } });
            return { valid: count === characterIds.length };
        }
        case 'getCharactersById': {
            const characters = await Promise.all(
                characterIds.map(id => getFullCharacterById(id))
            );
            return characters.filter(Boolean);
        }
        case 'getCharactersShortById': {
            const characters = await Character.find({ _id: { $in: characterIds } })
                .select('_id name race')
                .lean();
            return characters;
        }
        default:
            throw new Error(`Unknown action type: ${action}`);
    }
};

module.exports = characterRPCHandler;