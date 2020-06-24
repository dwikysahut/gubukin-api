const express = require('express');
const Route = express.Router()

const booksController = require('../controllers/books');
const upload =require('../helpers/fileUpload')



Route
    .get('/',booksController.getBooks)
    .post('/',upload,booksController.postBook)
    .put('/:id',upload,booksController.putBook)
    .delete('/:id',booksController.deleteBook)



    module.exports = Route