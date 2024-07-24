const express = require('express');
const { createArmor, getArmors, getArmorById } = require('../controllers/armorController');
const router = express.Router();

router.post('/', createArmor);
router.get('/', getArmors);
router.get('/:id', getArmorById);

module.exports = router;
