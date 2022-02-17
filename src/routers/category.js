const express = require('express');
const categoryRouter = express.Router();
const categoryController = require('../controllers/category');

categoryRouter.get('/', categoryController.getListCategory);
categoryRouter.get('/quantity', categoryController.getCategoryQuantity)
module.exports = categoryRouter;
