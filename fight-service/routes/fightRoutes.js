const express = require('express');
const { createFight, getFights, getFightById } = require('../controllers/fightController');
const router = express.Router();

router.post('/', createFight);
router.get('/', getFights);
router.get('/:id', getFightById);

module.exports = router;