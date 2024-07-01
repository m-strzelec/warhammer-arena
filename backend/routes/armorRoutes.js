const express = require('express');
const { createArmor, getArmor, getArmorById } = require('../controllers/armorController');
const router = express.Router();

router.post('/', createArmor);
router.get('/', getArmor);
router.get('/:id', getArmorById);

module.exports = router;
