const express = require('express');
const Route = express.Router()

const userController = require('../controllers/user');
const upload =require('../helpers/fileUpload')



Route
    .get('/',userController.getUser)
    .post('/',upload,userController.postUser)
    .put('/:id',upload,userController.putUser)
    .delete('/:id',userController.deleteUser)



    module.exports = Route