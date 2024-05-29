const mongoose = require("mongoose");
const validator = require("validator");

// const slabSteelSchema = new mongoose.Schema({
//         dia : { type: Number, required: true },
//         weight : { type: Number, required: true }
//     });
    

const resultSchema = new mongoose.Schema({
    slabCement : {
        type:Number,
        required:true,
    },
    slabSand : {
        type:Number,
        required:true,
    },
    slabAggregate : {
        type:Number,
        required:true,
    },
    slabSteel:{
        type: Object,
        required:true,
    }
})

const result = new mongoose.model('result', resultSchema);
module.exports = result;