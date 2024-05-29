
const beam = require("../models/beam");
const clientlogin = require("../models/loginClient");
const express = require("express");
const bodyParser = require('body-parser');
const app = express();
app.use(express.json());
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());

function pushBeamController(req, res) {

    const user = new beam(req.body);
    user.save().then(() => {
        res.send(user);
    }).catch((e) => {
        res.send("error1");
    })
}

async function getBeamController(req,res) {
    // console.log("hello");
    try{
        const user = await clientlogin.findOne();
        if(user){
            const data = await beam.find({
                clientName: user.name,
                clientNumber: user.number
            });
            res.send(data);
        }
        
    }catch(e){
        res.send("show error");
        res.send(e);
        res.status(500).send("Internal Server Error");
    }       
}

async function deleteBeamController(req,res) {
    // await slab.deleteMany({ });

    try{
        const deleteddata = await beam.findByIdAndDelete(req.params.id);
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

async function updateBeamController(req,res) {
    try{
        const updateddata = await beam.findByIdAndUpdate(req.params.id, req.body, {new:true});
        if(!req.params.id){
            return res.status(400).send();
        }
        res.status(200).send(updateddata);
    }catch(e){
        res.send("show error");
        res.status(400).send(e);
    } 
}

module.exports.pushBeamController = pushBeamController;
module.exports.getBeamController = getBeamController;
module.exports.deleteBeamController = deleteBeamController;
module.exports.updateBeamController = updateBeamController;





