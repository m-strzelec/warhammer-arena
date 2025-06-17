const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

async function setupSwagger(app) {
  const bundled = YAML.load(path.join(__dirname, 'swaggerDocs', 'bundled.yaml'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(bundled));
}

module.exports = setupSwagger;