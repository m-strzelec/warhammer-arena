const express = require('express');
const { createTrait, getTraits, getTraitById } = require('../controllers/traitController');
const router = express.Router();

router.post('/', createTrait);
router.get('/', getTraits);
router.get('/:id', getTraitById);

module.exports = router;
