const db = require('../config/db');
const mysql = require('mysql');
const {deleteImage} = require('../helpers/deleteImage');
const {getTimeStamp} = require('../helpers/getTimeStamp');

const getDetailUser = (id, roles) => {
  return new Promise((resolve, reject) => {
    const sqlGetDetail = `SELECT id, name, email, 
    gender, roles, image ${roles === '1' ? ', description, storeName' : ''}
    FROM user WHERE id  = ?`;
    db.query(sqlGetDetail, [id], (err, result) => {
      if (err) {
        console.log(err);
        return reject({
          status: 500,
          err: {msg: 'Something went wrong', data: null},
        });
      }
      return resolve({
        status: 200,
        result: {
          msg: `Detail user ${id}`,
          data: result,
        },
      });
    });
  });
};

const updateImageUser = (image, id) => {
  return new Promise((resolve, reject) => {
    const sqlGetImage = `SELECT image FROM user WHERE id = ?`;
    db.query(sqlGetImage, [id], (err, result) => {
      if (err) {
        console.log(err);
        return reject({
          status: 500,
          err: {msg: 'Something went wrong', data: null},
        });
      }
      const imageToDel = result[0].image;
      const currentTime = getTimeStamp();
      const sqlUpdateImage = `UPDATE user SET image = ?, updatedAt = ? WHERE id = ?`;
      db.query(sqlUpdateImage, [image, currentTime, id], (err, result) => {
        if (err) {
          console.log(err);
          return reject({
            status: 500,
            err: {msg: 'Something went wrong', data: null},
          });
        }
        if (imageToDel !== null) {
          deleteImage(imageToDel);
        }
        return resolve({
          status: 200,
          result: {
            msg: `User Image Updated`,
            data: {id, image},
          },
        });
      });
    });
  });
};

const updateDataUser = (body, id) => {
  return new Promise((resolve, reject) => {
    const currentTime = getTimeStamp();
    const sqlUpdateUser = `UPDATE user SET ? WHERE id = ?`;
    const newBody = {
      ...body,
      updatedAt: currentTime,
    };
    db.query(sqlUpdateUser, [newBody, id], (err, result) => {
      if (err) {
        console.log(err);
        return reject({
          status: 500,
          err: {msg: 'Something went wrong', data: null},
        });
      }
      return resolve({
        status: 200,
        result: {
          msg: `User Data Updated`,
          data: {id, ...body},
        },
      });
    });
  });
};

module.exports = {getDetailUser, updateImageUser, updateDataUser};
