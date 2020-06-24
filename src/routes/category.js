const express = require("express");
const Route = express.Router();

const categoryController = require("../controllers/category");
const { authentication, authorization } = require('../middleware/auth');

Route.get("/", authentication, authorization, categoryController.getCategory);
Route.post("/", authentication, authorization, categoryController.postCategory);
Route.put("/:id", authentication, authorization, categoryController.putCategory);
Route.delete("/:id", authentication, authorization, categoryController.deleteCategory);

module.exports = Route;
