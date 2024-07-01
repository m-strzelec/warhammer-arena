const HttpStatus = require('http-status-codes');
const Ability = require('../models/Ability');

const createAbility = async (req, res) => {
    try {
        const ability = new Ability(req.body);
        await ability.save();
        res.status(HttpStatus.StatusCodes.CREATED).json(ability);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
};

const getAbilities = async (req, res) => {
    try {
        const abilities = await Ability.find();
        res.status(HttpStatus.StatusCodes.OK).json(abilities);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
};

const getAbilityById = async (req, res) => {
    try {
        const ability = await Ability.findById(req.params.id);
        if (!ability) {
            return res.status(HttpStatus.StatusCodes.NOT_FOUND).json({ error: 'Ability not found' });
        }
        res.status(HttpStatus.StatusCodes.OK).json(ability);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
};

module.exports = {
    createAbility,
    getAbilities,
    getAbilityById
};
