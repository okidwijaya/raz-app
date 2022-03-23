const express = require("express");
const favoriteRouter = express.Router();
const auth = require("../middlewares/authorize");

const favoriteController = require("../controllers/favorite");

favoriteRouter.get(
  "/",
  auth.checkToken,
  auth.authorizeCustomer,
  favoriteController.userFavorite
);

favoriteRouter.post(
  "/",
  auth.checkToken,
  auth.authorizeCustomer,
  favoriteController.addToFavorite
);

favoriteRouter.delete(
  "/:id",
  auth.checkToken,
  auth.authorizeCustomer,
  favoriteController.deleteFromFavorite
);

module.exports = favoriteRouter;
