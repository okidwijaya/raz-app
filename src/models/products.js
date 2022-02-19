const db = require('../config/db');
const mysql = require('mysql');
const {getTimeStamp} = require('../helpers/getTimeStamp');

const addProduct = (req) => {
  return new Promise((resolve, reject) => {
    const {body, userInfo} = req;
    const images = req.images;
    if (images.length === 0) {
      return reject({
        status: 400,
        err: {msg: `Image can't be empty`, data: null},
      });
    }
    const idUser = userInfo.id;
    const createdAt = getTimeStamp();
    const categories = JSON.parse(body.category);
    const newBody = {
      ...body,
      ...{idUser},
      ...{createdAt},
    };
    delete newBody.category;
    console.log(categories, newBody);
    const sqlAddProduct = `INSERT INTO product SET ?`;
    db.query(sqlAddProduct, newBody, (err, result) => {
      if (err) {
        console.log('err insert product', err);
        console.log('err add product', err);
        return reject({
          status: 500,
          err: {msg: 'Something went wrong', data: null},
        });
      }
      const idProduct = result.insertId;
      let values = `VALUES`;
      const prepareImages = [];
      images.forEach((element, index) => {
        if (index !== images.length - 1) {
          values += ` (?,?), `;
        } else {
          values += ` (?,?) `;
        }
        prepareImages.push(idProduct, element);
        console.log(element);
      });
      const addImagesProduct = `INSERT INTO image_product (idProduct, image) ${values}`;
      db.query(addImagesProduct, prepareImages, (err, result) => {
        if (err) {
          console.log('err image', err);
          return reject({
            status: 500,
            err: {msg: 'Something went wrong', data: null},
          });
        }
        let valuesCategory = 'VALUES';
        const prepareCategory = [];
        categories.forEach((element, index) => {
          if (index !== categories.length - 1) {
            valuesCategory += ` (?,?), `;
          } else {
            valuesCategory += ` (?,?) `;
          }
          prepareCategory.push(idProduct, element);
          console.log(element);
        });
        const addCategoryProduct = `INSERT INTO category_product (idProduct, idCategory) ${valuesCategory}`;
        db.query(addCategoryProduct, prepareCategory, (err, result) => {
          if (err) {
            console.log('err cat product', err);
            return reject({
              status: 500,
              err: {msg: 'Something went wrong', data: null},
            });
          }
          return resolve({
            status: 200,
            result: {
              msg: `A New Product Added`,
              data: {...{id: idProduct}, ...newBody, categories, images},
            },
          });
        });
      });
    });
  });
};

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
    if (priceMin && priceMax) {
      sqlPrice = `p.price BETWEEN ${priceMin} AND ${priceMax}`;
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
    WHERE   ? AND ? AND ? AND ? AND ? AND p.deletedAt IS NULL
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
      // const totalPage = Math.ceil((totalData - 1) / (parseInt(sqlLimit) + 1));
      const totalPage =
        totalData < parseInt(sqlLimit)
          ? 1
          : Math.ceil(totalData / parseInt(sqlLimit));
      const meta = {
        page: currentPage,
        totalPage,
        limit: parseInt(sqlLimit),
        totalData,
      };

      const sqlSearchProducts = `SELECT DISTINCT p.id, p.name, p.price,
      (SELECT image FROM image_product WHERE idProduct = p.id LIMIT 1) as image
      FROM product p 
      JOIN brands b ON p.idBrand = b.id 
      JOIN category_product cp ON cp.idProduct = p.id 
      JOIN category c ON c.id = cp.idCategory
      LEFT JOIN transaction_product tp ON tp.idProduct = p.id
      WHERE   ? AND ? AND ? AND ? AND ? AND p.deletedAt IS NULL
      GROUP BY p.id
      ORDER BY ? ? LIMIT ? OFFSET ? `;
      db.query(sqlSearchProducts, prepare, (err, result) => {
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
            msg: `List Product`,
            data: result,
            meta,
          },
        });
      });
    });
  });
};

const deleteProduct = (idProduct, idUser) => {
  return new Promise((resolve, reject) => {
    console.log('model');
    const timestamp = getTimeStamp();
    console.log('timestamp', timestamp);
    const sqlDeleteProduct = `UPDATE product SET deletedAt = ? WHERE idUser = ? AND id = ?`;
    db.query(
      sqlDeleteProduct,
      [timestamp, idUser, parseInt(idProduct)],
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
      },
    );
  });
};

