const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const register = (body) => {
  return new Promise((resolve, reject) => {
    const email = body.email;
    console.log(email);
    const registerEmail = `SELECT email FROM user WHERE email = ?`;
    db.query(registerEmail, [email], (err, result) => {
      console.log(err);
      if (err) return reject({status: 500, err});
      console.log(result);
      if (result.length >= 1)
        return reject({
          status: 400,
          result: {msg: 'Email is already registered', data: null},
        });

      const sqlQuery = 'INSERT INTO user SET ?';
      bcrypt
        .hash(body.password, 10)
        .then((hashedPassword) => {
          const newBody = {
            ...body,
            roles: 2,
            password: hashedPassword,
          };
          db.query(sqlQuery, [newBody], (err, result) => {
            if (err) return reject({status: 500, err});
            return resolve({
              status: 201,
              result: {
                msg: 'Registration Success',
                result: {
                  id: result.insertId,
                  email: newBody.email,
                },
              },
            });
          });
        })
        .catch((err) => {
          reject({status: 500, err});
        });
    });
  });
};

const login = (body) => {
  return new Promise((resolve, reject) => {
    const {email, password} = body;
    const sqlQuery = 'SELECT * FROM user WHERE ?';

    db.query(sqlQuery, [{email}], async (err, result) => {
      if (err) return reject({status: 500, err});
      if (result.length == 0)
        return reject({
          status: 401,
          result: {msg: 'Invalid Email/Password'},
        });

      try {
        const hashedPassword = result[0].password;
        const checkPassword = await bcrypt.compare(password, hashedPassword);
        if (checkPassword) {
          const payload = {
            id: result[0].id,
            roles: result[0].roles,
          };
          const jwtOptions = {
            expiresIn: '2h',
            issuer: process.env.ISSUER,
          };
          jwt.sign(
            payload,
            process.env.SECRET_KEY,
            jwtOptions,
            (err, token) => {
              if (err)
                return reject({
                  status: 500,
                  result: {msg: 'Login Failed', data: null},
                });
              const data = {
                token,
                image: result[0].image,
                roles: payload.roles,
              };
              resolve({status: 200, result: {msg: 'Login Success', data}});
            },
          );
        } else {
          reject({
            status: 401,
            result: {msg: 'Invalid Email/Password', data: null},
          });
        }
      } catch (err) {
        reject({
          status: 500,
          result: {msg: 'Login Failed', data: null},
        });
      }
    });
  });
};

const forgotPassword = (body) => {
  return new Promise((resolve, reject) => {
    const {email} = body;
    const sqlQuery = `SELECT * FROM user WHERE email = ?`;

    db.query(sqlQuery, [email], (err, result) => {
      if (err) return reject({status: 500, err});
      if (result.length == 0)
        return reject({
          status: 401,
          result: {errMsg: 'Invalid Email'},
        });

      const otp = Math.ceil(Math.random() * 1000000);
      console.log('OTP ', otp);

      const sqlQuery = `UPDATE user SET otp = ? WHERE email = ?`;
      db.query(sqlQuery, [otp, email], (err) => {
        if (err) return reject({status: 500, err});
        const data = {
          email: email,
        };

        resolve({status: 200, result: data});
      });
    });
  });
};

const checkOTP = (body) => {
  return new Promise((resolve, reject) => {
    const {email, otp} = body;
    const sqlQuery = `SELECT email, otp FROM user WHERE email = ? AND otp = ?`;

    db.query(sqlQuery, [email, otp], (err, result) => {
      if (err) return reject({status: 500, err});
      if (result.length === 0) return reject({status: 401, err: 'Invalid OTP'});
      const data = {
        email: email,
      };
      resolve({status: 200, result: data});
    });
  });
};

const resetPassword = (body) => {
  return new Promise((resolve, reject) => {
    const {email, password, otp} = body;
    const sqlQuery = `SELECT * FROM user WHERE email = ? AND otp = ?`;

    db.query(sqlQuery, [email, otp], (err) => {
      if (err) return reject({status: 500, err});

      const sqlUpdatePass = `UPDATE user SET password = ? WHERE email = ? AND otp =?`;
      bcrypt
        .hash(password, 10)
        .then((hashedPassword) => {
          db.query(sqlUpdatePass, [hashedPassword, email, otp], (err) => {
            if (err) return reject({status: 500, err});

            const sqlUpdateOTP = `UPDATE user SET otp = null WHERE email = ?`;
            db.query(sqlUpdateOTP, [email], (err, result) => {
              if (err) return reject({status: 500, err});
              resolve({status: 201, result});
            });
          });
        })
        .catch((err) => {
          reject({status: 500, err});
        });
    });
  });
};

const logout = (token) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = `INSERT INTO blacklist_token (token) VALUES (?)`;

    db.query(sqlQuery, [token], (err, result) => {
      if (err)
        return reject({status: 500, result: {msg: 'Logout Failed', data: null}});
      resolve({status: 200, result: {msg: 'Logout Success', data: null}});
    });
  });
};

module.exports = {
  register,
  login,
  forgotPassword,
  checkOTP,
  resetPassword,
  logout,
};
