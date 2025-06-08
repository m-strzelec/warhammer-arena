const express = require('express');
const { createCharacter, getCharacters, getCharacterById } = require('../controllers/characterController');
const { requireUser } = require('../middleware/authContext');
const router = express.Router();

router.post('/', requireUser, createCharacter);
router.get('/', requireUser, getCharacters);
router.get('/:id', requireUser, getCharacterById);

module.exports = router;