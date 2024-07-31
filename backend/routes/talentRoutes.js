const express = require('express');
const { createTalent, getTalents, getTalentById, updateTalent } = require('../controllers/talentController');
const router = express.Router();

router.post('/', createTalent);
router.get('/', getTalents);
router.get('/:id', getTalentById);
router.put('/:id', updateTalent);

module.exports = router;
