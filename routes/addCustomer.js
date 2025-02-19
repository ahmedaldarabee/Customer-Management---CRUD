// this file that created to organize same end-points

const controller = require("../controller/customerController")
const express = require('express')
const router = express.Router()

// this fun handler that used just to show add users page
router.get("/user/add.html", controller.addUsersPage);

// this fun handler that used just to send users data into database
router.post("/user/add.html", controller.createUserData)

module.exports = router;