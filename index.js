const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const { initDb } = require('./config/database');
const route = require('./route');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Express-server-sqlite',
      version: '1.0.0',
    },
  },
  apis: ['./api-spec.yaml'],
};

const specs = swaggerJsDoc(options);
const app = express();
const PORT = 3001;

initDb();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);
app.use('/api/v1', route);

app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
