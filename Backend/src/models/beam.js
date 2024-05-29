const mongoose = require("mongoose");

const beamSchema = new mongoose.Schema({
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
    noOfSameBeam : {
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
    top_dia : {
        type:Number,
        required:true,
    },
    Weight_tb : {
        type:Number,
        required:true,
    },
    bott_dia : {
        type:Number,
        required:true,
    },
    Weight_bb : {
        type:Number,
        required:true,
    },
    stir_dia : {
        type:Number,
        required:true,
    },
    Weight_st : {
        type:Number,
        required:true,
    },
    top_ex_dia : {
        type:Number,
    },
    Weight_top_ex : {
        type:Number,
    },
    bott_ex_dia : {
        type:Number,
    },
    Weight_bott_ex : {
        type:Number,
    },
    
})

const beam = new mongoose.model('beam', beamSchema);
module.exports = beam;