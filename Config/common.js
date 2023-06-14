var nodemailer = require('nodemailer');
const con = require("../database/database")
var common = {
    sendmail: function (to_email, subject, message, callback) {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PWD
            }
        });

        var mailOptions = {
            to: to_email,
            subject: subject,
            html: message
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error)
                callback(false)
            } else {
                console.log('Email sent: ' + info.response)
                callback(true)
            }
        })
    },
    checkUpdateToken: function (user_id, request, callback) {
        var randomToken = require('rand-token').generator();
        var token = randomToken.generate(64, "abcdefghijklmnopqrstuvwxzy0123456789")
        con.query("select * from tbl_user where id = ?", [user_id], (error, result) => {
            if (!error && result.length > 0) {
                // update
                var deviceObj = {
                    token: token,
                }
                con.query("update  tbl_user set ? where id = ?", [deviceObj, user_id], (error, result) => {
                    if (!error) {
                        callback(token)
                    } else {
                        callback(error)
                    }
                })

            }

            else {
                // Insert
                var deviceObj = {
                    token: token,
                }
                con.query("INSERT into tbl_user set ? ", [deviceObj], (error, result) => {
                    if (!error) {
                        callback(token)
                    } else 
                    {
                        callback(null)
                    }
                })
            }
        })
    },
     generateOTP:function() {
          
        // Declare a digits variable 
        // which stores all digits
        var digits = '0123456789';
        let OTP = '';
        for (let i = 0; i < 4; i++ ) {
            OTP += digits[Math.floor(Math.random() * 10)];2
        }
        return OTP;
    }
}
module.exports = common;