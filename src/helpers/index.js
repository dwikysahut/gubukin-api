const fs = require('fs')
const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
dotenv.config()

module.exports = {
    response:function (response,status,data,pagination){
        const result ={};
        result.status =status || 200;
        result.data = data
        result.pagination = pagination;
        return response.status(result.status).json(result)
    },
    random: function (length) {
        let result = ''
        const characters = '0123456789'
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength))
        }
        return result
    },
    nodemailer: function (email, subject, template) {
        const transporter = nodemailer.createTransport({
            service: process.env.SERVICE_MAILER,
            auth: {
                user: process.env.SERVICE_EMAIL,
                pass: process.env.SERVICE_EMAIL_PASSWORD
            }
        })

        const mailOptions = {
            from: process.env.SERVICE_EMAIL_SENDER,
            to: email,
            subject: subject,
            html: template
        }

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error)
                return false
            } else {
                console.log('Email sent: ' + info.response)
                return true
            }
        })
    }
}