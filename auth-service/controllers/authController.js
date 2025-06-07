const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const HttpStatus = require('http-status-codes');
const authService = require('../services/authService');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const register = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ message: !username ? 'No username was given' : 'No password was given' });
        }
        const existing = await authService.getUserByUsername(username);
        if (existing) {
            return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ message: 'Username already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await authService.createUser({ username, password: hashedPassword });
        res.status(HttpStatus.StatusCodes.CREATED).json(newUser);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Registration failed', error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await authService.getUserByUsername(username);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid credentials' });
        }
        const accessToken = jwt.sign({ id: user.id, type: user.type }, JWT_SECRET, { expiresIn: '10m' });
        const refreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, { expiresIn: '30m' });

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 10 * 60 * 1000
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 30 * 60 * 1000
        });
        res.status(HttpStatus.StatusCodes.OK).json({ message: 'Login successful', userId: user.id, type: user.type });
    } catch (error) {
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Login failed', error: error.message });
    }
};

const refresh = async (req, res) => {
    try{
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(HttpStatus.StatusCodes.UNAUTHORIZED).json({ message: 'No token provided' });
        }
        const isBlacklisted = await authService.isTokenBlacklisted(refreshToken);
        if (isBlacklisted) {
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            return res.status(HttpStatus.StatusCodes.FORBIDDEN).json({ message: 'Token is blacklisted' });
        }
        const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
        const user = await authService.getUserById(payload.id);
        if (!user) {
            return res.status(HttpStatus.StatusCodes.UNAUTHORIZED).json({ message: 'Invalid refresh token' });
        }
        const newAccessToken = jwt.sign({ id: payload.id, type: user.type }, JWT_SECRET, { expiresIn: '10m' });
        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 10 * 60 * 1000
        });
        res.status(HttpStatus.StatusCodes.OK).json({ message: 'Access token refreshed' });
    } catch (error) {
        res.status(HttpStatus.StatusCodes.FORBIDDEN).json({ message: 'Token is not valid', error: error.message });
    }
};

const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ message: 'Refresh token required' });
        }
        await authService.blacklistToken(refreshToken);
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.status(HttpStatus.StatusCodes.OK).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Logout failed', error: error.message });
    }
};

const getAll = async (req, res) => {
    try {
        const users = await authService.getAllUsers();
        res.status(HttpStatus.StatusCodes.OK).json(users);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching users', error: error.message });
    }
};

const getById = async (req, res) => {
    try {
        const user = await authService.getUserById(req.params.id);
        if (!user) {
            return res.status(HttpStatus.StatusCodes.NOT_FOUND).json({ message: 'User not found' });
        }
        res.status(HttpStatus.StatusCodes.OK).json(user);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching user data', error: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const updated = await authService.updateUser(req.params.id, {
            username: username,
            password: hashedPassword,
        });
        if (!updated) {
            return res.status(HttpStatus.StatusCodes.NOT_FOUND).json({ message: 'User not found or update failed' });
        }
        res.status(HttpStatus.StatusCodes.OK).json(updated);
    } catch (error) {
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error updating user', error: error.message });
    }
};

module.exports = {
    register,
    login,
    refresh,
    logout,
    getAll,
    getById,
    update
}
