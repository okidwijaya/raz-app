const brandModel = require('../models/brand');
const resHelper = require('../helpers/sendResponse');

const getListBrand = (req, res) => {
  brandModel
    .getListBrand()
    .then(({status, result}) => {
      return resHelper.success(res, status, result);
    })
    .catch(({status, err}) => {
      return resHelper.error(res, status, err);
    });
};
module.exports = {getListBrand};
