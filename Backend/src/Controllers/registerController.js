
const clientregister = require("../models/registerClient");
const express = require("express");
const app = express();
app.use(express.json());


// function pushRegisterController(req, res) {
//     const user = new clientregister(req.body);
//     user.save().then(() => {
//         res.json({user,success:true});
//     }).catch((e) => {
//         console.log(e);
//         res.send("error");
//     })
// }

async function pushRegisterController(req, res) {
    const { name, location, number, email } = req.body;

    try {
        // Check if user already exists with the provided mobile number
        const existingUser = await clientregister.findOne({ number: number }).exec();

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = new clientregister({
            name,
            location,
            number,
            email,
        });

        await newUser.save();

        res.json({ user: newUser, success: true });
    } catch (error) {
        console.error("Error while registering user:", error);
        res.status(500).send("Internal Server Error");
    }
}

async function getOneRegisterController(req,res) {
    // console.log("hello");
    // res.send("okk");
    try{
        const number = req.query.number;
        const user = await clientregister.findOne({ number:number });
        // res.send(user);
        res.json({ user, success: true });
    }catch(e){
        // res.send("show error");
        res.send(e);
    }
}

async function getRegisterController(req,res) {
    try{
        const data = await clientregister.find();
        res.send(data);
        // console.log(data);
    }catch(e){
        res.send("show error");
        res.send(e);
    } 
}

async function deleteRegisterController(req,res){
    try{
        const deleteddata = await clientregister.findByIdAndDelete(req.params.id);
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

module.exports.pushRegisterController = pushRegisterController;
module.exports.getRegisterController = getRegisterController;
module.exports.deleteRegisterController = deleteRegisterController;
module.exports.getOneRegisterController = getOneRegisterController;
