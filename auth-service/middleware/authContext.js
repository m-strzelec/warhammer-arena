const HttpStatus = require('http-status-codes');

const requireUser = (req, res, next) => {
    const userId = req.headers['x-user-id'];
    const role = req.headers['x-user-role'];
    if (!userId || !role) {
        return res.status(HttpStatus.StatusCodes.UNAUTHORIZED).json({ message: 'Not authenticated' });
    }
    req.auth = { userId, role };
    next();
};

const requireAdmin = (req, res, next) => {
    const userId = req.header('x-user-id');
    const role = req.header('x-user-role');
    if (!userId || role !== 'ADMIN') {
        return res.status(HttpStatus.StatusCodes.FORBIDDEN).json({ message: 'Administrator access required' });
    }
    req.auth = { userId, role };
    next();
};

module.exports = {
    requireUser,
    requireAdmin
};
