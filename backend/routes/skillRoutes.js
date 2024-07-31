const express = require('express');
const { createSkill, getSkills, getSkillById, updateSkill } = require('../controllers/skillController');
const router = express.Router();

router.post('/', createSkill);
router.get('/', getSkills);
router.get('/:id', getSkillById);
router.put('/:id', updateSkill);

module.exports = router;
