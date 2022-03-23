const express = require('express');
const router = express.Router();

const authRouter = require('./auth');
const productsRouter = require('./products');
const categoryRouter = require('./category');
const brandRouter = require('./brand');
const transactionRouter = require('./transaction');
const userRouter = require('./user');
const favoriteRouter = require('./favorite');

router.use('/auth', authRouter);
router.use('/products', productsRouter);
router.use('/category', categoryRouter);
router.use('/brand', brandRouter);
router.use('/transaction', transactionRouter);
router.use('/user', userRouter);
router.use('/favorite', favoriteRouter);

module.exports = router;
