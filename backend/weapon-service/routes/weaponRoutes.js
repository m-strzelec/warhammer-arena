const express = require('express');
const { createWeapon, getWeapons, getWeaponById, updateWeapon } = require('../controllers/weaponController');
const router = express.Router();

router.post('/', createWeapon);
router.get('/', getWeapons);
router.get('/:id', getWeaponById);
router.put('/:id', updateWeapon);

module.exports = router;