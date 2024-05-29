const mongoose = require("mongoose");
const validator = require("validator");  

const resultStairSchema = new mongoose.Schema({
    stairCement : {
        type:Number,
        required:true,
    },
    stairSand : {
        type:Number,
        required:true,
    },
    stairAggregate : {
        type:Number,
        required:true,
    },
    stairSteel:{
        type: Object,
        required:true,
    }
})

const stairFooting = new mongoose.model('stairFooting', resultStairSchema);
module.exports = stairFooting;