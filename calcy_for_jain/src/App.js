// import logo from './logo.svg';
// import './App.css';
// import CalBricks from './components/CalBricks/CalBricks';
import * as React from "react";
// import { BrowserRouter } from "react-router-dom";
import {BrowserRouter, Route, Routes } from 'react-router-dom';
import ClientList from "./components/ClientList";
import Footer from './components/Footer';
import Login from "./components/Login/Login";
import MaterialInBeam from "./components/MaterialInBeam";
import MaterialInColumn from "./components/MaterialInColumn";
import MaterialInFooting from "./components/MaterialInFooting";
import MaterialInSlab from './components/MaterialInSlab';
import MaterialInStaircase from "./components/MaterialInStaircase";
import MaterialInWall from "./components/MaterialInWall";
import Navbar from './components/Navbar/Navbar';
import Profile from "./components/Profile/Profile";
import Register from "./components/Register/Register";
import SlidingImages from './components/SlidingImages';

// import { createRoot } from "react-dom/client";

function App() {
  return (
    <div className="bg-primary-subtle">
      <BrowserRouter  >
      <Navbar/>
        
        <Routes>
         
          {/* <Route path="/"  element={ }/> */}
          <Route path="/"  element={<SlidingImages/> }/>
          <Route path="/slab" element={<MaterialInSlab/> }/>
          <Route path="/wall" element={<MaterialInWall/> }/>
          <Route path="/beam" element={<MaterialInBeam/> }/>
          <Route path="/column" element={<MaterialInColumn/> }/>
          <Route path="/footing" element={<MaterialInFooting/> }/>
          <Route path="/stair" element={<MaterialInStaircase/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/clientlist" element={<ClientList/>}/>
          <Route path="/ok" element={<Footer />}/>
          
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
