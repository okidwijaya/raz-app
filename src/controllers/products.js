const productsModel = require('../models/products');
const resHelper = require('../helpers/sendResponse');

const addProducts = (req, res) => {
  productsModel
    .addProduct(req)
    .then(({status, result}) => {
      return resHelper.success(res, status, result);
    })
    .catch(({status, err}) => {
      return resHelper.error(res, status, err);
    });
};

const getDetailByID = (req, res) => {
  const {params} = req;
  productsModel
    .getDetailByID(params.id)
    .then(({status, result}) => {
      return resHelper.success(res, status, result);
    })
    .catch(({status, err}) => {
      return resHelper.error(res, status, err);
    });
};

const searchProducts = (req, res) => {
  const {query} = req;
  productsModel
    .searchProducts(query)
    .then(({status, result}) => {
      return resHelper.success(res, status, result);
    })
    .catch(({status, err}) => {
      return resHelper.error(res, status, err);
    });
};

const deleteProduct = (req, res) => {
  const {params, userInfo} = req;
  const idUser = userInfo.id;
  productsModel
    .deleteProduct(params.id, idUser)
    .then(({status, result}) => {
      return resHelper.success(res, status, result);
    })
    .catch(({status, err}) => {
      return resHelper.error(res, status, err);
    });
};

module.exports = {getDetailByID, addProducts, searchProducts, deleteProduct};
