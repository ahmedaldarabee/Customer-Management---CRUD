
// this file that created to organize same end-points

const express = require('express')
const router = express.Router()
const customerInfo = require("../models/customerSchema");

// this fun handler that used just to show add users page
router.get("/user/add.html",(req,res) => {
    res.render("user/add");
})

// this fun handler that used just to send users data into database
router.post("/user/add.html", (req,res) => {
    customerInfo.create(req.body) // we can use save or create to the req.body to hold data in database server.
    // then and catch that be as another way to connect with database [ async and await ]
    .then(() => {
        res.redirect("/")
        console.log("customer data sended successfully")
    })
    .catch((error) => {
        console.log(error.message);
    })
})

module.exports = router;