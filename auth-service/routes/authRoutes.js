const express = require('express');
const { register, login, refresh, logout, getAll, getById, update } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login)
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/users', getAll);
router.get('/users/:id', getById);
router.put('/users/:id', update);

module.exports = router;
