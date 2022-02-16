const db = require('../config/db');
const mysql = require('mysql');
const getTimeStamp = require('../helpers/getTimeStamp');

const getDetailByID = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT p.id, p.name, b.brand, 
    p.stock, p.price, p.description, 
    p.productCondition, p.color, p.createdAt 
    FROM product p 
    JOIN brands b on b.id = p.idBrand WHERE p.id = ?`;
    db.query(sql, [id], (err, result) => {
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
      const sqlCategories = `SELECT c.category 
      FROM category c JOIN category_product cp 
      ON c.id=cp.idCategory WHERE cp.idProduct = ? `;
      db.query(sqlCategories, [id], (err, result) => {
        if (err) {
          return reject({
            status: 500,
            err: {msg: 'Something went wrong', data: null},
          });
        }
        const categories = result;
        let category = [];
        categories.forEach((element) => {
          category.push(element.category);
        });
        detailProduct = {...detailProduct, category: category};
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
            status: 200,
            result: {
              msg: `Detail product ${id}`,
              data: detailProduct,
            },
          });
        });
      });
    });
  });
};

const searchProducts = (query) => {
  return new Promise((resolve, reject) => {
    const {
      search,
      idCategory,
      idBrand,
      priceMin,
      priceMax,
      color,
      sort,
      page,
      limit,
    } = query;

    const sqlSearch =
      search && search !== ''
        ? `p.name LIKE '%${search}%'`
        : `p.name LIKE '%%'`;
    const sqlIdCategory = idCategory
      ? `cp.idCategory = ${idCategory}`
      : 'cp.idCategory IS NOT NULL';
    const sqlIdBrand = idBrand ? `b.id = ${idBrand}` : 'b.id IS NOT NULL';
    const sqlColor =
      color === 'all' || !color
        ? 'p.color IS NOT NULL'
        : `p.color = '${color}'`;

    let sqlSort = 'p.createdAt';
    let sqlOrder = 'DESC';
    if (sort) {
      if (sort.toLowerCase() === 'oldest') {
        sqlSort = 'p.createdAt';
        sqlOrder = 'ASC';
      }
      if (sort.toLowerCase() === 'price asc') {
        sqlSort = 'p.price';
        sqlOrder = 'ASC';
      }
      if (sort.toLowerCase() === 'price desc') {
        sqlSort = 'p.price';
        sqlOrder = 'DESC';
      }
      if (sort.toLowerCase() === 'popular') {
        sqlSort = '((1-0.5)*count(tp.idProduct))';
        sqlOrder = 'DESC';
      }
    }

    let sqlPrice = 'p.price IS NOT NULL';

    let sqlPriceMin = '';

    let sqlPriceMax = '';

    if (priceMin && priceMax) {
      sqlPrice = `p.price BETWEEN ${priceMin} AND ${priceMax}`;
      sqlPriceMin = priceMin;
      sqlPriceMax = priceMax;
    }

    const sqlLimit = limit ? limit : '12';
    const sqlOffset =
      !page || page === '1' ? 0 : (parseInt(page) - 1) * parseInt(sqlLimit);

    const prepare = [
      mysql.raw(sqlSearch),
      mysql.raw(sqlIdBrand),
      mysql.raw(sqlIdCategory),
      mysql.raw(sqlColor),
      mysql.raw(sqlPrice),
      mysql.raw(sqlSort),
      mysql.raw(sqlOrder),
      mysql.raw(sqlLimit),
      sqlOffset,
    ];

    const sqlCount = `SELECT count(DISTINCT p.id) count FROM product p  
    JOIN brands b ON p.idBrand = b.id 
    JOIN category_product cp ON cp.idProduct = p.id 
    JOIN category c ON c.id = cp.idCategory
    LEFT JOIN transaction_product tp ON tp.idProduct = p.id
    WHERE   ? AND ? AND ? AND ? AND ? 
    ORDER BY ? ?`;

    db.query(sqlCount, prepare, (err, result) => {
      if (err) {
        return reject({
          status: 500,
          err: {msg: 'Something went wrong', data: null},
        });
      }
      const totalData = result[0].count;
      const currentPage = page ? parseInt(page) : 1;
      const totalPage = Math.ceil((totalData - 1) / (parseInt(sqlLimit) + 1));

      const meta = {
        page: currentPage,
        totalPage,
        limit: parseInt(sqlLimit),
        totalData,
      };

      const sqlSearchProducts = `SELECT DISTINCT p.id, p.name, p.price FROM product p  
      JOIN brands b ON p.idBrand = b.id 
      JOIN category_product cp ON cp.idProduct = p.id 
      JOIN category c ON c.id = cp.idCategory
      LEFT JOIN transaction_product tp ON tp.idProduct = p.id
      WHERE   ? AND ? AND ? AND ? AND ? 
      GROUP BY p.id
      ORDER BY ? ? LIMIT ? OFFSET ? `;
      db.query(sqlSearchProducts, prepare, (err, result) => {
        if (err) {
          return reject({
            status: 500,
            err: {msg: 'Something went wrong', data: null},
          });
        }
        return resolve({
          status: 200,
          result: {
            msg: `List Product`,
            data: result,
            meta,
          },
        });
      });
    });
  });
};

module.exports = {
  getDetailByID,
  searchProducts,
};
