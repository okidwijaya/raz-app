const express = require("express");
const transactionRouter = express.Router();
const auth = require("../middlewares/authorize");

const transactionController = require("../controllers/transaction");

transactionRouter.get(
  "/",
  auth.checkToken,
  auth.authorizeCustomer,
  transactionController.userTransaction
);

transactionRouter.get(
  "/:id",
  auth.checkToken,
  transactionController.detailTransaction
);

transactionRouter.post(
  "/",
  auth.checkToken,
  auth.authorizeCustomer,
  transactionController.addTransaction
);

transactionRouter.patch(
  "/:id",
  auth.checkToken,
  auth.authorizeSeller,
  transactionController.updateTransaction
);

transactionRouter.delete(
  "/:id",
  auth.checkToken,
  auth.authorizeCustomer,
  transactionController.deleteTransaction
);

// transactionRouter.get("/detail/:id", productsController.getDetailByID);
// transactionRouter.get("/search", productsController.searchProducts);
// transactionRouter.delete(
//   "/:id",
//   auth.checkToken,
//   auth.authorizeSeller,
//   productsController.deleteProduct
// );

module.exports = transactionRouter;
