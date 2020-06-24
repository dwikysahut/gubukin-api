const express = require("express");
const Route = express.Router();
const { authentication, authorization } = require('../middleware/auth')

const authorController = require("../controllers/author");

Route.get("/", authentication, authorization, authorController.getAuthor);
Route.post("/", authentication, authorization, authorController.postAuthor);
Route.put("/:id", authentication, authorization, authorController.putAuthor);
Route.delete("/:id", authentication, authorization, authorController.deleteAuthor);

module.exports = Route;
