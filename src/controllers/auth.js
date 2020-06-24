const authModel = require('../models/auth')
const helper = require('../helpers')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')
dotenv.config()

module.exports = {
    createUser: async function (request, response) {
        try {
            const setData = request.body
            const password = setData.password
            const random_code = helper.random(6)
            const verify_code = bcrypt.hashSync(random_code, 10)
            const hash = bcrypt.hashSync(password, 18)
            setData.password = hash
            setData.verify = null
            setData.reset_code = null
            setData.verify_code = verify_code
            setData.image = "https://ui-avatars.com/api/?size=256&name=" + setData.name

            const result = await authModel.createUser(setData)

            const htmlTemplate = '<center><h2>Your account must be verification</h2><hr>OTP Code : <h4>' + random_code + '</h4><br /><h3>This code valid for 24 Hours</h3></center>'
            helper.nodemailer(result.email, 'OTP Verification Code', htmlTemplate)

            helper.response(response, 200, result)
        } catch (error) {
            helper.response(response, 500, { message: "Email already exists!" })
        }
    },
    loginUser: async function (request, response) {
        try {
            const getData = request.body
            const password = getData.password

            const result = await authModel.loginUser(getData)
            const verifyPassword = result.password
            const compare = bcrypt.compareSync(password, verifyPassword)
            const isVerify = result.verify

            if (!compare) {
                helper.response(response, 500, { message: "Invalid email or password!" })
            }
            if (isVerify === null) {
                helper.response(response, 500, { message: "Please verify your account first!" })
            } else {
                delete result.password
                const token = jwt.sign({ result }, process.env.TOKEN_SECRET, { expiresIn: '20s' })
                const refreshToken = jwt.sign({ result }, process.env.TOKEN_REFRESH)
                const newData = {
                    ...result,
                    token,
                    refreshToken
                }
                delete newData.password
                helper.response(response, 200, newData)
            }
        } catch (error) {
            helper.response(response, 500, { message: "Failed to log in, please try again." })
        }
    },
    verifyUser: async function (request, response) {
        try {
            const setData = request.body
            const otp_code = setData.verify_code

            const result = await authModel.checkUser(setData)
            const verify_code = result.verify_code
            const compare = bcrypt.compareSync(otp_code, verify_code)
            if (!compare) {
                helper.response(response, 500, { message: "Invalid OTP Code!" })
            } else {
                const updateResult = await authModel.verifyUser(setData)
                helper.response(response, 200, updateResult)
            }
        } catch (error) {
            helper.response(response, 500, { message: "Failed to verify account email not found." })
        }
    },
    refreshToken: async function (request, response) {
        try {
            const token = request.body.token

            const result = await authModel.refreshToken(token)
            if (result === undefined) {
                helper.response(response, 500, { message: "Invalid email or password" })
            } else {
                const token = jwt.sign({ result }, process.env.TOKEN_SECRET, { expiresIn: '1h' })
                helper.response(response, 200, { token: token })
            }
        } catch (error) {
            helper.response(response, 500, { message: "Failed to refresh token." })
        }
    }
}