const express = require('express');
const productsRouter = express.Router();
const {
  checkToken,
  authorizeCustomer,
  authorizeSeller,
} = require('../middlewares/authorize');
const uploads = require('../middlewares/uploadMulti');

const productsController = require('../controllers/products');

productsRouter
  .get('/detail/:id', productsController.getDetailByID)
  .get('/search', productsController.searchProducts)
  .get(
    '/seller',
    checkToken,
    authorizeSeller,
    productsController.getSellerProduct,
  )
  .get('/related/:id', productsController.getRelatedProduct)
  .post(
    '/add',
    checkToken,
    authorizeSeller,
    uploads,
    productsController.addProducts,
  )
  .delete(
    '/:id',
    checkToken,
    authorizeSeller,
    productsController.deleteProduct,
  );

module.exports = productsRouter;
