

const mongoose = require("mongoose");
const validator = require("validator");

const clientloginSchema = new mongoose.Schema({
    name : {
        type:String,
        required:true,
        minlength:3
    },
    number : {
        type:Number,
        required:true,
        minlength : 10,
        maxlength : 10,
        unique: true
    }
})

const clientlogin = new mongoose.model('clientlogin', clientloginSchema);
module.exports = clientlogin