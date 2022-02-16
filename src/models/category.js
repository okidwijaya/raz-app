const db = require('../config/db');

const getListCategory = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM category`;
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
          err: {msg: `Category can't be found`, data: null},
        });
      }
      return resolve({
        status: 200,
        result: {
          msg: `List of Categories`,
          data: result,
        },
      });
    });
  });
};
module.exports = {getListCategory};
