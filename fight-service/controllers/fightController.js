const HttpStatus = require('http-status-codes');
const Fight = require('../models/Fight');
const { simulateFight } = require('../services/fightService');
const { sendRPCMessage } = require('../rabbitmq/rpcClient');

const getCharacterShortInfo = async (id) => {
    if (!id) return null;
    const character = await sendRPCMessage('character_rpc_queue', { action: 'getCharacterShortById', id });
    return character ? { _id: character._id, name: character.name, race: character.race } : null;
};

const createFight = async (req, res) => {
    try {
        const { character1Id, character2Id } = req.body;
        if (!character1Id || !character2Id) {
            return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ message: 'Characters were not specified' });
        }
        if (character1Id === character2Id) {
            return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ message: 'Character cannot fight itself' });
        }
        const [character1, character2] = await Promise.all([
            sendRPCMessage('character_rpc_queue', { action: 'findCharacterById', id: character1Id }),
            sendRPCMessage('character_rpc_queue', { action: 'findCharacterById', id: character2Id })
        ]);
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
            if (fight.character1.equals(character1._id) && fight.character2.equals(character2._id)) {
                if (winner._id.equals(character1._id)) {
                    fight.character1Wins += 1;
                } else {
                    fight.character2Wins += 1;
                }
            } else {
                if (winner._id.equals(character1._id)) {
                    fight.character2Wins += 1;
                } else {
                    fight.character1Wins += 1;
                }
            }
        } else {
            fight = new Fight({
                character1: character1._id,
                character2: character2._id,
                character1Wins: winner._id.equals(character1._id) ? 1 : 0,
                character2Wins: winner._id.equals(character2._id) ? 1 : 0,
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
            const character1 = await getCharacterShortInfo(fight.character1);
            const character2 = await getCharacterShortInfo(fight.character2);
            const winner = fight.lastWinner ? await getCharacterShortInfo(fight.lastWinner) : null;
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
        const character1 = await getCharacterShortInfo(fight.character1);
        const character2 = await getCharacterShortInfo(fight.character2);
        const winner = fight.lastWinner ? await getCharacterShortInfo(fight.lastWinner) : null;
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