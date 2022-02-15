const responseHelper = require('../helpers/sendResponse');

const register = (req, res, next) => {
  const {body} = req;
  const registerBody = ['email', 'password'];
  const bodyProperty = Object.keys(body);
  const isBodyValid =
    registerBody.filter((property) => !bodyProperty.includes(property))
      .length == 0
      ? true
      : false;

  if (!isBodyValid)
    return responseHelper.error(res, 400, {msg: 'Invalid Request', data: null});
  next();
};

const login = (req, res, next) => {
  const {body} = req;
  const loginBody = ['email', 'password'];
  const bodyProperty = Object.keys(body);
  const isBodyValid =
    loginBody.filter((property) => !bodyProperty.includes(property)).length == 0
      ? true
      : false;

  if (!isBodyValid)
    return responseHelper.error(res, 400, {msg: 'Invalid Request', data: null});
  next();
};

module.exports = {register, login};
