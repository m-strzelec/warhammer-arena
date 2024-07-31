const express = require('express');
const { createTrait, getTraits, getTraitById, updateTrait } = require('../controllers/traitController');
const router = express.Router();

router.post('/', createTrait);
router.get('/', getTraits);
router.get('/:id', getTraitById);
router.put('/:id', updateTrait);

module.exports = router;
