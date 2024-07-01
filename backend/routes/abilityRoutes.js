const express = require('express');
const { createAbility, getAbilities, getAbilityById } = require('../controllers/abilityController');
const router = express.Router();

router.post('/', createAbility);
router.get('/', getAbilities);
router.get('/:id', getAbilityById);

module.exports = router;
