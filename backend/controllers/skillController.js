const HttpStatus = require('http-status-codes');
const Skill = require('../models/Skill');

const createSkill = async (req, res) => {
    try {
        const skill = new Skill(req.body);
        await skill.save();
        res.status(HttpStatus.StatusCodes.CREATED).json(skill);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
};

const getSkills = async (req, res) => {
    try {
        const skills = await Skill.find();
        res.status(HttpStatus.StatusCodes.OK).json(skills);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
};

const getSkillById = async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id);
        if (!skill) {
            return res.status(HttpStatus.StatusCodes.NOT_FOUND).json({ error: 'Skill not found' });
        }
        res.status(HttpStatus.StatusCodes.OK).json(skill);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
};

module.exports = {
    createSkill,
    getSkills,
    getSkillById
};
