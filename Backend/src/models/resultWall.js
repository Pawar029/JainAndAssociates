const mongoose = require("mongoose");
const validator = require("validator");  

const resultWallSchema = new mongoose.Schema({
    wallBricks : {
        type:Number,
        required:true,
    },
    wallCement : {
        type:Number,
        required:true,
    },
    wallSand : {
        type:Number,
        required:true,
    },
})

const resultWall = new mongoose.model('resultWall', resultWallSchema);
module.exports = resultWall;