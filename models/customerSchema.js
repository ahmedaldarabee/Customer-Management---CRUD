const mongoose = require("mongoose");
const Schema = mongoose.Schema; // Correct way that used to connect with [new Schema]

// NoSQL Schema
const customerSchema = new Schema({
        firstName:String,
        lastName:String,
        email:String,
        phone:Number,
        age:Number,
        country:String,
        gender:String
    },{
        timestamps:true,//to enable creating time and updating time to this section of data
    }
);

const customerInfo =  mongoose.model("CustomerRegistration",customerSchema);
module.exports = customerInfo;
