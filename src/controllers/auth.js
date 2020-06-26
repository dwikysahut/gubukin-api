const authModel = require('../models/auth')
const helper = require('../helpers')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const bcrypt = require('bcrypt');

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
            setData.reset_code = null
            setData.verify_code = verify_code
            setData.image_profile = "https://ui-avatars.com/api/?size=256&name=" + setData.name

            // setData.image_profile = "https://ui-avatars.com/api/?size=256&name=" + setData.name


            const result = await authModel.createUser(setData)

            const htmlTemplate = '<center><h2>Your account must be verification</h2><hr>OTP Code : <h4>' + random_code + '</h4><br /><h3>This code valid for 24 Hours</h3></center>'
            helper.nodemailer(result.email, 'OTP Verification Code', htmlTemplate)

            helper.response(response, 200, result)
        } catch (error) {
            console.log(error)
            helper.response(response, 500, { message: "Email already exists!" })
        }
    },
    loginUser: async function (request, response) {
        try {
            const getData = request.body
            const password = getData.password

            const result = await authModel.checkUser(getData)
            const verifyPassword = result.password
            const compare = bcrypt.compareSync(password, verifyPassword)
            const isVerify = result.verify

            if (!compare) {
                return helper.response(response, 500, { message: "Invalid email or password!" })
            }
            if (isVerify === null) {
                return helper.response(response, 500, { message: "Please verify your account first!" })
            } else {
                delete result.password
                const token = jwt.sign({ result }, process.env.SECRET_KEY, { expiresIn: '20s' })
                const refreshToken = jwt.sign({ result }, process.env.REFRESH_TOKEN_SECRET)
                const newData = {
                    ...result,
                    token,
                    refreshToken
                }
                return helper.response(response, 200, newData)
            }
        } catch (error) {
            return helper.response(response, 500, { message: "Failed to log in, please try again." })
        }
    },
    verifyUser: async function (request, response) {
        try {
            const setData = request.body
            const otp_code = setData.verify_code

            const checkUser = await authModel.checkUser(setData)
            const verify_code = checkUser.verify_code
            const compare = bcrypt.compareSync(otp_code, verify_code)
            if (!compare) {
                return helper.response(response, 500, { message: "(Verification) Invalid OTP Code!" })
            } else {
                const result = await authModel.verifyUser(setData)
                return helper.response(response, 200, { message: "Your account has been verified" })
            }
        } catch (error) {
            return helper.response(response, 500, { message: "Failed to verify user, account not found." })
        }
    },
    forgotPassword: async function (request, response) {
        try {
            const setData = request.body
            const random_code = helper.random(6)
            const reset_code = bcrypt.hashSync(random_code, 14)

            const checkUser = await authModel.checkUser(setData)
            const verify = checkUser.verify
            setData.email = checkUser.email
            setData.reset_code = reset_code
            setData.verify_code = checkUser.verify_code

            if (verify === '1') {
                const result = await authModel.forgotAction(setData)
    
                const htmlTemplate = '<center><h2>Your account must be validation</h2><hr>OTP Code : <h4>' + random_code + '</h4><br /><h3>This code valid for 24 Hours</h3></center>'
                helper.nodemailer(result.email, 'OTP Validation Code', htmlTemplate)
                return helper.response(response, 200, { message: "Please check your email to continue" })
            } else {
                return helper.response(response, 500, { message: "Please verify your account first!" })
            }
        } catch (error) {
            return helper.response(response, 500, { message: "Forgot action failed, account not found." })
        }
    },
    validateUser: async function (request, response) {
        try {
            const setData = request.body
            const otp_code = setData.reset_code

            const checkUser = await authModel.checkUser(setData)
            const reset_code = checkUser.reset_code
            const compare = bcrypt.compareSync(otp_code, reset_code)
            if (!compare) {
                return helper.response(response, 500, { message: "(Validation) Invalid OTP Code!" })
            } else {
                const verify_code = checkUser.verify_code
                const verify = checkUser.verify
                if (verify_code === null && verify === '1') {
                    await authModel.validateUser(setData)
                    return helper.response(response, 200, { message: "Your account has been validation" })
                } else {
                    return helper.response(response, 500, { message: "Please verify your account first!" })
                }
            }
        } catch (error) {
            return helper.response(response, 500, { message: "Failed to validate user, account not found." })
        }
    },
    resetPassword: async function (request, response) {
        try {
            const setData = request.body
            if (!setData) return helper.response(response, 500, { message: "Please input some data!" })

            const checkUser = await authModel.checkUser(setData)
            const reset_code = checkUser.reset_code
            const verify = checkUser.verify

            if (reset_code === null && verify === '1') {
                const password = setData.password
                const hash = bcrypt.hashSync(password, 18)
                setData.newPassword = hash

                await authModel.resetPassword(setData)
                return helper.response(response, 200, { message: "Your password successfully updated" })
            } else {
                return helper.response(response, 500, { message: "Please validate your account first!" })
            }
        } catch (error) {
            
        }
    },
    refreshToken: async function (request, response) {
        try {
            const token = request.body.token

            const result = await authModel.refreshToken(token)
            if (result === undefined) {
                return helper.response(response, 500, { message: "Invalid email or password" })
            } else {
                const token = jwt.sign({ result }, process.env.SECRET_KEY, { expiresIn: '1h' })
                return helper.response(response, 200, { token: token })
            }
        } catch (error) {
            return helper.response(response, 500, { message: "Failed to refresh token." })
        }
    }
}