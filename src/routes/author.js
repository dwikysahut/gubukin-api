const express = require("express");
const Route = express.Router();
const { authentication } = require("../middleware/auth");

const authorController = require("../controllers/author");

Route.get("/", authentication, authorController.getAuthor);
Route.post("/", authentication, authorController.postAuthor);
Route.put("/:id", authentication, authorController.putAuthor);
Route.delete("/:id", authentication, authorController.deleteAuthor);

module.exports = Route;
