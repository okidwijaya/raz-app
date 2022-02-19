const express = require('express');
const userRouter = express.Router();
const {checkToken} = require('../middlewares/authorize');
const upload = require('../middlewares/upload');

const userController = require('../controllers/user');

userRouter
  .get('/:id', checkToken, userController.getDetailUser)
  .patch('/edit/image', checkToken, upload, userController.updateUserImage)
  .patch('/edit/data', checkToken, userController.updateDataUser);
  
module.exports = userRouter;
