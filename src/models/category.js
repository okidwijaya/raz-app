const db = require('../config/db');
const mysql = require('mysql');

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

const getCategoryQuantity = (query) => {
  return new Promise((resolve, reject) => {
    console.log(query);
    const {sort} = query;
    let sqlSort = 'totalProduct DESC';
    if (sort && sort.toLowerCase() === 'category asc') {
      sqlSort = 'c.category ASC';
    }
    if (sort && sort.toLowerCase() === 'category desc') {
      sqlSort = 'c.category DESC';
    }
    const sql = `SELECT c.id, c.category, count(cp.idProduct) as totalProduct 
    FROM category c LEFT JOIN category_product cp 
    ON cp.idCategory = c.id GROUP BY c.id ORDER BY ?`;
    db.query(sql, [mysql.raw(sqlSort)], (err, result) => {
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
          msg: `List of Categories Quantity`,
          data: result,
        },
      });
    });
  });
};

module.exports = {getListCategory, getCategoryQuantity};
