const Validator = require('Validator')
var cryptLib = require('cryptlib')
require('dotenv').config()

// var KEY = "Y9HiSlLd9MPlx453txqK1rhSn23liHYL"
var key = cryptLib.getHashSha256(process.env.KEY, 32)

let bypassMethods = new Array()
var middleware =
{
    checkValidation: function (res, request, rules, message) {
        const v = Validator.make(request, rules, message);

        if (v.fails()) {
            const errors = v.getErrors();
            console.log(errors);

            var error = ""
            for (const key in errors) {
                error = errors[key][0]
                console.log(error);
                break
            }
            var data_response =
            {
                code: "0",
                message: error,
            }
            res.status(200)
            res.send(data_response)
            return false
        }
        else {
            return true
        }


    },
    sendResponse: function (req, res, code, message, data) {
        if (data == null) {
            var response_data =
            {
                code: code,
                message: message,

            }
            res.status(200)
            res.send(response_data)
        } else {
            var response_data =
            {
                code: code,
                message: message,
                data: data
            }
            res.status(200)
            res.send(response_data)
        }
    },
    ValidateApiKey: function (req, res, callback) {
        var api_key = (req.headers['api-key'] != undefined && req.headers['api-key'] != "") ? req.headers['api-key'] : '';
        var path_data = req.path.split("/")
        if (bypassMethods.indexOf(path_data[1]) === -1) {
            if (api_key != "") {
                var dec_apiKey = cryptLib.decrypt(api_key, key, process.env.IV)
                if (dec_apiKey != "" && dec_apiKey == process.env.API_KEY) {
                    callback()
                }
                else {
                    var respose_data = {
                        code: 0,
                        message: "invalid api key",
                    }
                    middleware.encryption(respose_data, (response) => {
                        res.status(200)
                        res.send(response)
                    })
                }
            }
            else {
                var respose_data = {
                    code: 0,
                    message: "invalid api key",
                }

                middleware.encryption(respose_data, (response) => {
                    res.status(200)
                    res.send(response)
                })
            }
        }
        else {
            callback()
        }

    },



    decryption: function (encrypted_txt, callback) {
        if (encrypted_txt != undefined && Object.keys(encrypted_txt).length !== 0) {
            try {
                var response = JSON.parse(cryptLib.decrypt(encrypted_txt, key, process.env.IV))
                callback(response)
            } catch (error) {
                callback({})
            }
        }
        else {
            callback({})
        }
    },


    encryption: function (response, callback) {
        console.log(JSON.stringify(response));
        var response = cryptLib.encrypt(JSON.stringify(response), key, process.env.IV);
        console.log(response);
        callback(response)
    },
    ValidateHeaderToken: function (req, res, callback) {
        var headertoken = (req.headers['token'] != undefined && req.headers['token'] != "") ? req.headers['token'] : '';
        var path_data = req.path.split("/")
        if (bypassMethods.indexOf(path_data[1]) === -1) {
            if (headertoken != "") {
                try {
                    var decHeaderToken = cryptLib.decrypt(headertoken, key, process.env.IV)
                    if (decHeaderToken != "") {
                        con.query("SELECT * FROM  tbl_device_info WHERE token = ? ", [decHeaderToken], (error, result) => {
                            if (!error) {
                                req.user_id = result[0].user_id
                                callback()
                            }
                            else {
                                console.log(decHeaderToken);
                                var respose_data = {
                                    code: 0,
                                    message: "invalid token provided",
                                }
                                middleware.encryption(respose_data, (response) => {
                                    res.status(200)
                                    res.send(response)
                                })
                            }
                        })
                    }
                    else {
                        var respose_data = {
                            code: 0,
                            message: "invalid token provided",
                        }
                        middleware.encryption(respose_data, (response) => {
                            res.status(200)
                            res.send(response)
                        })
                    }

                } catch (error) {
                    var respose_data = {
                        code: 0,
                        message: "invalid token provided",
                    }
                    middleware.encryption(respose_data, (response) => {
                        res.status(200)
                        res.send(response)
                    })
                }
            }
            else {
                var respose_data = {
                    code: 0,
                    message: "invalid token provided",
                }
                middleware.encryption(respose_data, (response) => {
                    res.status(200)
                    res.send(response)
                })
            }
        }
        else {
            callback()
        }
    },
}

module.exports = middleware
