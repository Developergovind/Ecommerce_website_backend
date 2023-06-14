const con = require("../database/database")
const common = require("../Config/common")
const welcomemail = require("../Config/welcomeEmail")
const middleware = require("../middleware/validator")
const authModal = {
    signUp: function (request, callback) {
        authModal.checkEmailUsed(request, (isused) => {
            if (isused) {
                console.log("Email is already in use");
                callback(0, "Email is already in use")
            }
            else {
                authModal.checkMobileNumberUsed(request, (isused) => {
                    if (isused) {
                        console.log("Phone number is already in use");
                        callback(0,"Phone number is already in use")
                    }
                    else {

                        var first_name = request.first_name
                        var last_name = request.last_name
                        var country_code = request.country_code
                        var phone = request.phone
                        var email = request.email
                        var password = request.password
                        var is_verified = "verified"

                        middleware.encryption(password, (encryptedpassword) => {
                            con.query("INSERT INTO tbl_user (email,phone,password,first_name,last_name,is_verified,country_code) VALUES('" + email + "','" + phone + "','" + encryptedpassword + "','" + first_name + "','" + last_name + "','" + is_verified + "','" + country_code + "')", (error, result) => {
                                var user_id = result.insertId
                                console.log(user_id);
                                if (!error) {
                                    authModal.getUserDetails(user_id, (userdetails) => {
                                        console.log("user ki info",userdetails);
                                        var data = userdetails[0]
                                        console.log("user ki info",userdetails);
                                        if (userdetails == null) {
                                            callback(0, "Error in inserting", error)
                                        }
                                        else {
                                            common.checkUpdateToken(result.insertId, request, (token) => {
                                                welcomemail.WelcomeEmail(data, (welcomeEmailTemplate) => {
                                                    common.sendmail(userdetails[0].email, "WELCOME TO FASHION", welcomeEmailTemplate, (isSent) => {
                                                        userdetails.token = token
                                                        console.log("data inserted successfully");
                                                        callback(1, "data inserted successfully ", userdetails)

                                                    })
                                                })
                                            })
                                        }
                                    })
                                }
                                else {

                                    callback(0, "Error in inserting", error)
                                }
                            })
                        })
                    }
                })

            }
        })
    },

    checkEmailUsed: function (request, callback) {
        con.query("select * from tbl_user where email = ? ", [request.email], (error, result) => {
            if (!error && result.length > 0) {
                callback(true)
            }
            else {
                callback(false)
            }
        })
    },

    // check phone is already being used or not
    checkMobileNumberUsed: function (request, callback) {
        con.query("select * from tbl_user where phone = ? ", [request.phone], (error, result) => {
            if (!error && result.length > 0) {
                callback(true)
            }
            else {
                callback(false)
            }
        })
    },

    getUserDetails: function (user_id, callback) {
        con.query("SELECT u.* from tbl_user u  WHERE u.id = ?", [user_id], (error, result) => {
            if (!error && result.length > 0) {
                callback(result)
            }
            else {
                callback(result)
            }
        })
    },
}

module.exports = authModal