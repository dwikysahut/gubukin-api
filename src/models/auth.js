const connection = require('../config/mysql')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

module.exports = {
    createUser: function(setData) {
        return new Promise (function(resolve, reject) {
            connection.query('SELECT * FROM user WHERE email=?', setData.email, function (error, result) {
                if (result[0]) {
                    console.log(result, error)
                    reject(new Error(error))
                } else {
                    connection.query('INSERT INTO user SET ?', setData, function (error, result) {
                        if (!error) {
                            const newResult = {
                                id: result.insertId,
                                ...setData
                            }
                            delete newResult.password
                            resolve(newResult)
                        } else {
                            console.log(result, error)
                            reject(new Error(error))
                        }
                    })
                }
            })
        })
    },
    loginUser: function(getData) {
        return new Promise (function(resolve, reject) {
            connection.query('SELECT * FROM user WHERE email=?', getData.email, function (error, result) {
                if (!error) {
                    resolve(result[0])
                } else {
                    reject(new Error(error))
                }
            })
        })
    },
    checkUser: function(setData) {
        return new Promise(function (resolve, reject) {
            connection.query('SELECT * FROM user WHERE email=?', setData.email, function (error, result) {
                if (!error) {
                    resolve(result[0])
                } else {
                    reject(new Error(error))
                }
            })
        })
    },
    verifyUser: function(setData) {
        return new Promise(function (resolve, reject) {
            const user = "UPDATE user SET verify='1', verify_code=null WHERE email='" + setData.email + "'"
            connection.query(user, function (error, result) {
                if (!error) {
                    resolve(result[0])
                } else {
                    reject(new Error(error))
                }
            })
        })
    },
    refreshToken: function (token) {
        return new Promise(function (resolve, reject) {
            jwt.verify(token, process.env.TOKEN_REFRESH, function (error, result) {
                if (error && error.name === "TokenExpiredError" || error && error.name === "JsonWebTokenError") {
                    reject(new Error(error))
                } else {
                    resolve(result.result)
                }
            })
        })
    }
}