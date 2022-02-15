const db = require('../config/db');
const getTimeStamp = require('../helpers/getTimeStamp');

const getDetailByID = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id, name, stock, price, description, productCondition, color, createdAt FROM product WHERE id = ?`;
    db.query(sql, [id], (err, result) => {
      console.log(err);
      if (err) {
        return reject({
          status: 500,
          err: {msg: 'Something went wrong', data: null},
        });
      }
      if (result.length === 0) {
        return reject({
          status: 404,
          err: {msg: `Data can't be found`, data: null},
        });
      }

      let detailProduct = {...result[0]};
      console.log(result);
      const sqlImages = `SELECT image FROM image_product WHERE idProduct = ?`;
      db.query(sqlImages, [id], (err, result) => {
        if (err) {
          return reject({
            status: 500,
            err: {msg: 'Something went wrong', data: null},
          });
        }
        detailProduct = {...detailProduct, images: result};
        return resolve({
          status: 201,
          result: {
            msg: `Detail product ${id}`,
            data: {
              detailProduct,
            },
          },
        });
      });
    });
  });
};

module.exports = {
  getDetailByID,
};
