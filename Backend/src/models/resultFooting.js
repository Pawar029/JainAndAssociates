const mongoose = require("mongoose");
const validator = require("validator");  

const resultFootingSchema = new mongoose.Schema({
    footingCement : {
        type:Number,
        required:true,
    },
    footingSand : {
        type:Number,
        required:true,
    },
    footingAggregate : {
        type:Number,
        required:true,
    },
    footingSteel:{
        type: Object,
        required:true,
    }
})

const resultFooting = new mongoose.model('resultFooting', resultFootingSchema);
module.exports = resultFooting;