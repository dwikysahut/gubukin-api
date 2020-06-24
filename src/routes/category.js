const express = require("express");
const Route = express.Router();

const categoryController = require("../controllers/category");

Route.get("/", categoryController.getCategory);
Route.post("/", categoryController.postCategory);
Route.put("/:id", categoryController.putCategory);
Route.delete("/:id", categoryController.deleteCategory);

module.exports = Route;
