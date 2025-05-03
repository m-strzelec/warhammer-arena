const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const winston = require('winston');
const compression = require('compression');
const { v4: uuidv4 } = require('uuid');
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

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

const services = {
    'trait-service': {
        url: `http://trait-service:${process.env.TRAIT_SERVICE_PORT}/traits`,
        path: '/api/traits',
    },
    'armor-service': {
        url: `http://armor-service:${process.env.ARMOR_SERVICE_PORT}/armors`,
        path: '/api/armors',
    },
    'weapon-service': {
        url: `http://weapon-service:${process.env.WEAPON_SERVICE_PORT}/weapons`,
        path: '/api/weapons',
    },
    'skill-service': {
        url: `http://skill-service:${process.env.SKILL_SERVICE_PORT}/skills`,
        path: '/api/skills',
    },
    'talent-service': {
        url: `http://talent-service:${process.env.TALENT_SERVICE_PORT}/talents`,
        path: '/api/talents',
    },
    'character-service': {
        url: `http://character-service:${process.env.CHARACTER_SERVICE_PORT}/characters`,
        path: '/api/characters',
    },
    'fight-service': {
        url: `http://fight-service:${process.env.FIGHT_SERVICE_PORT}/fights`,
        path: '/api/fights',
    },
};

const circuitBreaker = (() => {
    const states = {}
    const failureThreshold = 5;
    const resetTimeout = 30000; // 30 seconds
    const requestTimeout = 5000; // 5 seconds

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

app.use((req, res, next) => {
    const requestId = uuidv4();
    req.requestId = requestId;
    logger.info({ message: 'Request received', method: req.method, url: req.originalUrl, requestId });
    const startTime = Date.now();
    const originalEnd = res.end;
    res.end = function(...args) {
      const responseTime = Date.now() - startTime;
      logger.info({ message: 'Response sent', method: req.method, url: req.originalUrl, statusCode: res.statusCode, responseTime, requestId });
      originalEnd.apply(res, args);
    };   
    next();
});

Object.entries(services).forEach(([serviceName, serviceInfo]) => {
    const middlewares = [
        circuitBreaker(serviceName)
    ];
    app.use(
        serviceInfo.path,
        ...middlewares,
        createProxyMiddleware({ 
            target: serviceInfo.url, 
            changeOrigin: true,
            pathRewrite: path => path,
            onProxyReq: (proxyReq, req, res) => {
                proxyReq.setHeader('X-Request-ID', req.requestId);
                logger.debug({ 
                    message: 'Proxying request', 
                    service: serviceName, 
                    method: req.method, 
                    path: req.path, 
                    requestId: req.requestId 
                });
            },
            onProxyRes: (proxyRes, req, res) => {
                proxyRes.headers['X-Powered-By'] = 'Wharena-Gateway';
                logger.debug({
                    message: 'Received response from service',
                    service: serviceName,
                    statusCode: proxyRes.statusCode,
                    requestId: req.requestId
                });
            },
            onError: (err, req, res) => {
                logger.error({
                    message: 'Proxy error',
                    service: serviceName,
                    error: err.message,
                    requestId: req.requestId
                });
                res.status(500).json({ status: 'error', message: 'Internal server error', requestId: req.requestId });
            }
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