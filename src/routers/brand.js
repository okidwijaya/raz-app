const express = require('express');
const brandRouter = express.Router();
const brandController = require('../controllers/brand');

brandRouter.get('/', brandController.getListBrand);

module.exports = brandRouter;
