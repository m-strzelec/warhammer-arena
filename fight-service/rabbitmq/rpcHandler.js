const Fight = require('../models/Fight');

const fightRPCHandler = async (message) => {
    const { action, characterId } = message;

    switch (action) {
        case 'removeCharacterReferences': {
            if (!characterId) return;
            const result = await Fight.deleteMany({
                $or: [
                    { character1: characterId },
                    { character2: characterId }
                ]
            });
            return result.deletedCount;
        }
        default:
            throw new Error(`Unknown action type: ${action}`);
    }
}

module.exports = fightRPCHandler;