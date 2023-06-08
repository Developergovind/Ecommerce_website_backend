const express = require('express')
const router = express.Router()
const path = require('path')
const webmodal = require("../web/webmodal")
const middleware = require("../middleware/validator")

// router.get("/",(req,res)=>{
//     res.sendFile(path.resolve('../api/Views/index.html'));
// })

router.post("/Contact", (req, res) => {
    var request = req.body
    console.log("request he ye ", request);
    const rules = {
        name: "required",
        email: 'required|email',
        subject: "required",
        message: "required"
    };
    const message = {
        required: "Please Enter  :attr",
        email: 'please enter valid :attr',
    };
    if (middleware.checkValidation(res, request, rules, message)) {
        webmodal.contactUs(request, (code, message, data) => {
            middleware.sendResponse(request, res, code, message, data)
        })
    }
})
router.post("/Subscribe", (req, res) => {
    var request = req.body
    const rules = {
        email: 'required|email',
    };
    const message = {
        required: "Please Enter  :attr",
        email: 'please enter valid :attr',
    };
    if (middleware.checkValidation(res, request, rules, message)) {
        webmodal.subscription(request, (code, message, data) => {
            middleware.sendResponse(request, res, code, message, data)
        })
    }
})

router.post("/Productslist", (req, res) => {
    var request = req.body
    console.log("req", request);

    const rules = {
        category_id: 'required',
    };
    const message = {
        required: "Please Enter  :attr",
    };
    if (middleware.checkValidation(res, request, rules, message)) {
        webmodal.ProductslistCategoryWise(request, (code, message, data) => {
            middleware.sendResponse(request, res, code, message, data)
        })
    }
})

router.get("/featuredCollection", (req, res) => {
    webmodal.featuredCollection(req, (code, message, data) => {
        middleware.sendResponse(req, res, code, message, data)
    })
})

router.get("/newArrival", (req, res) => {
    webmodal.newArrivals(req, (code, message, data) => {
        middleware.sendResponse(req, res, code, message, data)
    })
})

router.post("/productdetails", (req, res) => {
    var request = req.body

    const rules = {
        product_id: 'required',
    };
    const message = {
        required: "Please Enter  :attr",
    };
    if (middleware.checkValidation(res, request, rules, message)) {
        webmodal.getProductDetails(request, (code, message, data) => {
            middleware.sendResponse(request, res, code, message, data)
        })
    }
})

router.post("/Search", (req, res) => {
    var request = req.body.Search
    console.log(request);
    const rules = {
        Search: '',
    };
    const message = {
        required: "Please Enter  :attr",
    };
    if (middleware.checkValidation(res, req, rules, message)) {

        webmodal.SearchProducts(request, (code, message, data) => {
            middleware.sendResponse(req, res, code, message, data)
        })
    }
})

router.post("/filterProducts", (req, res) => {
    var request = req.body
    webmodal.filterProducts(request, (code, message, data) => {
        middleware.sendResponse(request, res, code, message, data)
    })
})
module.exports = router

