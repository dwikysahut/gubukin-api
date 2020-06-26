const express = require("express");
const Route = express.Router();

const categoryController = require("../controllers/category");
const { authentication, authorization } = require("../middleware/auth");

Route.get("/", authentication, categoryController.getCategory);
Route.post("/", authentication, categoryController.postCategory);
Route.put("/:id", authentication, categoryController.putCategory);
Route.delete("/:id", authentication, categoryController.deleteCategory);

module.exports = Route;
