const express = require('express');
const { register, login, refresh, logout, getAll, getById, getSelf, update, deleteUser } = require('../controllers/authController');
const { requireUser, requireAdmin } = require('../middleware/authContext');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/self', requireUser, getSelf);
router.get('/users', requireAdmin, getAll);
router.get('/users/:id', requireAdmin, getById);
router.put('/users/:id', requireAdmin, update);
router.delete('/users/:id', requireAdmin, deleteUser);

module.exports = router;
