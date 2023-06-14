const express = require('express')
const middleware = require("../middleware/validator")
const authModal = require("./Authmodal")
const router = express()

router.post("/signUp", (req, res) => {
    console.log(req.body);
    var request = req.body
    const rules = {
        first_name: "required",
        last_name: "required",
        email: 'required|email',
        phone: "required",
        password: "required",
    };
    const message = {
        required: "Please Enter  :attr",
        email: 'please enter valid :attr',
    };
    if (middleware.checkValidation(res, request, rules, message)) {
        authModal.signUp(request, (code, message, data) => {
            middleware.sendResponse(request, res, code, message, data)
        })
    }

})

module.exports = router