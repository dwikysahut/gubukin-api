const express = require("express");
const Route = express.Router();

const transactionController = require("../controllers/transactions");
const { authentication, authorization } = require("../middleware/auth");
// const upload =require('../helpers/fileUpload')

Route.get("/", transactionController.getAllTransactions)
  .get("/:id", transactionController.getTransactionsByUser)
  .post("/:id", transactionController.postTransaction)
  .put("/:id", transactionController.putTransactionStatus);
// .delete('/:id',transactionController.deleteBook)

module.exports = Route;