const getSellerProduct = (query, id) => {
  return new Promise((resolve, reject) => {
    const {filter, limit, page} = query;

    let deletedCol = '';
    let filterProduct = 'p.deletedAt IS NULL';
    console.log('bug finder 1');
    if (filter.toLowerCase() === 'archieve') {
      deletedCol = ', p.deletedAt ';
      filterProduct = 'p.deletedAt IS NOT NULL';
    }
    if (filter.toLowerCase() === 'sold out') {
      filterProduct += ' AND p.stock = 0';
    }
    const sqlLimit = limit ? limit : '5';
    const sqlOffset =
      !page || page === '1' ? 0 : (parseInt(page) - 1) * parseInt(sqlLimit);
    const prepare = [
      mysql.raw(deletedCol),
      id,
      mysql.raw(filterProduct),
      mysql.raw(sqlLimit),
      sqlOffset,
    ];
    const sqlCount = `SELECT count(*) count ?
    FROM product p WHERE idUser = ? AND ?`;

    const sqlGetData = `SELECT p.id, p.name, p.price, p.stock, 
    (SELECT image FROM image_product WHERE idProduct = p.id LIMIT 1) as image ?
    FROM product p WHERE p.idUser = ? AND ? 
    LIMIT ? OFFSET ?`;
    db.query(sqlCount, prepare, (err, result) => {
      if (err) {
        console.log(err);
        return reject({
          status: 500,
          err: {msg: 'Something went wrong', data: null},
        });
      }
      const totalData = result[0].count;
      const currentPage = page ? parseInt(page) : 1;
      const totalPage =
        totalData < parseInt(sqlLimit)
          ? 1
          : Math.ceil(totalData / parseInt(sqlLimit));
      const meta = {
        page: currentPage,
        totalPage,
        limit: parseInt(sqlLimit),
        totalData,
      };
      db.query(sqlGetData, prepare, (err, result) => {
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
            msg: `List Product Seller`,
            data: result,
            meta,
          },
        });
      });
    });
  });
};

const getRelatedProduct = (id) => {
  return new Promise((resolve, reject) => {
    const sqlBrand = `SELECT idBrand FROM product WHERE id = ?`;
    db.query(sqlBrand, id, (err, result) => {
      if (err) {
        console.log(err);
        return reject({
          status: 500,
          err: {msg: 'Something went wrong', data: null},
        });
      }
      const idBrand = result[0].idBrand;
      const sqlCategory = `SELECT idCategory from category_product WHERE  idProduct = ?`;
      db.query(sqlCategory, [id], (err, result) => {
        if (err) {
          console.log(err);
          return reject({
            status: 500,
            err: {msg: 'Something went wrong', data: null},
          });
        }
        console.log('result category', result);
        let filterCategory = '';
        const idCategories = result.idCategory;
        if (result.length === 1) {
          filterCategory = `c.id = ${result[0].idCategory}`;
        } else {
          filterCategory = 'c.id IN (';
          for (let i = 0; i < result.length; i++) {
            if (i === result.length - 1) {
              filterCategory += `${result[i].idCategory}`;
            } else {
              filterCategory += `${result[i].idCategory}, `;
            }
          }
          filterCategory += ')';
        }
        console.log(filterCategory);
        const prepare = [[id], idBrand, mysql.raw(filterCategory)];
        const sqlRelatedProduct = `SELECT p.id, p.name, p.price, 
        (SELECT image from image_product WHERE idProduct = p.id LIMIT 1) as image
        FROM product p JOIN category_product cp ON cp.idProduct = p.id 
        JOIN category c ON c.id = cp.idCategory
        WHERE NOT p.id = ? AND p.deletedAt IS NULL AND p.idBrand = ? AND ? LIMIT 9`;
        db.query(sqlRelatedProduct, prepare, (err, result) => {
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
              msg: `Related Product`,
              data: result,
            },
          });
        });
      });
    });
  });
};

module.exports = {
  getDetailByID,
  searchProducts,
  deleteProduct,
  addProduct,
  getSellerProduct,
  getRelatedProduct,
};
