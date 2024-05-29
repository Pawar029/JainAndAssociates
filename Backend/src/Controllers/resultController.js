const result = require("../models/results");
const resultBeam = require("../models/resultBeam");
const resultColumn = require("../models/resultColumn");
const resultFooting = require("../models/resultFooting");
const resultStair = require("../models/resultStair");
const slab = require("../models/slab");
const beam = require("../models/beam");
const column = require("../models/column");
const footing = require("../models/footing");
const stair = require("../models/stair");
const clientlogin = require("../models/loginClient");
const express = require("express");
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());
const bodyParser = require('body-parser');
app.use(bodyParser.json());

function calculateResult(data){

        let cement = 0;
        let sand = 0;
        let aggregate = 0;
        data.forEach(obj => {
            // Convert string values to numbers 
            const cementValue = parseFloat(obj.No_of_cement_bags);
            const sandValue = parseFloat(obj.Vol_of_sand);
            const aggregateValue = parseFloat(obj.Vol_of_Aggregate);

            // Check if the converted values are valid numbers
            if (!isNaN(cementValue)) {
                cement += cementValue;
            }
            if (!isNaN(sandValue)) {
                sand += sandValue;
            }
            if (!isNaN(aggregateValue)) {
                aggregate += aggregateValue;
            }
        })
        const result = {
            cement,
            sand,
            aggregate,
        };
        return result;
} 


// Calculation of Steel for Slab
function calculateSteel(data){

    console.log("in the steel");
    const temp = data.filter(item => item.selectedOption==="oneway");
    console.log(temp);

    const myMap = new Map();
    data.forEach(item => {
        if(myMap.has(item.main_dia)){
            myMap.set(item.main_dia,myMap.get(item.main_dia) + item.Weight_mb);
        }else {
            myMap.set(item.main_dia, item.Weight_mb);
          }

        if (myMap.has(item.dist_dia)) {
            myMap.set(item.dist_dia, myMap.get(item.dist_dia) + item.Weight_db);
        } else {
            myMap.set(item.dist_dia, item.Weight_db);
        }

        // if(item.selectedOption === 'oneway' || item.selectedOption === 'twoway'){
        if((item.top_ex_bar)){
            if (myMap.has(item.top_ex_bar)) {
              myMap.set(item.top_ex_bar, myMap.get(item.top_ex_bar) + item.Weight_tb);
            } else {
              myMap.set(item.top_ex_bar, item.Weight_tb);
            }
        }
        
    })
    // Convert the Map to a plain object
    const dataObject = Object.fromEntries(myMap);
    console.log(dataObject);
      const result = {
          slabSteel:dataObject,
      };
      console.log("Mymap is here ",myMap);
      console.log("Result is here ",result);
      return result;
}

// Calculation of Steel for Beam
function calculateBeamSteel(data){

    console.log("in the steel");

    const myMap = new Map();
    data.forEach(item => {
        console.log("Diameter ",item.top_dia);

        if(myMap.has(item.top_dia)){
            myMap.set(item.top_dia,myMap.get(item.top_dia) + item.Weight_tb);
        }else {
            myMap.set(item.top_dia, item.Weight_tb);
          }

        if (myMap.has(item.bott_dia)) {
            myMap.set(item.bott_dia, myMap.get(item.bott_dia) + item.Weight_bb);
        } else {
            myMap.set(item.bott_dia, item.Weight_bb);
        }
        
        if (myMap.has(item.stir_dia)) {
            myMap.set(item.stir_dia, myMap.get(item.stir_dia) + item.Weight_st);
        } else {
            myMap.set(item.stir_dia, item.Weight_st);
        }
        
        if(item.top_ex_dia){
            if (myMap.has(item.top_ex_dia)) {
                myMap.set(item.top_ex_dia, myMap.get(item.top_ex_dia) + item.Weight_top_ex);
            } else {
                myMap.set(item.top_ex_dia, item.Weight_top_ex);
            }
        }
        
        if(item.bott_ex_dia){
            if (myMap.has(item.bott_ex_dia)) {
                myMap.set(item.bott_ex_dia, myMap.get(item.bott_ex_dia) + item.Weight_bott_ex);
            } else {
                myMap.set(item.bott_ex_dia, item.Weight_bott_ex);
            }
        }
        
        
    })
    // Convert the Map to a plain object
    const dataObject = Object.fromEntries(myMap);
    console.log(dataObject);
      const result = {
          beamSteel:dataObject,
      };
      console.log("Mymap is here ",myMap);
      console.log("Result is here ",result);
      return result;
}


