const express = require('express');
const { createFight, getFights, getFightById } = require('../controllers/fightController');
const { requireUser } = require('../middleware/authContext');
const router = express.Router();

router.post('/', requireUser, createFight);
router.get('/', requireUser, getFights);
router.get('/:id', requireUser, getFightById);

module.exports = router;