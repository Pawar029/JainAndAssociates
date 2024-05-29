
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import pic from '../Images/j&a.png';
import pic1 from '../Images/profile2.png'
import Axios from 'axios';
// import { useNavigate } from "react-router-dom";

export default function Navbar() {
  // State to track user login status
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginData,setloginData] = useState("");
  // State to store user data
  // const [userData, setUserData] = useState(null);
  // const navigate = useNavigate();


  // Function to check if user is logged in
  // const checkLoginStatus = async () => {
  //   try {
  //     const number = window.localStorage.getItem('number');
  //     const response = await Axios.get(`http://localhost:8000/profile?number=${number}`);
  //     console.log(response);
  //     if (response.data.loggedIn) {
  //       setLoggedIn(true);
  //       setUserData(response.data.user);
  //       console.log(userData);
  //       navigate("/");    
  //       // window.location.reload();
  //     }
  //   } catch (error) {
  //     console.error("Error checking login status:", error);
  //   }
  //   // console.log("user   ",userData.name);
  // };

  useEffect(() => {
    Axios.get("http://localhost:8000/profile/")
      .then((res) =>{
        if(res.data.length!==0){
          setLoggedIn(true);
          setloginData(res.data);
        }
        else{
          setLoggedIn(false);
          setloginData("");
        }

        // console.log(res);
      }
        // console.log(res.data["Member List"])
        // setLoggedIn(res.data.success),
        
      );

  }, [loggedIn,loginData]); // Empty dependency array ensures useEffect runs only once after initial render


  // console.log("login in ",loggedIn);
  // console.log("login Data ",loginData);
  const handleLogout = async (e, id) => {
    e.preventDefault();
    console.log(`Deleting data with id ${id}`);
    await Axios.delete(`http://localhost:8000/logout/${id}`)
      .then(response => {
        if (response.status === 200) {
          alert(`User Logout Successfully `);
        }
        else if (response.status === 400) {
          console.log(`Data with id ${id} not Found`);
        }
        else {
          console.error(`Failed to delete data with id ${id}`);
        }
      }).catch(error => {
        console.error('Error:', error);
      });

    window.location.href = '/';
  }


  return (
    <div className='sticky-top bg-primary-subtle'>
      <nav className="navbar navigation-wrap navbar-expand-lg ">
        <div className="container-fluid ">
          <Link className="navbar-brand mb-30" to="/">
            <img className='ms-5 ' decoding="async" src={pic} alt="logo" width="120" height="70" />
            <h3>JAIN AND ASSOCIATES</h3>
          </Link>
          <button className="navbar-toggler bg-info-subtle" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto  mb-lg-0 ms-5     ">
              <li className="nav-item m-2  ">
                <Link className="nav-link active fs-5 " data-bs-toggle="tooltip" aria-current="page" to="/slab"> SLAB</Link>
              </li>
              <li className="nav-item m-2 ">
                <Link className="nav-link active fs-5" aria-current="page" to="/beam">BEAM</Link>
              </li>
              <li className="nav-item m-2">
                <Link className="nav-link active fs-5" aria-current="page" to="/column">COLUMN</Link>
              </li>
              <li className="nav-item m-2">
                <Link className="nav-link active fs-5" aria-current="page" to="/wall">WALL</Link>
              </li>
              <li className="nav-item m-2">
                <Link className="nav-link active fs-5" aria-current="page" to="/footing">FOOTING</Link>
              </li>
              <li className="nav-item m-2">
                <Link className="nav-link active fs-5" aria-current="page" to="/stair">STAIRCASE</Link>
              </li>
            </ul>
            <div>
              <Link className='text-blue btn btn-outline-primary m-3 me-5' to="/clientlist">List of all Clients</Link>
            </div>
            <div className='d-flex m-3'>
            {
              loggedIn ? (
                <div className='d-flex'>
                  
                  <span className="ms-3 ">
                    <Link className="navbar-brand mt-4" to="/profile">
                      <img className=' ' decoding="async" src={pic1} alt="logo" width="120" height="70" />
                      <h3 className='ms-3'>{loginData.name}</h3>
                    </Link>
                    {/* <Link className='navbar-brand' to='/profile' style={{ textDecoration: 'none', color: 'black', fontSize: '20px' }}>
                      <img className='ms-3 ' decoding="async" src={pic1} alt="logo" width="110" height="60" />
                      <b className=''>{loggedIn.name}</b>
                    </Link> */}

                  </span>
                  <div className=' m-2 mt-4'>
                  <Link className=" fs-4 text-blue btn btn-outline-primary"  onClick={(e) => handleLogout(e, loginData._id)}>Logout</Link>
                  </div>
                </div>) : (
                <div className="d-flex ">
                  <Link className='m-2 fs-5 btn btn-outline-dark' to="/login">Login</Link>
                  {/* <p className='m-2 fs-5'> / </p> */}
                  <Link className='m-2 fs-5 btn btn-outline-dark' to="/register">New User</Link>
                </div>
              )
            }
          </div>
          </div>
        </div>
      </nav>
    </div>
  )
}