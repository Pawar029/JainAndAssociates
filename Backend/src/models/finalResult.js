const mongoose = require("mongoose");
const validator = require("validator");  

const finalResultSchema = new mongoose.Schema({
    clientName : {
        type:String,
        required:true
    },
    clientNumber : {
        type:Number,
        required:true
    },
    Cement : {
        type:Number,
        required:true,
    },
    Sand : {
        type:Number,
        required:true,
    },
    Aggregate : {
        type:Number,
        required:true,
    },
    Steel:{
        type: Object,
        required:true,
    }
})

const finalResult = new mongoose.model('finalResult', finalResultSchema);
module.exports = finalResult;