const express = require('express');
const categoryRouter = express.Router();
const categoryController = require('../controllers/category');

categoryRouter.get('/', categoryController.getListCategory);

module.exports = categoryRouter;
