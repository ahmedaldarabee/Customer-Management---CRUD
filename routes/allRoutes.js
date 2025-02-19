const express = require('express')
const router = express.Router()
const moment = require('moment');
const customerInfo = require("../models/customerSchema");

// all end-pointes

// we needed to show all info about searched customer by name
// username be as name of search [ that represent the body! ]
router.post("/search", async (req, res) => {
    if (req.body.username === '') {
        return res.redirect("/");
    }

    try {
        const customer = await customerInfo.find({
            $or: [{ firstName: req.body.username }, { lastName: req.body.username }],
        });

        res.render("user/search", { userData: customer });

    } catch (error) {
        res.status(500).send(error.message);
    }
});

// now we needed to show data from database into main page
router.get("/",(req,res) => {
    
    const database = customerInfo.find()
    
    database.then((result) => {
        res.render("index",{
            usersInfo:result,
            moment:moment 
        })
    })

    database.catch((error) => {
        console.log(error.message);
    })
})

// import note: the order of get method, it be important where if any method that handle data based on id, it must be in last code:
// see user data

router.get("/user/:id", async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await customerInfo.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.render("user/view", { neededUser: user, moment: moment });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get("/edit/:id", async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await customerInfo.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        
        res.render("user/edit", { neededUser: user });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// updates part 1
router.put("/edit/:id", async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await customerInfo.updateOne({
            _id:userId,//just to needed to define body and all new data it will moved into server with new object
        },req.body) // that be as object obtain name of each input!

        if (!user) {
            return res.status(404).send("User not found");
        }

        res.redirect("/");
    
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.delete("/delete/:id", async (req,res) => {
    // in delete or update user you needed to define id as object!
    // button type must be : submit type to do updates or delete

    const userId = req.params.id;
    
    try{
        const user = await customerInfo.deleteOne({_id:userId})
        
        if (!user) {
            return res.status(404).send("User not found!");
        }
        res.redirect("/");//index.ejs
    }catch(error){
        res.status(500).send(error.message);
    }
});

module.exports = router