const express = require('express');
const { createSkill, getSkills, getSkillById, updateSkill, deleteSkill } = require('../controllers/skillController');
const { requireUser, requireAdmin } = require('../middleware/authContext');
const router = express.Router();

router.post('/', requireAdmin, createSkill);
router.get('/', requireUser, getSkills);
router.get('/:id', requireUser, getSkillById);
router.put('/:id', requireAdmin, updateSkill);
router.delete('/:id', requireAdmin, deleteSkill);

module.exports = router;