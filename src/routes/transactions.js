const express = require("express");
const Route = express.Router();

const transactionController = require("../controllers/transactions");
const { authentication, authorization } = require("../middleware/auth");
// const upload =require('../helpers/fileUpload')

Route.get("/",authentication, authorization,transactionController.getAllTransactions)
  .get("/user",authentication, transactionController.getTransactionsByUser)
  .post("/:id",authentication, transactionController.postTransaction)
  .put("/:id", authentication,authorization,transactionController.putTransactionStatus)
  .delete('/:id',authentication,transactionController.deleteTransaction)

module.exports = Route;
