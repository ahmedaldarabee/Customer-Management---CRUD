const moment = require('moment');
const customerInfo = require("../models/customerSchema");

const showData = (req,res) => {
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
}

const showUserDetails = async (req, res) => {
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
}

const searchUser = async (req, res) => {
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
}

const showEditPage = async (req, res) => {
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
}

const editUserData = async (req, res) => {
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
}

const deleteUser = async (req,res) => {
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
}

const addUsersPage = (req,res) => {
    res.render("user/add");
}

const createUserData = (req,res) => {
    customerInfo.create(req.body) // we can use save or create to the req.body to hold data in database server.
    // then and catch that be as another way to connect with database [ async and await ]
    .then(() => {
        res.redirect("/")
        console.log("customer data sended successfully")
    })
    .catch((error) => {
        console.log(error.message);
    })
}

module.exports = {
    showData,
    showUserDetails,
    searchUser,
    showEditPage,
    editUserData,
    deleteUser,
    addUsersPage,
    createUserData,
}