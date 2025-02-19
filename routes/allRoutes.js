const express = require('express')
const router = express.Router()
const controller = require("../controller/customerController")

// all end-pointes

// we needed to show all info about searched customer by name
// username be as name of search [ that represent the body! ]
router.post("/search",controller.searchUser);

// now we needed to show data from database into main page
router.get("/", controller.showData)

// import note: the order of get method, it be important where if any method that handle data based on id, it must be in last code:
// see user data

router.get("/user/:id",controller.showUserDetails);
router.delete("/delete/:id", controller.deleteUser);

module.exports = router