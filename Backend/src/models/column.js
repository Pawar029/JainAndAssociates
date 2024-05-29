const mongoose = require("mongoose");
const validator = require("validator");


const columnSchema = new mongoose.Schema({
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
    selectedOption : {
        type:String,
        required:true
    },
    noOfSameColumn : {
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
    longitudinalBarWeight : {
        type:Number,
        required:true,
    },
    stir_dia : {
        type:Number,
        required:true,
    },
    stirrupsWeight : {
        type:Number,
        required:true,
    },
    
    // slabSteel: [{
    //     type:pairSchema,
    //     required:true,
    // }],
})

const column = new mongoose.model('column', columnSchema);
module.exports = column