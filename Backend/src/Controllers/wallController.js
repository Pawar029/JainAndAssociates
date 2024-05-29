
const wall = require("../models/wall");
const clientlogin = require("../models/loginClient");
const resultWall = require("../models/resultWall");
const express = require("express");
const bodyParser = require('body-parser');
const app = express();
app.use(express.json());
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());

function pushWallController(req, res) {

    const user = new wall(req.body);
    user.save().then(() => {
        res.send(user);
    }).catch((e) => {
        res.send("error1");
    })
}

async function getWallController(req,res) {
    // console.log("hello");
    try{
        const user = await clientlogin.findOne();
        if(user){
            const data = await wall.find({
                clientName: user.name,
                clientNumber: user.number
            });
            res.send(data);     
        }
        // res.send("error")  
    }catch(e){
        res.send("show error");
        res.send(e);
        res.status(500).send("Internal Server Error");
    }       
}

async function deleteWallController(req,res) {
    // await slab.deleteMany({ });

    try{
        const deleteddata = await wall.findByIdAndDelete(req.params.id);
        if(!req.params.id){
            return res.status(400).send();
        }
        res.status(200).send(deleteddata);
        console.log(deleteddata);
    }catch(e){
        res.send("show error");
        res.status(500).send(e);
    } 
}

function calculateResult(data){
    console.log("hello");
    let cement = 0;
    let sand = 0;
    let bricks = 0;
    data.forEach(obj => {
        // Convert string values to numbers 
        const bricksValue = parseFloat(obj.numberOfBricks);
        const cementValue = parseFloat(obj.No_of_cement_bags);
        const sandValue = parseFloat(obj.Vol_of_sand);
        // Check if the converted values are valid numbers
        if (!isNaN(cementValue)) {
            cement += cementValue;
        }
        if (!isNaN(sandValue)) {
            sand += sandValue;
        }
        if (!isNaN(bricksValue)) {
            bricks += bricksValue;
        }
    })
    const result = {
        wallBricks: bricks,
        wallCement: cement,
        wallSand: sand,
    };
    console.log(result);
    return result;
} 

async function updateWallResultController(req,res) {
    try{
        const user = await clientlogin.findOne();

        const data = await wall.find({
            clientName: user.name,
            clientNumber: user.number
        });
        // const data = await wall.find();
        console.log("here is data ",data);
        const ans = calculateResult(data);

        console.log("Final Result",ans);
        const updateddata = await resultWall.findOneAndUpdate({ },ans, {new:true});
        // const updateddata = await resultWall.create(ans);
        console.log("Updated Result",updateddata);
        res.json({ success: true, updateddata });
    }catch(e){
        res.send("show error");
        res.send(e);
        res.status(500).send("Internal Server Error");
    }
}

async function getWallResultController(req,res) {
    // console.log("hello");
    try{
        const data = await resultWall.findOne();
        res.send(data);
    }catch(e){
        res.send("show error");
        res.send(e);
        res.status(500).send("Internal Server Error");
    }        
}

module.exports.pushWallController = pushWallController;
module.exports.getWallController = getWallController;
module.exports.deleteWallController = deleteWallController;
module.exports.updateWallResultController = updateWallResultController;
module.exports.getWallResultController = getWallResultController;





