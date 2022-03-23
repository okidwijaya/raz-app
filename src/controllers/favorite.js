const favoriteModel = require("../models/favorite");
const resHelper = require("../helpers/sendResponse");

const userFavorite = (req, res) => {
  const { query, userInfo } = req;
  favoriteModel
    .userFavorite(query, userInfo)
    .then(({ status, result }) => {
      return resHelper.success(res, status, result);
    })
    .catch(({ status, err }) => {
      return resHelper.error(res, status, err);
    });
};

const addToFavorite = (req, res) => {
  favoriteModel
    .addToFavorite(req)
    .then(({ status, result }) => {
      return resHelper.success(res, status, result);
    })
    .catch(({ status, err }) => {
      return resHelper.error(res, status, err);
    });
};

const deleteFromFavorite = (req, res) => {
  const { params, userInfo } = req;
  const idUser = userInfo.id;
  favoriteModel
    .deleteFromFavorite(idUser, params.id)
    .then(({ status, result }) => {
      return resHelper.success(res, status, result);
    })
    .catch(({ status, err }) => {
      return resHelper.error(res, status, err);
    });
};

module.exports = {
  userFavorite,
  addToFavorite,
  deleteFromFavorite,
};
