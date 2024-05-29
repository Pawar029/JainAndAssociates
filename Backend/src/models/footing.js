const mongoose = require("mongoose");
const validator = require("validator");


const footingSchema = new mongoose.Schema({
    clientName : {
        type:String,
        required:true
    },
    clientNumber : {
        type:Number,
        required:true
    },
    name : {
        type:String,
        required:true
    },
    noOfSameFooting : {
        type:Number,
        required:true
    },
    No_of_cement_bags : {
        type:Number,
        required:true,
    },
    Vol_of_sand : {
        type:Number,
        required:true,
    },
    Vol_of_Aggregate : {
        type:Number,
        required:true,
    },
    long_dia : {
        type:Number,
        required:true,
    },
    longBarWeight : {
        type:Number,
        required:true,
    },
    short_dia : {
        type:Number,
        required:true,
    },
    shortBarWeight : {
        type:Number,
        required:true,
    },
    
})

const footing = new mongoose.model('footing', footingSchema);
module.exports = footing