// Calculation of Steel for Column
function calculateColumnSteel(data){

    console.log("in the steel");

    const myMap = new Map();
    data.forEach(item => {
        console.log("Diameter ",item.long_dia);

        if(myMap.has(item.long_dia)){
            myMap.set(item.long_dia,myMap.get(item.long_dia) + item.longitudinalBarWeight);
        }else {
            myMap.set(item.long_dia, item.longitudinalBarWeight);
          }

        if (myMap.has(item.stir_dia)) {
            myMap.set(item.stir_dia, myMap.get(item.stir_dia) + item.stirrupsWeight);
        } else {
            myMap.set(item.stir_dia, item.stirrupsWeight);
        }
    })
    // Convert the Map to a plain object
    const dataObject = Object.fromEntries(myMap);
    console.log(dataObject);
      const result = {
          columnSteel:dataObject,
      };
      console.log("Mymap is here ",myMap);
      console.log("Result is here ",result);
      return result;
}


// Calculation of Steel for Footing
function calculateFootingSteel(data){

    console.log("in the steel");

    const myMap = new Map();
    data.forEach(item => {

        if(myMap.has(item.long_dia)){
            myMap.set(item.long_dia,myMap.get(item.long_dia) + item.longBarWeight);
        }else {
            myMap.set(item.long_dia, item.longBarWeight);
          }

        if (myMap.has(item.short_dia)) {
            myMap.set(item.short_dia, myMap.get(item.short_dia) + item.shortBarWeight);
        } else {
            myMap.set(item.short_dia, item.shortBarWeight);
        }
    })
    // Convert the Map to a plain object
    const dataObject = Object.fromEntries(myMap);
    console.log(dataObject);
      const result = {
          footingSteel:dataObject,
      };
      console.log("Mymap is here ",myMap);
      console.log("Result is here ",result);
      return result;
}


// Calculation of Steel for Stair
function calculateStairSteel(data){

    console.log("in the steel");

    const myMap = new Map();
    data.forEach(item => {

        if(myMap.has(item.long_dia)){
            myMap.set(item.long_dia,myMap.get(item.long_dia) + item.longBarWeight);
        }else {
            myMap.set(item.long_dia, item.longBarWeight);
          }

        if (myMap.has(item.short_dia)) {
            myMap.set(item.short_dia, myMap.get(item.short_dia) + item.shortBarWeight);
        } else {
            myMap.set(item.short_dia, item.shortBarWeight);
        }
    })
    // Convert the Map to a plain object
    const dataObject = Object.fromEntries(myMap);
    console.log(dataObject);
      const result = {
          stairSteel:dataObject,
      };
      console.log("Mymap is here ",myMap);
      console.log("Result is here ",result);
      return result;
}


// Patch Api for Slab
async function pushSlabResultController(req, res) { 
    try{
        const user = await clientlogin.findOne();

        const data = await slab.find({
            clientName: user.name,
            clientNumber: user.number
        });
        const ans = calculateResult(data);
        const answer = {
            slabCement:ans.cement,
            slabSand:ans.sand,
            slabAggregate:ans.aggregate
        }
        console.log("here is new res ",answer);
        const steel = calculateSteel(data);
        const finalResult = {...answer, ...steel };

        // let resultDocument = await result.findOne();

        // // Update the fields
        // resultDocument.slabCement = finalResult.slabCement;
        // resultDocument.slabSand = finalResult.slabSand;
        // resultDocument.slabAggregate = finalResult.slabAggregate;
        // resultDocument.slabSteel = finalResult.slabSteel;

        // // Save the updated document
        // const updateddata = await resultDocument.save();

        console.log("Final Result",finalResult);
        const updateddata = await result.findOneAndUpdate({ },finalResult, {new:true});
        // await result.create(ans);
        console.log("Updated Result",updateddata);
        res.json({ success: true, updateddata });
    }catch(e){ 
        res.send("show error");
        res.send(e);
        res.status(500).send("Internal Server Error");
    }       
}

// Get API for Slab
async function getSlabResultController(req,res) {
    // console.log("hello");
    try{
        const data = await result.findOne();
        res.send(data);
    }catch(e){
        res.send("show error");
        res.send(e);
        res.status(500).send("Internal Server Error");
    }       
}


// Patch Api for Beam
async function pushBeamResultController(req, res) { 
    try{
        const user = await clientlogin.findOne();

        const data = await beam.find({
            clientName: user.name,
            clientNumber: user.number
        });
        // const data = await beam.find();
        const ans = calculateResult(data);
        const answer = {
            beamCement:ans.cement,
            beamSand:ans.sand,
            beamAggregate:ans.aggregate
        }
        const steel = calculateBeamSteel(data);
        const finalResult = {...answer, ...steel };

        console.log("Final Result",finalResult);
        const updateddata = await resultBeam.findOneAndUpdate({ },finalResult, {new:true});
        // const updateddata = await resultBeam.create(finalResult);
        console.log("Updated Result",updateddata);
        res.json({ success: true, updateddata });
    }catch(e){
        res.send("show error");
        res.send(e);
        res.status(500).send("Internal Server Error");
    }       
}

