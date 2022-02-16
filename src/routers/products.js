const express = require('express');
const productsRouter = express.Router();
const auth = require('../middlewares/authorize');

const productsController = require('../controllers/products');

// productsRouter.post(
//   '/add',
//   auth.checkToken,
//   auth.authorizeOwner,
//   productsController.addProducts,
// );
productsRouter.get('/detail/:id', productsController.getDetailByID);
productsRouter.get('/search', productsController.searchProducts);

module.exports = productsRouter;
