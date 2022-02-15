const express = require('express');
const authRouter = express.Router();
const auth = require('../middlewares/authorize');

const validate = require('../middlewares/validate');
const authController = require('../controllers/auth');

authRouter.post(
  '/register',
  validate.register,
  authController.register,
);
authRouter.post('/login', validate.login, authController.login);
authRouter.delete('/logout', auth.checkToken, authController.logout);

module.exports = authRouter;
