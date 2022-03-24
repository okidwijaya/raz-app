const db = require('../config/db');
const mysql = require('mysql');
const {getTimeStamp} = require('../helpers/getTimeStamp');

const userTransaction = (query, userInfo) => {
  return new Promise((resolve, reject) => {
    const {page, limit, status} = query;
    let {id} = userInfo;
    console.log('userinfo', userInfo);
    const sqlPage = !page || page === '' ? '1' : page;
    const sqlLimit = !limit || limit === '' ? '15' : limit;
    const offset = (parseInt(sqlPage) - 1) * parseInt(sqlLimit);
    // let deletedAt = 't.deletedAt';
    let userId = 't.idUser = ';
    id = String(id);
    const sqlStatus =
      !status || status === '' ? '' : `AND t.status = '${status}'`;

    const prepare = [
      // mysql.raw(deletedAt),
      mysql.raw(userId),
      mysql.raw(id),
      mysql.raw(sqlStatus),
      mysql.raw(sqlLimit),
      offset,
    ];

    const sqlCount = `SELECT count(*) count
    FROM transaction t LEFT JOIN transaction_product tp ON tp.id = 
    (SELECT idTransaction FROM transaction_product WHERE transaction_product.idTransaction = t.id LIMIT 1)
    LEFT JOIN product p ON p.id = tp.idProduct
    WHERE t.deletedAt IS NULL AND ? ? ?`;

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

      const sqlSelect = `SELECT t.id, t.idUser, t.totalPrice, p.name,
      (SELECT count(*) count FROM transaction_product where t.id = transaction_product.idTransaction limit 1) as count,
      t.shippingMethod, t.paymentMethod, t.status, t.createdAt, t.updatedAt,
      (SELECT image FROM image_product WHERE image_product.idproduct = p.id LIMIT 1) as image
            FROM transaction t LEFT JOIN transaction_product tp ON tp.id = 
            (SELECT idTransaction FROM transaction_product WHERE transaction_product.idTransaction = t.id LIMIT 1)
            LEFT JOIN product p ON p.id = tp.idProduct
            WHERE t.deletedAt IS NULL AND ? ? ?
            ORDER BY t.createdAt DESC
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
            msg: 'List of user transaction.',
            data: result,
            meta,
          },
        });
      });
    });
  });
};

const sellerTransaction = (query, idUser) => {
  return new Promise((resolve, reject) => {
    // console.log('query', query);
    console.log('idUser', idUser);
    const {page, limit, status} = query;
    const sqlPage = !page || page === '' ? '1' : page;
    const sqlLimit = !limit || limit === '' ? '15' : limit;
    const offset = (parseInt(sqlPage) - 1) * parseInt(sqlLimit);
    const sqlStatus =
      !status || status === '' ? '' : `AND t.status = '${status}'`;

    const prepare = [
      idUser,
      mysql.raw(sqlStatus),
      mysql.raw(sqlLimit),
      offset,
    ];

    const sqlCount = `SELECT count(*) count
    FROM transaction t LEFT JOIN transaction_product tp ON tp.id = 
    (SELECT idTransaction FROM transaction_product WHERE transaction_product.idTransaction = t.id LIMIT 1)
    LEFT JOIN product p ON p.id = tp.idProduct
    LEFT JOIN user u ON u.id = p.idUser
    WHERE t.deletedAt IS NULL AND p.idUser = ? ?`;

    db.query(sqlCount, prepare, (err, result) => {
      if (err) {
        console.log('err inside count', err);
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

      const sqlSelect = `SELECT t.id, t.idUser, t.totalPrice, p.name, 
      (SELECT count(*) count FROM transaction_product where t.id = transaction_product.idTransaction limit 1) as count,
      t.shippingMethod, t.paymentMethod, t.status, t.createdAt, t.updatedAt,
        (SELECT image FROM image_product WHERE image_product.idproduct = p.id LIMIT 1) as image
              FROM transaction t LEFT JOIN transaction_product tp ON tp.id = 
              (SELECT idTransaction FROM transaction_product WHERE transaction_product.idTransaction = t.id LIMIT 1)
              LEFT JOIN product p ON p.id = tp.idProduct
              LEFT JOIN user u ON u.id = p.idUser
              WHERE t.deletedAt IS NULL AND p.idUser = ? ?
              ORDER BY t.createdAt DESC
              LIMIT ? OFFSET ?`;

      db.query(sqlSelect, prepare, (err, result) => {
        if (err) {
          console.log('err inside select', err);
          return reject({
            status: 500,
            err: {msg: 'Something went wrong', data: null},
          });
        }
        return resolve({
          status: 200,
          result: {
            msg: 'List of all transaction.',
            data: result,
            meta,
          },
        });
      });
    });
  });
};

const addTransaction = (req) => {
  return new Promise((resolve, reject) => {
    const {body, userInfo} = req;
    const idUser = userInfo.id;
    const createdAt = getTimeStamp();
    const {totalPrice, shippingMethod, paymentMethod, status, productList} =
      body;

    // let newProductList = [];

    const bodyTransaction = {
      idUser,
      totalPrice,
      shippingMethod,
      paymentMethod,
      status,
      createdAt,
    };

    let idProducts = `(`;
    productList.forEach((element, idx) => {
      if (idx === productList.length - 1) {
        idProducts += `${element.idProduct}`;
      } else {
        idProducts += `${element.idProduct}, `;
      }
    });

    idProducts += `)`;

    const sqlProductPrice = `SELECT id, price
    FROM product
    WHERE id in ?`;

    // console.log(idProducts);

    db.query(sqlProductPrice, mysql.raw(idProducts), (err, result) => {
      console.log(err);
      if (err) {
        return reject({
          status: 500,
          err: {msg: 'Something went wrong', data: null},
        });
      }

      const productListWithPrice = productList.map((element, idx) => {
        let price = result[idx].price;
        return (element = {...element, price});
      });
      // console.log("list", newProductList);

      const sqlAdd = `INSERT INTO transaction SET ?`;
      db.query(sqlAdd, bodyTransaction, (err, result) => {
        if (err) {
          return reject({
            status: 500,
            err: {msg: 'Something went wrong', data: null},
          });
        }

        const idTransaction = result.insertId;
        const sqlAddList = `INSERT INTO
        transaction_product (idTransaction, idProduct, quantity, total)
        VALUES ? `;

        const finalProductList = productListWithPrice.map((element) => {
          return (element = {...element, idTransaction});
        });

        // console.log("finalProductList", finalProductList);

        let values = '';
        finalProductList.forEach((element, idx) => {
          if (idx === finalProductList.length - 1) {
            values += `(${idTransaction}, ${element.idProduct}, ${
              element.quantity
            }, ${element.quantity * element.price} )`;
          } else {
            values += `(${idTransaction}, ${element.idProduct}, ${
              element.quantity
            }, ${element.quantity * element.price} ), `;
          }
        });

        // console.log(values);

        //
        db.query(sqlAddList, [mysql.raw(values)], (err) => {
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
              msg: 'Add transaction success.',
              data: {
                idTransaction,
                ...bodyTransaction,
                products: finalProductList,
              },
            },
          });
        });
        //
      });
    });
  });
};

const updateTransaction = (body, id) => {
  return new Promise((resolve, reject) => {
    const updatedAt = getTimeStamp();
    const newBody = {...body, updatedAt};
    const sqlUpdate = `UPDATE transaction SET ? WHERE id = ?`;
    db.query(sqlUpdate, [newBody, id], (err) => {
      if (err) {
        console.log(err);
        return reject({
          status: 500,
          err: {msg: 'Something went wrong', data: null},
        });
      }
      return resolve({
        status: 200,
        result: {msg: 'Update success', data: newBody},
      });
    });
  });
};

const detailTransaction = (idTransaction) => {
  return new Promise((resolve, reject) => {
    const sqlTransaction = `SELECT id, idUser, totalPrice, shippingMethod, paymentMethod, status, createdAt, updatedAt
    FROM transaction
    WHERE id = ?`;

    const sqlProducts = `SELECT tp.idProduct, p.name, p.idBrand, p.price, tp.quantity, tp.total,
    (SELECT image FROM image_product WHERE image_product.idProduct = tp.idProduct LIMIT 1) as image
    FROM transaction_product tp JOIN product p ON tp.idProduct = p.id WHERE tp.idTransaction = ?;`;

    db.query(sqlTransaction, idTransaction, (err, result) => {
      if (err) {
        console.log(err);
        return reject({
          status: 500,
          err: {msg: 'Something went wrong', data: null},
        });
      }

      const data = result[0];

      db.query(sqlProducts, idTransaction, (err, result) => {
        if (err) {
          console.log(err);
          return reject({
            status: 500,
            err: {msg: 'Something went wrong', data: null},
          });
        }

        // console.log(result);

        return resolve({
          status: 200,
          result: {
            msg: `Detail Transaction, id=${idTransaction}`,
            data: {...data, products: result},
          },
        });
      });
    });
  });
};

const deleteTransaction = (id, idUser) => {
  return new Promise((resolve, reject) => {
    const timestamp = getTimeStamp();
    const sqlDeleteProduct = `UPDATE transaction SET deletedAt = ? WHERE idUser = ? AND id = ?`;
    db.query(
      sqlDeleteProduct,
      [timestamp, idUser, parseInt(id)],
      (err, result) => {
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
      }
    );
  });
};

module.exports = {
  userTransaction,
  sellerTransaction,
  addTransaction,
  updateTransaction,
  detailTransaction,
  deleteTransaction,
};
