const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();
const port = process.env.GATEWAY_PORT;

app.use(cors());
app.use((req, res, next) => {
    console.log(`[GATEWAY] ${req.method} ${req.url}`);
    next();
});

app.use('/api/traits', createProxyMiddleware({ target: `http://trait-service:${process.env.TRAIT_SERVICE_PORT}`, changeOrigin: true }));
app.use('/api/armors', createProxyMiddleware({ target: `http://armor-service:${process.env.ARMOR_SERVICE_PORT}`, changeOrigin: true }));
app.use('/api/weapons', createProxyMiddleware({ target: `http://weapon-service:${process.env.WEAPON_SERVICE_PORT}`, changeOrigin: true }));
app.use('/api/skills', createProxyMiddleware({ target: `http://skill-service:${process.env.SKILL_SERVICE_PORT}`, changeOrigin: true }));
app.use('/api/talents', createProxyMiddleware({ target: `http://talent-service:${process.env.TALENT_SERVICE_PORT}`, changeOrigin: true }));
app.use('/api/characters', createProxyMiddleware({ target: `http://character-service:${process.env.CHARACTER_SERVICE_PORT}`, changeOrigin: true }));
app.use('/api/fights', createProxyMiddleware({ target: `http://fight-service:${process.env.FIGHT_SERVICE_PORT}`, changeOrigin: true }));

app.get('/health', (req, res) => res.status(200).send('OK'));

app.listen(port, () => {
    console.log(`Gateway Service running on port ${port}`);
});