const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const {getTimeStamp} = require('../helpers/getTimeStamp');
const {sendForgotPass} = require('../helpers/sendOtp');
const register = (body) => {
  return new Promise((resolve, reject) => {
    const email = body.email;
    console.log(email);
    const registerEmail = `SELECT email FROM user WHERE email = ?`;
    db.query(registerEmail, [email], (err, result) => {
      console.log(err);
      if (err)
        return reject({
          status: 500,
          err: {msg: 'Something went wrong', data: null},
        });
      console.log(result);
      if (result.length >= 1)
        return reject({
          status: 400,
          err: {msg: 'Email is already registered', data: null},
        });

      const timestamp = getTimeStamp();
      const sqlQuery = 'INSERT INTO user SET ?';
      bcrypt
        .hash(body.password, 10)
        .then((hashedPassword) => {
          const newBody = {
            ...body,
            createdAt: timestamp,
            password: hashedPassword,
          };
          db.query(sqlQuery, [newBody], (err, result) => {
            if (err)
              return reject({status: 500, err: {msg: 'Something went wrong'}});
            return resolve({
              status: 201,
              result: {
                msg: 'Registration Success',
                data: {
                  id: result.insertId,
                  roles: newBody.roles,
                  email: newBody.email,
                },
              },
            });
          });
        })
        .catch((err) => {
          reject({status: 500, err: {msg: 'Something went wrong'}});
        });
    });
  });
};

const login = (body) => {
  return new Promise((resolve, reject) => {
    const {email, password, rememberMe} = body;
    const sqlQuery = 'SELECT * FROM user WHERE ?';
    db.query(sqlQuery, [{email}], async (err, result) => {
      if (err) {
        console.log(err);
        return reject({
          status: 500,
          err: {msg: 'Login Failed', data: null},
        });
      }
      if (result.length == 0)
        return reject({
          status: 401,
          err: {msg: 'Invalid Email/Password', data: null},
        });

      try {
        const hashedPassword = result[0].password;
        const checkPassword = await bcrypt.compare(password, hashedPassword);
        if (checkPassword) {
          const payload = {
            id: result[0].id,
            roles: result[0].roles,
          };
          let expiresIn = rememberMe === 'true' ? '2d' : '2h';
          const jwtOptions = {
            expiresIn,
            issuer: process.env.ISSUER,
          };
          jwt.sign(
            payload,
            process.env.SECRET_KEY,
            jwtOptions,
            (err, token) => {
              if (err) {
                console.log(err);
                return reject({
                  status: 500,
                  err: {msg: 'Login Failed', data: null},
                });
              }
              const data = {
                token,
                id: result[0].id,
                image: result[0].image,
                roles: payload.roles,
              };
              resolve({status: 200, result: {msg: 'Login Success', data}});
            },
          );
        } else {
          return reject({
            status: 401,
            err: {msg: 'Invalid Email/Password', data: null},
          });
        }
      } catch (err) {
        return reject({
          status: 500,
          err: {msg: 'Login Failed', data: null},
        });
      }
    });
  });
};

const getOtp = (body) => {
  return new Promise((resolve, reject) => {
    const {email} = body;
    const sqlQuery = `SELECT * FROM user WHERE email = ?`;

    db.query(sqlQuery, [email], (err, result) => {
      if (err) {
        console.log(err);
        return reject({
          status: 500,
          err: {msg: 'Something went wrong', data: null},
        });
      }
      if (result.length == 0)
        return reject({
          status: 401,
          err: {msg: 'Email is invalid', data: null},
        });
      const name = result[0].name;
      const otp = Math.ceil(Math.random() * 1000 * 1000);
      const sqlQuery = `UPDATE user SET otp = ? WHERE email = ?`;

      db.query(sqlQuery, [otp, email], (err) => {
        if (err)
          return reject({
            status: 500,
            err: {msg: 'Something went wrong', data: null},
          });
        sendForgotPass(email, {name: name, otp});
        const data = {
          email: email,
        };
        resolve({status: 200, result: {msg: 'Please check your email', data}});
      });
    });
  });
};

const checkOtp = (body) => {
  return new Promise((resolve, reject) => {
    const {email, otp} = body;
    const sqlQuery = `SELECT email, otp FROM user WHERE email = ? AND otp = ?`;
    db.query(sqlQuery, [email, otp], (err, result) => {
      if (err) return reject({status: 500, err});
      if (result.length === 0)
        return reject({status: 401, err: {msg: 'Invalid OTP'}});
      const data = {
        email: email,
      };
      resolve({status: 200, result: {msg: 'OTP is valid', data}});
    });
  });
};

const resetPassword = (body) => {
  return new Promise((resolve, reject) => {
    const {email, password, otp} = body;
    const sqlQuery = `SELECT * FROM user WHERE email = ? AND otp = ?`;

    db.query(sqlQuery, [email, otp], (err) => {
      if (err)
        return reject({
          status: 500,
          err: {msg: 'Something went wrong', data: null},
        });

      bcrypt
        .hash(password, 10)
        .then((hashedPassword) => {
          const sqlUpdatePass = `UPDATE user SET password = ?, otp = null WHERE email = ? AND otp = ?`;
          db.query(sqlUpdatePass, [hashedPassword, email, otp], (err) => {
            if (err) {
              return reject({
                status: 500,
                err: {msg: 'Something went wrong', data: null},
              });
            }
            return resolve({
              status: 200,
              result: {
                msg: 'Reset password success',
                data: {
                  email,
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

const logout = (token) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = `INSERT INTO blacklist_token (token) VALUES (?)`;

    db.query(sqlQuery, [token], (err, result) => {
      if (err)
        return reject({
          status: 500,
          err: {msg: 'Logout Failed', data: null},
        });
      return resolve({
        status: 200,
        result: {msg: 'Logout Success', data: null},
      });
    });
  });
};

const changePassword = (oldPassword, newPassword, id) => {
  return new Promise((resolve, reject) => {
    const sqlGetOldPassword =
      'SELECT id, email, password from user WHERE id = ?';
    db.query(sqlGetOldPassword, [id], (err, result) => {
      if (err) {
        return reject({
          status: 500,
          err: {msg: 'Something went wrong', data: null},
        });
      }
      const passwordHased = result[0].password;
      bcrypt.compare(oldPassword, passwordHased, (err, result) => {
        if (err) {
          return reject({
            status: 500,
            err: {msg: 'Something went wrong', data: null},
          });
        }
        if (result === false) {
          return reject({
            status: 400,
            err: {msg: 'Incorect old password', data: null},
          });
        }
        bcrypt
          .hash(newPassword, 10)
          .then((hashedPassword) => {
            const sqlUpdatePassword = `UPDATE user
            SET password = ?
            WHERE id = ?`;
            db.query(sqlUpdatePassword, [hashedPassword, id], (err, result) => {
              if (err) {
                return reject({
                  status: 500,
                  err: {msg: 'Something went wrong', data: null},
                });
              }
              return resolve({
                status: 200,
                result: {msg: 'Update password success', data: null},
              });
            });
          })
          .catch((err) => {
            console.log(err);
            return reject({
              status: 500,
              err: {msg: 'Something went wrong', data: null},
            });
          });
      });
    });
  });
};

module.exports = {
  register,
  login,
  getOtp,
  checkOtp,
  changePassword,
  logout,
  resetPassword,
};
