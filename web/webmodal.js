const con = require("../database/database")

var web_modal =
{
    contactUs: function (request, callback) {
        var dataobj =
        {
            name: request.name,
            email: request.email,
            subject: request.subject,
            message: request.message
        }
        con.query("INSERT INTO  tbl_contact_us SET ? ", [dataobj], (error, result) => {
            if (!error) {
                console.log(1, "Thanks for contacting")
            } else {
                console.log(0, "Error in contacting ", error)
            }
        })
    },

    subscription: function (request, callback) {
        var dataobj =
        {
            email: request.email
        }
        con.query("INSERT INTO  tbl_subscription SET ? ", [dataobj], (error, result) => {
            if (!error) {
                console.log(1, "Thanks for subscribing")
            } else {
                console.log(0, "Error in contacting ", error)
            }
        })
    },

    ProductslistCategoryWise: function (request, callback) {
        con.query("SELECT p.*, pi.product_image FROM tbl_products p JOIN tbl_category c ON p.category_id = c.id JOIN tbl_products_images pi ON p.id = pi.product_id WHERE p.category_id = ? ", [request.category_id], (error, result) => {
            if (!error) {
                callback(1, "Here are your products", result)
            } else {
                callback(0, "No products found", error)
            }
        })
    },

    featuredCollection: function (request, callback) {
        con.query("SELECT p.*,pi.* FROM tbl_products p  JOIN tbl_products_images  pi ON p.id = pi.product_id GROUP BY p.id ", (error, result) => {
            if (!error) {
                callback(1, "Here are your products", result)
            } else {
                callback(0, "No products found", error)
            }
        })
    },


    newArrivals: function (request, callback) {
        con.query("SELECT p.*,pi.* FROM tbl_products p  JOIN tbl_products_images  pi ON p.id = pi.product_id GROUP BY p.id ORDER BY p.Created_At DESC", (error, result) => {
            if (!error) {
                callback(1, "Here are your products", result)
            } else {
                callback(0, "No products found", error)
            }
        })
    },

    getProductDetails: function (request, callback) {
        con.query("SELECT p.*,pi.product_image FROM tbl_products p join tbl_products_images pi on p.id = pi.product_id  WHERE p.id = ? group by p.id", [request.product_id], (error, result) => {
            var productDetails = {};
            productDetails.productDescription = result
            if (!error && result.length > 0) {
                con.query("SELECT pi.product_image FROM tbl_products_images pi WHERE pi.product_id = ?", [request.product_id], (error, result) => {
                    if (!error && result.length > 0) {
                        productDetails.productImages = result;
                        callback(1, "Here are your products", productDetails)
                        console.log(productDetails);
                    } else {
                        callback(0, "No products found", error)
                    }
                })
            } else {
                callback(0, "No products found", error)
            }
        })
    },

    SearchProducts: function (request, callback) {
        con.query("SELECT p.*,pi.* FROM tbl_products p  JOIN tbl_products_images  pi ON p.id = pi.product_id WHERE  p.product_name  LIKE '%" + request + " %'  GROUP BY p.id", (error, result) => {
            if (!error && result.length > 0) {
                console.log(result);
                callback(1, "here is your data ", result)
            } else {
                callback(0, "no data found", error)
            }
        })
    },

    filterProducts: function (request, callback) {
        var priceFrom = request.priceFrom;
        var priceTo = request.priceTo;
        console.log(priceFrom)
         console.log(priceTo);
        var priceFilter = "";
        if (priceFrom!= undefined && priceFrom != "" && priceTo != undefined && priceTo != "") {
            priceFilter += ` p.Price  BETWEEN ${priceFrom} AND ${priceTo}`
        }
        con.query(`SELECT p.*,pi.* FROM tbl_products p  JOIN tbl_products_images  pi ON p.id = pi.product_id WHERE ${priceFilter} GROUP BY p.id`, (error, result) => {
            if (!error && result.length > 0) {
                console.log("result",result);
                callback(1,"here is the data ",result)
            } else {
                callback(0,"something went wrong ",error)
            }
        })
    },


}

module.exports = web_modal   