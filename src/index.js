const express = require ('express');
const Route = express.Router();

const userRoutes =require('./routes/user')
const bookRoutes = require("./routes/books");
const authorRoutes = require("./routes/author");
const categoryRoutes = require("./routes/category");

Route.use("/books", bookRoutes);
Route.use("/author", authorRoutes);
Route.use("/category", categoryRoutes);
Route.use('/user',userRoutes);

module.exports = Route