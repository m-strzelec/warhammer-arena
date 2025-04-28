const Character = require('./models/Character');

const characterRPCHandler = async (message) => {
    const { action, characterIds } = JSON.parse(message.content.toString());

    if (action === 'checkCharactersExist') {
        if (!characterIds || !characterIds.length) return { valid: false };
        const count = await Character.countDocuments({ _id: { $in: characterIds } });
        return { valid: count === characterIds.length };
    }

    if (action === 'findCharactersByIds') {
        const characters = await Character.find({ _id: { $in: characterIds } });
        return characters;
    }

    throw new Error('Unknown action type');
};

module.exports = characterRPCHandler;