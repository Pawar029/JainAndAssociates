const mongoose = require("mongoose");
const validator = require("validator");  

const resultBeamSchema = new mongoose.Schema({
    beamCement : {
        type:Number,
        required:true,
    },
    beamSand : {
        type:Number,
        required:true,
    },
    beamAggregate : {
        type:Number,
        required:true,
    },
    beamSteel:{
        type: Object,
        required:true,
    }
})

const resultBeam = new mongoose.model('resultBeam', resultBeamSchema);
module.exports = resultBeam;