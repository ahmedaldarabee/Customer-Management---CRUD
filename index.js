// first step
const express = require("express");
const app = express(); // start enable all middleware that we needed by express js

// for enable and manage the routing operations
const allRoutes = require('./routes/allRoutes');
const addCustomer = require('./routes/addCustomer');

// these method for updates to the data
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

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


// automatic refresh in console + browser screen
// [ optional, if you not needed to it, try to use just npx nodemon server-file like index.js ]

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

app.use(addCustomer);
app.use(allRoutes)

// this section if you use this directory in each of end-point in this file
// it will manage all of these operations by express framework!

// node js it build the server where the express that manage all of requests that interact with this server ? 
app.listen(5000,()=>{
    console.log("We are listening for your any new actions...")
})