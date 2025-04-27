const HttpStatus = require('http-status-codes');
const Skill = require('../models/Skill');

const createSkill = async (req, res) => {
    try {
        const { name, baseStat, description } = req.body;
        if (!name || !baseStat || !description) {
            return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ 
                message: !name ? 'No skill name was given' : 
                    !baseStat ? 'No base stat was given' :
                        'No description was given'
            });
        }
        const existingSkill = await Skill.findOne({ name });
        if (existingSkill) {
            return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ message: 'Skill with given name already exists' });
        }
        const newSkill = new Skill({ name, baseStat, description });
        await newSkill.save();
        res.status(HttpStatus.StatusCodes.CREATED).json(newSkill);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error creating skill', error: error.message });
    }
};

const getSkills = async (req, res) => {
    try {
        const skills = await Skill.find();
        res.status(HttpStatus.StatusCodes.OK).json(skills);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching skills', error: error.message });
    }
};

const getSkillById = async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id);
        if (!skill) {
            return res.status(HttpStatus.StatusCodes.NOT_FOUND).json({ message: 'Skill not found' });
        }
        res.status(HttpStatus.StatusCodes.OK).json(skill);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching skill data', error: error.message });
    }
};

const updateSkill = async (req, res) => {
    try {
        const { name, baseStat, description } = req.body;
        if (!name || !baseStat || !description) {
            return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({
                message: !name ? 'No skill name was given' :
                    !baseStat ? 'No base stat was given' :
                        'No description was given'
            });
        }

        const skill = await Skill.findByIdAndUpdate(
            req.params.id,
            { name, baseStat, description },
            { new: true }
        );

        if (!skill) {
            return res.status(HttpStatus.StatusCodes.NOT_FOUND).json({ message: 'Skill not found' });
        }

        res.status(HttpStatus.StatusCodes.OK).json(skill);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error updating skill', error: error.message });
    }
};

module.exports = {
    createSkill,
    getSkills,
    getSkillById,
    updateSkill
};
