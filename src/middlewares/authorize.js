const jwt = require('jsonwebtoken');
const db = require('../config/db');

const checkToken = (req, res, next) => {
  const token = req.header('x-access-token');
  console.log('token', token);
  const jwtOptions = {issuer: process.env.ISSUER};
  const sqlQuery = `SELECT token FROM blacklist_token WHERE token = ?`;
  db.query(sqlQuery, [token], (err, result) => {
    if (err) {
      console.log('error get token', err);
      return res.status(500).json({
        status: 500,
        msg: 'Something went wrong',
        data: null,
      });
    }
    if (result.length !== 0)
      return res.status(403).json({
        status: 403,
        msg: 'You need to login to perform this action',
        data: null,
      });
  });
  jwt.verify(token, process.env.SECRET_KEY, jwtOptions, (err, payload) => {
    if (err) {
      return res.status(403).json({
        status: 403,
        msg: 'You need to login to perform this action',
        data: null,
      });
    }
    const {id, roles} = payload;
    req.userInfo = {id, roles};
    next();
  });
};

const authorizeOwner = (req, res, next) => {
  const {roles} = req.userInfo;
  console.log('roles:', roles);
  if (roles === '1') {
    return next();
  }
  return res.status(403).json({
    status: 403,
    msg: 'You need to login as Owner to perform this action',
    data: null,
  });
};

const authorizeCustomer = (req, res, next) => {
  const {roles} = req.userInfo;
  console.log('roles', roles);
  if (roles === '2') {
    return next();
  }
  return res.status(403).json({
    status: 403,
    msg: 'You need to login as Customer to perform this action',
    data: null,
  });
};

module.exports = {
  checkToken,
  authorizeOwner,
  authorizeCustomer,
};
