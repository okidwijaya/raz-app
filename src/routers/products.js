const express = require('express');
const productsRouter = express.Router();
const auth = require('../middlewares/authorize');
const uploads = require('../middlewares/uploadMulti');

const productsController = require('../controllers/products');

productsRouter.post(
  '/add',
  auth.checkToken,
  auth.authorizeOwner,
  uploads,
  productsController.addProducts,
);

productsRouter.get('/detail/:id', productsController.getDetailByID);
productsRouter.get('/search', productsController.searchProducts);
productsRouter.delete(
  '/:id',
  auth.checkToken,
  auth.authorizeOwner,
  productsController.deleteProduct,
);

module.exports = productsRouter;
