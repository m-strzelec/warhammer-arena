const express = require('express');
const { createWeapon, getWeapons, getWeaponById, updateWeapon, deleteWeapon } = require('../controllers/weaponController');
const { requireUser, requireAdmin } = require('../middleware/authContext');
const router = express.Router();

router.post('/', requireAdmin, createWeapon);
router.get('/', requireUser, getWeapons);
router.get('/:id', requireUser, getWeaponById);
router.put('/:id', requireAdmin, updateWeapon);
router.delete('/:id', requireAdmin, deleteWeapon);

module.exports = router;