const express = require("express");
const Route = express.Router();

const authorController = require("../controllers/author");

Route.get("/", authorController.getAuthor);
Route.post("/", authorController.postAuthor);
Route.put("/:id", authorController.putAuthor);
Route.delete("/:id", authorController.deleteAuthor);

module.exports = Route;
