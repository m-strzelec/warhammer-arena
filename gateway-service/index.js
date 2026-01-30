const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const winston = require('winston');
const compression = require('compression');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const accessControl = require('./auth/accessControl');
const setupSwagger = require('./swagger');
require('dotenv').config();

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    defaultMeta: { service: 'gateway-service' },
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'gateway-service.log' })
    ]
});

const app = express();
const port = process.env.GATEWAY_PORT;
const JWT_SECRET = process.env.JWT_SECRET;

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(compression());
app.use(cookieParser());
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
// merge swaggerDocs: npx openapi bundle swaggerDocs/index.yaml -o swaggerDocs/bundled.yaml
setupSwagger(app);

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

const services = {
    'auth-service': {
        url: process.env.AUTH_SERVICE_URL || `http://auth-service:${process.env.AUTH_SERVICE_PORT}/auth`,
        path: '/api/auth',
    },
    'trait-service': {
        url: process.env.TRAIT_SERVICE_URL || `http://trait-service:${process.env.TRAIT_SERVICE_PORT}/traits`,
        path: '/api/traits',
    },
    'armor-service': {
        url: process.env.ARMOR_SERVICE_URL || `http://armor-service:${process.env.ARMOR_SERVICE_PORT}/armors`,
        path: '/api/armors',
    },
    'weapon-service': {
        url: process.env.WEAPON_SERVICE_URL || `http://weapon-service:${process.env.WEAPON_SERVICE_PORT}/weapons`,
        path: '/api/weapons',
    },
    'skill-service': {
        url: process.env.SKILL_SERVICE_URL || `http://skill-service:${process.env.SKILL_SERVICE_PORT}/skills`,
        path: '/api/skills',
    },
    'talent-service': {
        url: process.env.TALENT_SERVICE_URL || `http://talent-service:${process.env.TALENT_SERVICE_PORT}/talents`,
        path: '/api/talents',
    },
    'character-service': {
        url: process.env.CHARACTER_SERVICE_URL || `http://character-service:${process.env.CHARACTER_SERVICE_PORT}/characters`,
        path: '/api/characters',
    },
    'fight-service': {
        url: process.env.FIGHT_SERVICE_URL || `http://fight-service:${process.env.FIGHT_SERVICE_PORT}/fights`,
        path: '/api/fights',
    },
};

const circuitBreaker = (() => {
    const states = {}
    const failureThreshold = 5;
    const resetTimeout = 30000;
    const requestTimeout = 10000;

    return (serviceName) => {
        if (!states[serviceName]) {
            states[serviceName] = {
                isOpen: false,
                failureCount: 0,
                lastAttempt: Date.now(),
            };
        }
        return (req, res, next) => {
            const state = states[serviceName];
            if (state.isOpen) {
                const now = Date.now();
                if (now - state.lastAttempt > resetTimeout) {
                    logger.info(`Circuit for ${serviceName} half-open, attempting reset`);
                    state.isOpen = false;
                    state.failureCount = 0;
                } else {
                    logger.warn(`Circuit for ${serviceName} open, rejecting request`);
                    return res.status(503).json({ message: 'Service temporarily unavailable, please try again later' });
                }
            }
            const timeoutId = setTimeout(() => {
                state.failureCount++;
                if (state.failureCount >= failureThreshold) {
                    state.isOpen = true;
                    state.lastAttempt = Date.now();
                    logger.error(`Circuit for ${serviceName} opened due to timeout`);
                }
                res.status(504).json({ message: 'Request timed out, please try again later' });
            }, requestTimeout);

            const originalEnd = res.end;
            res.end = function (...args) {
                clearTimeout(timeoutId);
                if (res.statusCode >= 500) {
                    state.failureCount++;
                    if (state.failureCount >= failureThreshold) {
                        state.isOpen = true;
                        state.lastAttempt = Date.now();
                        logger.error(`Circuit for ${serviceName} opened due to error response`);
                    }
                } else {
                    state.failureCount = 0;
                }
                originalEnd.apply(res, args);
            };
            next();
        };
    };
})();

