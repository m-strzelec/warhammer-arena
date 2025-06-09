const express = require('express');
const { createTrait, getTraits, getTraitById, updateTrait, deleteTrait } = require('../controllers/traitController');
const { requireUser, requireAdmin } = require('../middleware/authContext');
const router = express.Router();

router.post('/', requireAdmin, createTrait);
router.get('/', requireUser, getTraits);
router.get('/:id', requireUser, getTraitById);
router.put('/:id', requireAdmin, updateTrait);
router.delete('/:id', requireAdmin, deleteTrait);

module.exports = router;