// Get API for Beam
async function getBeamResultController(req,res) {
    // console.log("hello");
    try{
        const data = await resultBeam.findOne();
        res.send(data);
    }catch(e){
        res.send("show error");
        res.send(e);
        res.status(500).send("Internal Server Error");
    }       
}

 

// Patch Api for Column
async function pushColumnResultController(req, res) { 
    try{
        const user = await clientlogin.findOne();

        const data = await column.find({
            clientName: user.name,
            clientNumber: user.number
        });
        // const data = await column.find();
        const ans = calculateResult(data);
        const answer = {
            columnCement:ans.cement,
            columnSand:ans.sand,
            columnAggregate:ans.aggregate
        }
        const steel = calculateColumnSteel(data);
        const finalResult = {...answer, ...steel };

        console.log("Final Result",finalResult);
        const updateddata = await resultColumn.findOneAndUpdate({ },finalResult, {new:true});
        // const updateddata = await resultColumn.create(finalResult);
        console.log("Updated Result",updateddata);
        res.json({ success: true, updateddata });
    }catch(e){
        res.send("show error");
        res.send(e);
        res.status(500).send("Internal Server Error");
    }       
}
 
// Get API for Column
async function getColumnResultController(req,res) {
    // console.log("hello");
    try{
        const data = await resultColumn.findOne();
        res.send(data);
    }catch(e){
        res.send("show error");
        res.send(e);
        res.status(500).send("Internal Server Error");
    }        
}


// Patch Api for Footing
async function pushFootingResultController(req, res) { 
    try{
        const user = await clientlogin.findOne();

        const data = await footing.find({
            clientName: user.name,
            clientNumber: user.number
        });
        // const data = await footing.find();
        const ans = calculateResult(data);
        const answer = {
            footingCement:ans.cement,
            footingSand:ans.sand,
            footingAggregate:ans.aggregate
        }
        const steel = calculateFootingSteel(data);
        const finalResult = {...answer, ...steel };

        console.log("Final Result",finalResult);
        const updateddata = await resultFooting.findOneAndUpdate({ },finalResult, {new:true});
        // const updateddata = await resultFooting.create(finalResult);
        console.log("Updated Result",updateddata);
        res.json({ success: true, updateddata });
    }catch(e){
        res.send("show error");
        res.send(e);
        res.status(500).send("Internal Server Error");
    }       
}
 
// Get API for Footing
async function getFootingResultController(req,res) {
    // console.log("hello");
    try{
        const data = await resultFooting.findOne();
        res.send(data);
    }catch(e){
        res.send("show error");
        res.send(e);
        res.status(500).send("Internal Server Error");
    }        
}


// Patch Api for StairCase
async function pushStairResultController(req, res) { 
    try{
        const user = await clientlogin.findOne();

        const data = await stair.find({
            clientName: user.name,
            clientNumber: user.number
        });
        // const data = await stair.find();
        const ans = calculateResult(data);
        const answer = {
            stairCement:ans.cement,
            stairSand:ans.sand,
            stairAggregate:ans.aggregate
        }
        const steel = calculateStairSteel(data);
        const finalResult = {...answer, ...steel };

        console.log("Final Result",finalResult);
        const updateddata = await resultStair.findOneAndUpdate({ },finalResult, {new:true});
        // const updateddata = await resultStair.create(finalResult);
        console.log("Updated Result",updateddata);
        res.json({ success: true, updateddata });
    }catch(e){
        res.send("show error");
        res.send(e);
        res.status(500).send("Internal Server Error");
    }               
}
 
// Get API for StairCase
async function getStairResultController(req,res) {
    // console.log("hello");
    try{
        const data = await resultStair.findOne();
        res.send(data);
    }catch(e){
        res.send("show error");
        res.send(e);
        res.status(500).send("Internal Server Error");
    }        
}





module.exports.pushSlabResultController = pushSlabResultController;
module.exports.getSlabResultController = getSlabResultController;
module.exports.pushBeamResultController = pushBeamResultController;
module.exports.getBeamResultController = getBeamResultController;
module.exports.pushColumnResultController = pushColumnResultController;
module.exports.getColumnResultController = getColumnResultController;
module.exports.pushFootingResultController = pushFootingResultController;
module.exports.getFootingResultController = getFootingResultController;
module.exports.pushStairResultController = pushStairResultController;
module.exports.getStairResultController = getStairResultController;






