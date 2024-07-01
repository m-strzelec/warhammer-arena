const express = require('express');
const { createTalent, getTalents, getTalentById } = require('../controllers/talentController');
const router = express.Router();

router.post('/', createTalent);
router.get('/', getTalents);
router.get('/:id', getTalentById);

module.exports = router;
