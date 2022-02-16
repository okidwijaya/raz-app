const express = require('express');
const router = express.Router();

const authRouter = require('./auth');
const productsRouter = require('./products');
const categoryRouter = require('./category');
const brandRouter = require('./brand');
// const testimonyRouter = require('./testimony');
// const historyRouter = require('./history');
// const vehiclesRouter = require('./vehicles');
// const cityRouter = require('./city');

router.use('/auth', authRouter);
router.use('/products', productsRouter);
router.use('/category', categoryRouter);
router.use('/brand', brandRouter);
// router.use('/testimony', testimonyRouter);
// router.use('/history', historyRouter);
// router.use('/vehicles', vehiclesRouter);
// router.use('/city', cityRouter);

// router.get('/', (_req, res) => {
//   res.redirect('home');
// });

module.exports = router;
