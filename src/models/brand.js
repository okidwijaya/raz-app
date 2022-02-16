const db = require('../config/db');

const getListBrand = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM brands`;
    db.query(sql, (err, result) => {
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
          err: {msg: `Brand can't be found`, data: null},
        });
      }
      return resolve({
        status: 200,
        result: {
          msg: `List of Brands`,
          data: result,
        },
      });
    });
  });
};
module.exports = {getListBrand};
