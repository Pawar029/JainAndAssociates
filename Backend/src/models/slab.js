const mongoose = require("mongoose");
const validator = require("validator");

// const pairSchema = new mongoose.Schema({
//     dia : { type: Number, required: true },
//     weight : { type: Number, required: true }
// });


const slabSchema = new mongoose.Schema({

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
    noOfSameSlab : {
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
    main_dia : {
        type:Number,
        required:true,
    },
    Weight_mb : {
        type:Number,
        required:true,
    },
    dist_dia : {
        type:Number,
        required:true,
    },
    Weight_db : {
        type:Number,
        required:true,
    },
    top_ex_bar : {
        type:Number,
    },
    Weight_tb : {
        type:Number,
    },
    // slabSteel: [{
    //     type:pairSchema,
    //     required:true,
    // }],
})

const slab = new mongoose.model('slab', slabSchema);
module.exports = slab