const authenticateJWT = (req, res, next) => {
    try {
        const token = req.cookies?.accessToken;
        if (!token) {
            return next();
        }
        const path = req.originalUrl.split('?')[0];
        if (path === '/api/auth/refresh' || path === '/api/auth/logout') {
            return next();
        }
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ message: 'Access token expired' });
                }
                return res.status(401).json({ message: 'Invalid access token' });
            }
            req.user = decoded;
            next();
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error verifying token', error: error.message });
    }
};

const authorize = (req, res, next) => {
    const method = req.method;
    const path = req.originalUrl.split('?')[0];
    logger.info({ message: 'Authorization check', path, method, user: req.user });
    const rule = accessControl.find(rule =>
        rule.method === method &&
        new RegExp('^' + rule.path.replace(/:id/g, '[^/]+') + '$').test(path)
    );
    if (!rule) return res.status(403).json({ message: 'Access denied' });
    if (rule.roles.includes('PUBLIC')) return next();
    if (!req.user) return res.status(401).json({ message: 'Unauthorized: token required' });
    if (!rule.roles.includes(req.user.type)) return res.status(403).json({ message: 'Forbidden: insufficient role' });
    next();
};

app.use((req, res, next) => {
    const requestId = uuidv4();
    req.requestId = requestId;
    logger.info({ message: 'Request received', method: req.method, url: req.originalUrl, requestId });
    const startTime = Date.now();
    const originalEnd = res.end;
    res.end = function (...args) {
        const responseTime = Date.now() - startTime;
        logger.info({ message: 'Response sent', method: req.method, url: req.originalUrl, statusCode: res.statusCode, responseTime, requestId });
        originalEnd.apply(res, args);
    };
    next();
});

Object.entries(services).forEach(([serviceName, serviceInfo]) => {
    app.use(
        serviceInfo.path,
        circuitBreaker(serviceName),
        authenticateJWT,
        authorize,
        proxy(serviceInfo.url, {
            proxyReqPathResolver: req => {
                const path = req.originalUrl.replace(/^\/api/, '');
                logger.debug({
                    message: 'Proxying request',
                    service: serviceName,
                    method: req.method,
                    path,
                    requestId: req.requestId
                });
                return path;
            },
            proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
                if (srcReq.user) {
                    proxyReqOpts.headers['x-user-id'] = srcReq.user.id;
                    proxyReqOpts.headers['x-user-role'] = srcReq.user.type;
                }
                proxyReqOpts.headers['x-request-id'] = srcReq.requestId;
                return proxyReqOpts;
            },
            userResDecorator: (proxyRes, proxyResData, req, res) => {
                logger.debug({
                    message: 'Received response from service',
                    service: serviceName,
                    statusCode: proxyRes.statusCode,
                    requestId: req.requestId
                });
                res.set('X-Powered-By', 'Wharena-Gateway');
                return proxyResData;
            },
            proxyErrorHandler: (err, req, res) => {
                logger.error({
                    message: 'Proxy error',
                    service: serviceName,
                    error: err.message,
                    requestId: req.requestId
                });
                res.status(500).json({ status: 'error', message: 'Internal server error', requestId: req.requestId });
            },
            parseReqBody: false
        })
    );
});

app.get('/health', (req, res) => res.status(200).send('OK'));

// 404 error handling
app.use((req, res) => {
    logger.warn({
        message: 'Route not found',
        method: req.method,
        url: req.originalUrl,
        requestId: req.requestId
    });
    res.status(404).json({ status: 'error', message: 'API endpoint not found', requestId: req.requestId });
});

// Global error handling
app.use((err, req, res, next) => {
    logger.error({
        message: 'Unhandled error',
        error: err.message,
        stack: err.stack,
        requestId: req.requestId
    });
    res.status(500).json({ status: 'error', message: 'Internal server error', requestId: req.requestId });
});

app.listen(port, () => {
    console.log(`API Gateway running on port ${port}`);
});

process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received. Closing HTTP server');
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('SIGINT signal received. Closing HTTP server');
    process.exit(0);
});

process.on('uncaughtException', (err) => {
    logger.error(`Uncaught exception: ${err.message}`);
    logger.error(err.stack);
    process.exit(1);
});