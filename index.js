// first step
const express = require("express");
const app = express();
const moment = require('moment');

const methodOverride= require('method-override');
app.use(methodOverride('_method'))

app.set("view engine","ejs");// it's support EJS with this project to embedded html with Js without problems

app.use(express.json()); // It enables the server to read and process JSON data sent in requests (e.g., API calls).
app.use(express.static("public"));

// 1. This code is used in Express.js to process data coming from forms 
app.use(express.urlencoded({ extended: true }));
// (Forms) in POST requests when data is sent using `application/x-www-form-urlencoded`.  
// 2. `express.urlencoded()` is a middleware used to parse request data sent from forms.

// public folder that hold another type of files like : css , js , imgs , libraries like bootstrap

// second step:
// connect with database

const mongoose = require("mongoose");
const connectionResult = mongoose.connect("mongodb+srv://darabee:darabee$79@learningdb.tnbll.mongodb.net/customers-data?retryWrites=true&w=majority&appName=LearningDB")

connectionResult.then(() => {
    console.log("connection successfully with database");
})
connectionResult.catch((error) => {
    console.log("there is an error in connection ", error.message);
})

const customerInfo = require("./models/customerSchema")

// automatic refresh:

const path = require("path");
const livereload = require("livereload");

const liveReloadServer = livereload.createServer();
const connectLivereload = require("connect-livereload");

liveReloadServer.watch(path.join(__dirname, 'public'));
app.use(connectLivereload());

liveReloadServer.server.once("connection", () => {
    setTimeout(()=>{
        liveReloadServer.refresh("/")
    },100);
})

// this fun handler that used just to show add users page
app.get("/user/add.html",(req,res) => {
    res.render("user/add");
})

// this fun handler that used just to send users data into database
app.post("/user/add.html", (req,res) => {
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

// we needed to show all info about searched customer by name
// username be as name of search [ that represent the body! ]
app.post("/search", async (req, res) => {
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
app.get("/",(req,res) => {
    
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
app.get("/user/:id", async (req, res) => {
    const userId = req.params.id;

    // to check if this ObjectId is valid or not! 
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).send("Invalid ID format");
    }

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

app.get("/edit/:id", async (req, res) => {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).send("Invalid ID format");
    }

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
app.put("/edit/:id", async (req, res) => {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).send("Invalid ID format");
    }

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

app.delete("/delete/:id", async (req,res) => {
    // in delete or update user you needed to define id as object!
    // button type must be : submit type to do updates or delete

    const userId = req.params.id;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).send("Invalid ID");
    }
    
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

// node js it build the server where the express that manage all of requests that interact with this server ? 
app.listen(5000,()=>{
    console.log("We are listening for your any new actions...")
})