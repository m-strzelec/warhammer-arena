const express = require('express');
const { createFight, getFights, getFightById, getFightsByCharacterId } = require('../controllers/fightController');
const { requireUser } = require('../middleware/authContext');
const router = express.Router();

router.post('/', requireUser, createFight);
router.get('/', requireUser, getFights);
router.get('/:id', requireUser, getFightById);
router.get('/characters/:id', requireUser, getFightsByCharacterId);

module.exports = router;