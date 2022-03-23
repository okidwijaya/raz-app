const express = require('express');
const authRouter = express.Router();
const auth = require('../middlewares/authorize');

const validate = require('../middlewares/validate');
const authController = require('../controllers/auth');

authRouter
  .post('/register', validate.register, authController.register)
  .post('/login', validate.login, authController.login)
  .delete('/logout', auth.checkToken, authController.logout)
  .patch(
    '/change-password',
    validate.changePassword,
    auth.checkToken,
    authController.changePassword,
  )
  .post('/get-otp', authController.getOtp)
  .post('/check-otp', authController.checkOtp)
  .post('/reset-password', authController.resetPassword);

module.exports = authRouter;
