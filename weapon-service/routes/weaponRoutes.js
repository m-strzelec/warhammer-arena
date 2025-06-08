const express = require('express');
const { createWeapon, getWeapons, getWeaponById, updateWeapon } = require('../controllers/weaponController');
const { requireUser, requireAdmin } = require('../middleware/authContext');
const router = express.Router();

router.post('/', requireAdmin, createWeapon);
router.get('/', requireUser, getWeapons);
router.get('/:id', requireUser, getWeaponById);
router.put('/:id', requireAdmin, updateWeapon);

module.exports = router;