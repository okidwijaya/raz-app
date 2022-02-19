const userModel = require('../models/user');
const resHelper = require('../helpers/sendResponse');

const getDetailUser = (req, res) => {
  const {params, userInfo} = req;
  userModel
    .getDetailUser(params.id, userInfo.roles)
    .then(({status, result}) => {
      return resHelper.success(res, status, result);
    })
    .catch(({status, err}) => {
      return resHelper.error(res, status, err);
    });
};

const updateUserImage = (req, res) => {
  const {userInfo, image} = req;
  userModel
    .updateImageUser(image, userInfo.id)
    .then(({status, result}) => {
      return resHelper.success(res, status, result);
    })
    .catch(({status, err}) => {
      return resHelper.error(res, status, err);
    });
};

const updateDataUser = (req, res) => {
  const {userInfo, body} = req;
  userModel
    .updateDataUser(body, userInfo.id)
    .then(({status, result}) => {
      return resHelper.success(res, status, result);
    })
    .catch(({status, err}) => {
      return resHelper.error(res, status, err);
    });
};

module.exports = {
  getDetailUser,
  updateUserImage,
  updateDataUser,
};
