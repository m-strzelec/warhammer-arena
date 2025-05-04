const HttpStatus = require('http-status-codes');
const Fight = require('../models/Fight');
const { simulateFight } = require('../services/fightService');
const { sendRPCMessage } = require('../rabbitmq/rpcClient');

const createFight = async (req, res) => {
    try {
        const { character1Id, character2Id } = req.body;
        if (!character1Id || !character2Id) {
            return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ message: 'Characters were not specified' });
        }
        if (character1Id === character2Id) {
            return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ message: 'Character cannot fight itself' });
        }
        const charactersResponse = await sendRPCMessage(
            'character_rpc_queue', 
            { action: 'getCharactersById', characterIds: [character1Id, character2Id] }
        );
        const [character1, character2] = charactersResponse;
        if (!character1 || !character2) {
            return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ message: 'One or both characters not found' });
        }
        
        const { log, winner } = await simulateFight(character1, character2);
        let fight = await Fight.findOne({
            $or: [
                { character1: character1._id, character2: character2._id },
                { character1: character2._id, character2: character1._id }
            ]
        });
        if (fight) {
            fight.totalFights += 1;
            fight.lastWinner = winner._id
            if (fight.character1 === character1._id && fight.character2 === character2._id) {
                if (winner._id === character1._id) {
                    fight.character1Wins += 1;
                } else {
                    fight.character2Wins += 1;
                }
            } else {
                if (winner._id === character1._id) {
                    fight.character2Wins += 1;
                } else {
                    fight.character1Wins += 1;
                }
            }
        } else {
            fight = new Fight({
                character1: character1._id,
                character2: character2._id,
                character1Wins: winner._id === character1._id ? 1 : 0,
                character2Wins: winner._id === character2._id ? 1 : 0,
                totalFights: 1,
                lastWinner: winner._id
            });
        }
        await fight.save();
        res.status(HttpStatus.StatusCodes.CREATED).json({ winnerId: winner._id, log: log });
    } catch (error) {
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error simulating fight', error: error.message });
    }
};

const getFights = async (req, res) => {
    try {
        const fights = await Fight.find();
        const enrichedFights = await Promise.all(fights.map(async fight => {
            const charactersResponse = await sendRPCMessage(
                'character_rpc_queue', 
                { action: 'getCharactersShortById', characterIds: [fight.character1, fight.character2, fight.lastWinner] }
            );
            const [character1, character2, winner] = charactersResponse;
            return {
                ...fight.toObject(),
                character1,
                character2,
                lastWinner: winner
            };
        }));
        res.status(HttpStatus.StatusCodes.OK).json(enrichedFights);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching fights', error: error.message });
    }
};

const getFightById = async (req, res) => {
    try {
        const fight = await Fight.findById(req.params.id);
        if (!fight) {
            return res.status(HttpStatus.StatusCodes.NOT_FOUND).json({ message: 'Fight not found' });
        }
        const characterResponse = await sendRPCMessage(
            'character_rpc_queue', 
            { action: 'getCharactersShortById', characterIds: [fight.character1, fight.character2, fight.lastWinner] }
        );
        const [character1, character2, winner] = characterResponse;
        const enrichedFight = {
            ...fight.toObject(),
            character1,
            character2,
            lastWinner: winner
        };
        res.status(HttpStatus.StatusCodes.OK).json(enrichedFight);
    } catch (error) {
        res.status(Http.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching fight data', error: error.message });
    }
};

module.exports = {
    createFight,
    getFights,
    getFightById
};