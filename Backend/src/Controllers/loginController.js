const clientlogin = require("../models/loginClient");
const clientregister = require("../models/registerClient");
const express = require("express");
const app = express();
app.use(express.json());

// async function pushLoginController(req, res) {
//     const name = req.body.name;
//     const number = req.body.number;
//     console.log(req.body);
//     const user = new clientlogin(req.body);
//     console.log("users",user);
//     if(!name && !number){
//         res.send("Please enter name and number");
//     }
//     // const data = await clientregister.findOne({ number })
//     const data = await clientregister.find({$and : [{ number:number }, { name:name }]});

//     console.log(data);
//     if(data.length === 0){
//         res.send("Invalid name or number");
//     }else{
//         user.save().then(() => {
//             res.json({user, success:true});
//         }).catch((e) => {
//             res.send("error");
//         })
// }
// } 

async function pushLoginController(req, res) {
    const { name, number } = req.body;
  
    // Check if name and number are provided
    if (!name || !number) {
        return res.status(400).json({ success: false, message: "Please enter name and number" });
    }
  
    try {
        // Find user in clientregister table
        const user = await clientregister.findOne({ $and: [{ number }, { name }] });
  
        if (!user) {
            // User not found in clientregister table
            return res.status(400).json({ success: false, message: "Invalid name or number" });
        }
  
        // User found, save login details
        const login = new clientlogin(req.body);
        await login.save();
        console.log("new User logedin ",login)
        res.json({ user, success: true });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }

async function getLoginController(req,res) {
    // console.log("hello");
    // res.send("okk");
    try{
        // const number = req.query.number;
        const user = await clientlogin.findOne();
        // console.log("Sunil ",user)
        // const user = await clientlogin.find();
        res.status(200).send(user);
        // res.json({loggedIn:true ,user});
    }catch(e){
        // res.send("show error");
        res.status(400).send(e);
        // res.json({loggedIn:false,e});
    }
}

// async function LogoutController(req,res) {
//     try{
//         await clientlogin.findByIdAndDelete(req.params.id);
//         if(!req.params.id){
//             return res.status(400).send();
//         }
//         res.send({ success: true });
//     }catch(e){
//         res.status(500).send("Error occurred while logging out.");
//     } 
// }

async function logoutController(req, res) {
    // try {
    //   const userId = req.params.id;
    //   if (!userId) {
    //     return res.status(400).send("User ID is missing");
    //   }
    //   const deletedUser = await clientlogin.findOneAndDelete({number:userId});
    //   const deletedUser = await clientlogin.findOneAndDelete();
    //   if (!deletedUser) {
    //     return res.status(404).send("User not found");
    //   }
    //   res.send({ success: true,deletedUser }); // Sending a success response
    // } catch (error) {
    //   console.error("Error occurred while logging out:", error);
    //   res.status(500).send(`error : ${error.message}`);
    // } 

    try{
      const deleteddata = await clientlogin.findByIdAndDelete(req.params.id);
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
  
  
  



// async function updateLoginController(req,res) {
//     try{
//         const updateddata = await clientlogin.findByIdAndUpdate(req.params.id, req.body, {new:true});
//         if(!req.params.id){
//             return res.status(400).send();
//         }
//         res.send(updateddata)
//         console.log(updateddata);
//     }catch(e){
//         res.send("show error");
//         res.status(400).send(e);
//     } 
// }


module.exports.pushLoginController = pushLoginController;
module.exports.getLoginController = getLoginController;
module.exports.logoutController = logoutController;
// module.exports.updateLoginController = updateLoginController;
