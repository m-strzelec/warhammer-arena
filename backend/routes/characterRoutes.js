const express = require('express');
const { createCharacter, getCharacters, getCharacterById } = require('../controllers/characterController');
const router = express.Router();

router.post('/', createCharacter);
router.get('/', getCharacters);
router.get('/:id', getCharacterById);

module.exports = router;
