const express = require('express');
const { createCharacter, getCharacters, getCharacterById, updateCharacter, deleteCharacter } = require('../controllers/characterController');
const { requireUser } = require('../middleware/authContext');
const router = express.Router();

router.post('/', requireUser, createCharacter);
router.get('/', requireUser, getCharacters);
router.get('/:id', requireUser, getCharacterById);
router.put('/:id', requireUser, updateCharacter);
router.delete('/:id', requireUser, deleteCharacter);

module.exports = router;