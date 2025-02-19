const controller = require("../controller/customerController")
const express = require('express')
const router = express.Router()

router.get("/edit/:id", controller.showEditPage);

// updates part 1
router.put("/edit/:id", controller.editUserData);

module.exports = router;