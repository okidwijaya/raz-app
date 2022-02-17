const transactionModel = require("../models/transaction");
const resHelper = require("../helpers/sendResponse");

const userTransaction = (req, res) => {
  const { query, userInfo } = req;
  transactionModel
    .userTransaction(query, userInfo)
    .then(({ status, result }) => {
      return resHelper.success(res, status, result);
    })
    .catch(({ status, err }) => {
      return resHelper.error(res, status, err);
    });
};

const addTransaction = (req, res) => {
  transactionModel
    .addTransaction(req)
    .then(({ status, result }) => {
      return resHelper.success(res, status, result);
    })
    .catch(({ status, err }) => {
      return resHelper.error(res, status, err);
    });
};

const updateTransaction = (req, res) => {
  const { body, params } = req;
  transactionModel
    .updateTransaction(body, params.id)
    .then(({ status, result }) => {
      return resHelper.success(res, status, result);
    })
    .catch(({ status, err }) => {
      resHelper.error(res, status, err);
    });
};

const detailTransaction = (req, res) => {
  const { params } = req;
  transactionModel
    .detailTransaction(params.id)
    .then(({ status, result }) => {
      return resHelper.success(res, status, result);
    })
    .catch(({ status, err }) => {
      return resHelper.error(res, status, err);
    });
};

const deleteTransaction = (req, res) => {
  const { params, userInfo } = req;
  const idUser = userInfo.id;
  transactionModel
    .deleteTransaction(params.id, idUser)
    .then(({ status, result }) => {
      return resHelper.success(res, status, result);
    })
    .catch(({ status, err }) => {
      return resHelper.error(res, status, err);
    });
};

module.exports = {
  userTransaction,
  addTransaction,
  updateTransaction,
  detailTransaction,
  deleteTransaction,
};
