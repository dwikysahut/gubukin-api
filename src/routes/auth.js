const express = require("express");
const Route = express.Router();
const { authRefreshToken } = require("../middleware/auth");

const authController = require("../controllers/auth");

Route.post('/register', authController.createUser)
Route.post('/login', authController.loginUser)
Route.post('/forgot', authController.forgotPassword)
Route.post('/reset', authController.resetPassword)
Route.post('/verify', authController.verifyUser)
Route.post('/validate', authController.validateUser)
Route.post('/token', authRefreshToken, authController.refreshToken)

module.exports = Route;
