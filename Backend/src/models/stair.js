const mongoose = require("mongoose");
const validator = require("validator");


const stairSchema = new mongoose.Schema({
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
    noOfSameStair : {
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

const stair = new mongoose.model('stair', stairSchema);
module.exports = stair