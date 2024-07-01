const express = require('express');
const { createSkill, getSkills, getSkillById } = require('../controllers/skillController');
const router = express.Router();

router.post('/', createSkill);
router.get('/', getSkills);
router.get('/:id', getSkillById);

module.exports = router;
