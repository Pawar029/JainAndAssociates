const mongoose = require("mongoose");
const validator = require("validator");  

const resultColumnSchema = new mongoose.Schema({
    columnCement : {
        type:Number,
        required:true,
    },
    columnSand : {
        type:Number,
        required:true,
    },
    columnAggregate : {
        type:Number,
        required:true,
    },
    columnSteel:{
        type: Object,
        required:true,
    }
})

const resultColumn = new mongoose.model('resultColumn', resultColumnSchema);
module.exports = resultColumn;