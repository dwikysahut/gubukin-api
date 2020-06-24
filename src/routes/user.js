const express = require('express');
const Route = express.Router()

const userController = require('../controllers/user');
const upload =require('../helpers/fileUpload')
const { authentication } = require('../middleware/auth')


Route
    .get('/',authentication,userController.getUser)
    .post('/',authentication,upload,userController.postUser)
    .put('/:id',authentication,upload,userController.putUser)
    .delete('/:id',authentication,userController.deleteUser)



    module.exports = Route