require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const app = express();
const cors = require('cors');
const router = require('./src/routers/main');
const bodyParser = require('body-parser');
const path = require('path');

const logger = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
);

app.use('/', express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running in port : ${port}`);
});

const corsOption = {
  // origin: ['https://localhost:3000','http://localhost:3000', 'https://rentalme.netlify.app'],
  origin: '*',
};

app.use(cors(corsOption));
app.options('/*', (req, res) => {
  const corsHeader = {
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE',
    'Access-Control-Allow-Headers': ['x-access-token', 'content-type'],
  };
  res.set(corsHeader);
  res.status(204);
});

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(logger);
app.use(router);
