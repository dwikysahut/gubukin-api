const express = require("express");
const Route = express.Router();
const { authentication } = require("../middleware/auth");

const ratingController = require("../controllers/rating");

Route.get("/",authentication, ratingController.getAllRating);
Route.post("/:id",authentication, ratingController.postRating);

module.exports = Route;
