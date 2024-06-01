
const registerationApi = require("./Controllers/registerController");
const loginApi = require("./Controllers/loginController");
const slabApi = require("./Controllers/slabController");
const beamApi = require("./Controllers/beamController");
const columnApi = require("./Controllers/columnController");
const wallApi = require("./Controllers/wallController");
const footingApi = require("./Controllers/footingController");
const stairApi = require("./Controllers/stairController");
const resultApi = require("./Controllers/resultController");
const finalApi = require("./Controllers/finalResultController");
const express = require("express");
const mongoose = require('mongoose');
// require("./db/conn");
const clientregister = require("./models/registerClient");
// const slab = require("./models/slab")
const app = express();
const cors = require('cors');
// app.use(cors());
const corsOption = {
    origin: "https://jain-and-associates.vercel.app",
    method: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true,
};

app.use(cors(corsOption));
  
const DB = 'mongodb://SunilPawar:SunilPawar0123@jainandassociates-shard-00-00.0jchs.mongodb.net:27017,jainandassociates-shard-00-01.0jchs.mongodb.net:27017,jainandassociates-shard-00-02.0jchs.mongodb.net:27017/jain_associate?ssl=true&replicaSet=atlas-5y42xk-shard-0&authSource=admin&retryWrites=true&w=majority&appName=JainAndAssociates';
 
mongoose.connect(DB, {
    useUnifiedTopology:true,
}).then(() => {
    console.log(`Connection Done`);
}).catch((err) => console.log(`Connection  Not Done`));
const port = process.env.PORT || 8000;
    
app.use(express.json());

app.get("/",(req,res) => {
    res.send("hello from Anuj and Sunil");    
})
app.post("/register",registerationApi.pushRegisterController);
app.get("/oneregister",registerationApi.getOneRegisterController);
app.get("/register",registerationApi.getRegisterController);
app.delete("/register/:id",registerationApi.deleteRegisterController);


app.post("/login",loginApi.pushLoginController);
app.get("/profile",loginApi.getLoginController);
app.delete("/logout/:id",loginApi.logoutController);
// app.patch("/update/:id",loginApi.updateLoginController);

app.post("/slab",slabApi.pushSlabController);
app.get("/slab",slabApi.getSlabController);
app.delete("/slab/:id",slabApi.deleteSlabController);
app.patch("/slab/:id",slabApi.updateSlabController);

app.post("/beam",beamApi.pushBeamController);
app.get("/beam",beamApi.getBeamController);
app.delete("/beam/:id",beamApi.deleteBeamController);
app.patch("/beam/:id",beamApi.updateBeamController);

app.post("/column",columnApi.pushColumnController);
app.get("/column",columnApi.getColumnController);
app.delete("/column/:id",columnApi.deleteColumnController);
app.patch("/column/:id",columnApi.updateColumnController);

app.post("/wall",wallApi.pushWallController);
app.get("/wall",wallApi.getWallController);
app.delete("/wall/:id",wallApi.deleteWallController);
app.patch("/resultwall",wallApi.updateWallResultController);
app.get("/resultwall",wallApi.getWallResultController);

app.post("/footing",footingApi.pushFootingController);
app.get("/footing",footingApi.getFootingController);
app.delete("/footing/:id",footingApi.deleteFootingController);
app.patch("/footing/:id",footingApi.updateFootingController);
 
app.post("/stair",stairApi.pushStairController);
app.get("/stair",stairApi.getStairController);
app.delete("/stair/:id",stairApi.deleteStairController);
app.patch("/stair/:id",stairApi.updateStairController);
 
app.patch("/result",resultApi.pushSlabResultController);
app.get("/result",resultApi.getSlabResultController);
app.patch("/resultbeam",resultApi.pushBeamResultController);
app.get("/resultbeam",resultApi.getBeamResultController);
app.patch("/resultcolumn",resultApi.pushColumnResultController);
app.get("/resultcolumn",resultApi.getColumnResultController);
app.patch("/resultfooting",resultApi.pushFootingResultController);
app.get("/resultfooting",resultApi.getFootingResultController);
app.patch("/resultstair",resultApi.pushStairResultController);
app.get("/resultstair",resultApi.getStairResultController);

app.patch("/finalresult",finalApi.pushfinalResultController);
app.get("/finalresult",finalApi.getfinalResultController);
// app.post("/register",(req,res)=>{
//     res.send(req.body);  
    // const user = new clientregister(req.body);
    // user.save().then(() => {
    //     res.send(user);
    // }).catch((e) => {
    //     res.send("error");
    // })
// })
// app.post("/slab",(req,res)=>{
//     console.log(req.body);
//     const user = new slab(req.body);
//     user.save().then(() => {
//         res.send(user);
//     }).catch((e) => {
//         res.send("error");
//     })
//     res.send("hello data is pushed");
// })

app.listen(port, () => {
    console.log(`connection is setup at ${port}`);
})