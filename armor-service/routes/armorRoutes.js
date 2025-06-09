const express = require('express');
const { createArmor, getArmors, getArmorById, updateArmor, deleteArmor } = require('../controllers/armorController');
const { requireUser, requireAdmin } = require('../middleware/authContext');
const router = express.Router();

router.post('/', requireAdmin, createArmor);
router.get('/', requireUser, getArmors);
router.get('/:id', requireUser, getArmorById);
router.put('/:id', requireAdmin, updateArmor);
router.delete('/:id', requireAdmin, deleteArmor);

module.exports = router;
