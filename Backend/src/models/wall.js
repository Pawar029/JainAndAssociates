const mongoose = require("mongoose");
const validator = require("validator");


const wallSchema = new mongoose.Schema({
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
    noOfSameWall : {
        type:Number,
        required:true
    },
    numberOfBricks : {
        type:Number,
        required:true,
    },
    No_of_cement_bags : {
        type:Number,
        required:true,
    },
    Vol_of_sand : {
        type:Number,
        required:true,
    },
    
})

const wall = new mongoose.model('wall', wallSchema);
module.exports = wall