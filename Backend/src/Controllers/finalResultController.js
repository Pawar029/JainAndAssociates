const finalResult = require("../models/finalResult");
const result = require("../models/results");
const resultBeam = require("../models/resultBeam");
const resultColumn = require("../models/resultColumn");
const resultFooting = require("../models/resultFooting");
const resultStair = require("../models/resultStair");
const clientlogin = require("../models/loginClient");
const express = require("express");
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());
const bodyParser = require('body-parser');
app.use(bodyParser.json());

async function pushfinalResultController(req,res){
  try{
    const slabData = await result.findOne();
    const beamData = await resultBeam.findOne();
    const columnData = await resultColumn.findOne();
    const footingData = await resultFooting.findOne();
    const stairData = await resultStair.findOne();
    const logindata = await clientlogin.findOne();
    let cement = 0;
    cement = slabData.slabCement + beamData.beamCement + columnData.columnCement + footingData.footingCement + stairData.stairCement;

    let sand = 0;
    sand = slabData.slabSand + beamData.beamSand + columnData.columnSand + footingData.footingSand + stairData.stairSand;

    let aggregate = 0;
    aggregate = slabData.slabAggregate + beamData.beamAggregate + columnData.columnAggregate + footingData.footingAggregate + stairData.stairAggregate;

    console.log("Cement",cement);
    console.log("Sand",sand);
    console.log("Aggregate",aggregate);

    

    const myMap = new Map();

    // For Slab Steel
    if(slabData.slabSteel){
        console.log("Slab steel is ",slabData.slabSteel);
        const data = slabData.slabSteel;
        for (let k in data){
            if(myMap.has(k)){
                myMap.set(k,myMap.get(k) + data[k]);
            }else{
                myMap.set(k,data[k]);
            }
        }
    }

    // For Beam Steel
    if(beamData.beamSteel){
        console.log("beam steel is ",beamData.beamSteel);
        const data = beamData.beamSteel;
        for (let k in data){
            if(myMap.has(k)){
                myMap.set(k,myMap.get(k) + data[k]);
            }else{
                myMap.set(k,data[k]);
            }
        } 
    }   

    // For Column Steel
    if(columnData.columnSteel){
        console.log("column steel is ",columnData.columnSteel);
        const data = columnData.columnSteel;
        for (let k in data){
            if(myMap.has(k)){
                myMap.set(k,myMap.get(k) + data[k]);
            }else{
                myMap.set(k,data[k]);
            }
        }
    }

    // For Footing Steel
    if(footingData.footingSteel){
        console.log("footing steel is ",footingData.footingSteel);
        const data = footingData.footingSteel;
        for (let k in data){  
            if(myMap.has(k)){
                myMap.set(k,myMap.get(k) + data[k]);
            }else{
                myMap.set(k,data[k]);
            }
        }
    }

    // For Stair Steel
    if(stairData.stairSteel){
        console.log("stair steel is ",stairData.stairSteel);
        const data = stairData.stairSteel;
        for (let k in data){
            if(myMap.has(k)){  
                myMap.set(k,myMap.get(k) + data[k]);
            }else{
                myMap.set(k,data[k]);
            }   
        }    
    }
    // Convert the Map to a plain object
    const dataObject = Object.fromEntries(myMap);

    const answer = {
        clientName:logindata.name,
        clientNumber:logindata.number,
        Cement:cement,
        Sand:sand,
        Aggregate:aggregate,
        Steel:dataObject
    } 
  
    console.log("Answer is ",answer);

    const updateddata = await finalResult.findOneAndUpdate({ },answer, {new:true});
    // const updateddata = await finalResult.create(answer);
    console.log("Updated Result",updateddata);
    res.json({ success: true, answer });
}catch(e){
    res.send("show error");
    res.send(e);
    res.status(500).send("Internal Server Error");
}       
    
}

async function getfinalResultController(req,res){
    try{
        const data = await finalResult.findOne();
        res.send(data);
    }catch(e){
        res.send("show error");
        res.send(e);
        res.status(500).send("Internal Server Error");
    }   
}

module.exports.pushfinalResultController = pushfinalResultController;
module.exports.getfinalResultController = getfinalResultController;
