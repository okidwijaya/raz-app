const db = require('../config/db');
const mysql = require('mysql');

const userFavorite = (query, userInfo) => {
  return new Promise((resolve, reject) => {
    const {page, limit} = query;
    let {id} = userInfo;
    console.log('userinfo', userInfo);
    const sqlPage = !page || page === '' ? '1' : page;
    const sqlLimit = !limit || limit === '' ? '15' : limit;
    const offset = (parseInt(sqlPage) - 1) * parseInt(sqlLimit);
    let userId = 'f.idUser = ';
    id = String(id);

    const prepare = [
      mysql.raw(userId),
      mysql.raw(id),
      mysql.raw(sqlLimit),
      offset,
    ];

    const sqlCount = `SELECT count(*) count
    FROM favorite f LEFT JOIN product p ON p.id = f.idProduct
    WHERE ? ?`;

    db.query(sqlCount, prepare, (err, result) => {
      if (err) {
        console.log(err);
        return reject({
          status: 500,
          err: {msg: 'Something went wrong', data: null},
        });
      }
      const totalData = result[0].count;
      const nextOffset = parseInt(offset) + parseInt(sqlLimit);
      let nextPage = '?';
      let prevPage = '?';
      const nPage = nextOffset >= totalData ? null : parseInt(sqlPage) + 1;
      const pPage = sqlPage > 1 ? +sqlPage - 1 : null;
      const totalPage = Math.ceil(totalData / parseInt(sqlLimit));
      if (nPage == null) {
        nextPage = null;
      } else {
        const nextCount = parseInt(sqlPage) + 1;
        nextPage += 'page=' + nextCount;
        if (limit) {
          nextPage += '&limit=' + limit;
        }
      }
      if (pPage == null) {
        prevPage = null;
      } else {
        const prevCounter = parseInt(sqlPage) - 1;
        prevPage += 'page=' + prevCounter;
        if (limit) {
          prevPage += '&limit=' + limit;
        }
      }

      const meta = {
        totalData,
        prevPage,
        page: sqlPage,
        nextPage,
        totalPage,
      };

      const sqlSelect = `SELECT p.id, p.name, p.stock, p.price,
      (SELECT image FROM image_product WHERE idProduct = p.id LIMIT 1) as image
            FROM favorite f LEFT JOIN product p ON p.id = f.idProduct
            WHERE ? ?
            ORDER BY f.likedAt DESC
            LIMIT ? OFFSET ?`;

      db.query(sqlSelect, prepare, (err, result) => {
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
            msg: `List of user favorite's item.`,
            data: result,
            meta,
          },
        });
      });
    });
  });
};

const addToFavorite = (req) => {
  return new Promise((resolve, reject) => {
    const {body, userInfo} = req;
    const idUser = userInfo.id;
    const {idProduct} = body;

    const bodyFavorite = {
      idUser,
      idProduct,
    };

    const sqlAdd = `INSERT INTO Favorite SET ?`;

    db.query(sqlAdd, bodyFavorite, (err, result) => {
      if (err) {
        console.log('err inside addlist', err);
        return reject({
          status: 500,
          err: {msg: 'Something went wrong', data: null},
        });
      }

      return resolve({
        status: 200,
        result: {
          msg: 'Add to favorite success.',
          data: {
            id: result.insertId,
            idUser,
            idProduct,
          },
        },
      });
    });
  });
};

const deleteFromFavorite = (idUser, idProduct) => {
  return new Promise((resolve, reject) => {
    const sqlDelete = `DELETE FROM favorite WHERE idUser = ? AND idProduct = ?`;
    db.query(sqlDelete, [idUser, idProduct], (err, result) => {
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
          msg: `Product Deleted`,
          data: null,
        },
      });
    });
  });
};

module.exports = {
  userFavorite,
  addToFavorite,
  deleteFromFavorite,
};
