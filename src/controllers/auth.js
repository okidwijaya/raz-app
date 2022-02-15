const authModel = require('../models/auth');
const resHelper = require('../helpers/sendResponse');

const register = (req, res) => {
  const {body} = req;
  console.log(body);
  authModel
    .register(body)
    .then(({status, result}) => {
      return resHelper.success(res, status, result);
    })
    .catch(({status, err}) => {
      resHelper.error(res, status, err);
    });
};

const login = (req, res) => {
  const {body} = req;
  authModel
    .login(body)
    .then(({status, result}) => {
      resHelper.success(res, status, result);
    })
    .catch(({status, err}) => {
      resHelper.error(res, status, err);
    });
};

const logout = (req, res) => {
  const token = req.header('x-access-token');
  authModel
    .logout(token)
    .then(({status, result}) => {
      return resHelper.success(res, status, result);
    })
    .catch(({status, err}) => {
      resHelper.error(res, status, err);
    });
};

module.exports = {register, login, logout};
