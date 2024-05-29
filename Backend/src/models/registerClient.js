
const mongoose = require("mongoose");
const validator = require("validator");

const clientregisterSchema = new mongoose.Schema({
    name : {
        type:String,
        required:true,
        // minlength:3
    },
    location : {
        type:String,
        required:true,
        // minlength : 2,
        // maxlength : 11
    },
    number : {
        type:Number,
        required:true,
        minlength : 10,
        maxlength : 10
    },
    email : {
        type:String,
        required:true,
        // minlength : 2
    }
})

const clientregister = new mongoose.model('clientregister', clientregisterSchema);
module.exports = clientregister;