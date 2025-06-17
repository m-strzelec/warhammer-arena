const express = require('express');
const { createTalent, getTalents, getTalentById, updateTalent, deleteTalent } = require('../controllers/talentController');
const { requireUser, requireAdmin } = require('../middleware/authContext');
const router = express.Router();

router.post('/', requireAdmin, createTalent);
router.get('/', requireUser, getTalents);
router.get('/:id', requireUser, getTalentById);
router.put('/:id', requireAdmin, updateTalent);
router.delete('/:id', requireAdmin, deleteTalent);

module.exports = router;