const categoryModel = require('../models/category');
const resHelper = require('../helpers/sendResponse');

const getListCategory = (req, res) => {
  categoryModel
    .getListCategory()
    .then(({status, result}) => {
      return resHelper.success(res, status, result);
    })
    .catch(({status, err}) => {
      return resHelper.error(res, status, err);
    });
};

const getCategoryQuantity = (req, res) => {
  categoryModel
    .getCategoryQuantity(req.query)
    .then(({status, result}) => {
      return resHelper.success(res, status, result);
    })
    .catch(({status, err}) => {
      return resHelper.error(res, status, err);
    });
};

module.exports = {getListCategory, getCategoryQuantity};
