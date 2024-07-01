const express = require('express');
const { createWeapon, getWeapons, getWeaponById } = require('../controllers/weaponController');
const router = express.Router();

router.post('/', createWeapon);
router.get('/', getWeapons);
router.get('/:id', getWeaponById);

module.exports = router;
