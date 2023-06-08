const Validator = require('Validator')
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
    sendResponse:function(req,res,code,message,data)
    {
           if (data == null) {
            var response_data =
                 {
                  code:code,
                  message:message,
                  
                 }
                 res.status(200)
                 res.send(response_data)
           } else
            {
                var response_data =
                 {
                  code:code,
                  message:message,
                  data:data
                 }
                 res.status(200)
                 res.send(response_data) 
           }
    }
}

module.exports = middleware
