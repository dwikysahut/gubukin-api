const express = require("express");
const Route = express.Router();
const { authRefreshToken } = require("../middleware/auth");

const authController = require("../controllers/auth");

Route.post("/register", authController.createUser);
Route.post("/login", authController.loginUser);
// .post('/forgot', authController.forgotPassword)
// .put('/reset/:code', authController.resetPassword)
Route.post("/verify", authController.verifyUser);
Route.post("/token", authRefreshToken, authController.refreshToken);

module.exports = Route;
