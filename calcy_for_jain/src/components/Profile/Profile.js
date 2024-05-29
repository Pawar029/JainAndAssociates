import React, { useState, useEffect } from 'react';
import './Profile.css';
import Axios from "axios";

const Profile = () => {
  const [userData, setUserData] = useState(null);

  const [rate,setRate] = useState({
    rateCement:0,
    rateSand:0,
    rateAggregate:0
  })
  useEffect(() => {
    fetchData();
  }, []);

  const change = e => {
    const newdata = { ...rate }
    newdata[e.target.id] = e.target.value
    setRate(newdata)
    // setlength(event.target.length)
  }

  const fetchData = async () => {
    try {
      // const userNumber = window.localStorage.getItem('number');
      const logindata = await Axios.get("http://localhost:8000/profile");
      const userNumber = logindata.data.number;
      const response = await Axios.get(`http://localhost:8000/oneregister?number=${userNumber}`);
      // console.log(response.data);
      // const { name, location, number, email } = response.data;
      // console.log("name ",response.data.user.name);
      setUserData(response.data.user);
    } catch (error) {
      console.error(error);
    }
  };
  // console.log("userData",userData);

  const [myData,setMyData] = useState({});
  const [Steel, setSteel] = useState({});
  const [flag,setFlag] = useState(false);
  const Total_Results = async (e) => {
    e.preventDefault();
    try {
      
      await Axios.patch("http://localhost:8000/result/");
      await Axios.patch("http://localhost:8000/resultbeam/");
      await Axios.patch("http://localhost:8000/resultcolumn/");
      await Axios.patch("http://localhost:8000/resultfooting/");
      await Axios.patch("http://localhost:8000/resultstair/");

      await Axios.patch("http://localhost:8000/finalresult/");

      const response = await Axios.get("http://localhost:8000/finalresult/");
      setMyData(response.data);
      const { Steel } = response.data;
      if(Steel){
        setSteel(Steel);
        setFlag(true);
      }
      // console.log("response data", response.data);
    }
    catch (e) {
      // console.log("here is error");
      console.log(e);
    }
  }

  const Print = () => {
    // console.log('print');
    const printContents = document.getElementById('printablediv').innerHTML;

    let originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    // Reload the current page
    window.location.reload();
  }

  return (
    <div id='printablediv'>
      <div className="container">
        <div className="user-info text-center">
          <h2>Client Information</h2>
          {userData && (
            <div>
              <div className="info-item">
                <strong>Name:</strong>
                <span>{userData.name}</span>
              </div>
              <div className="info-item">
                <strong>Location:</strong>
                <span>{userData.location}</span>
              </div>
              <div className="info-item">
                <strong>Mobile Number:</strong>
                <span>{userData.number}</span>
              </div>
              <div className="info-item">
                <strong>Email:</strong>
                <span>{userData.email}</span>
              </div>
            </div>
          )}
          <button className="btn btn-outline-primary fw-bolder p-2 border-2" onClick={Total_Results}>Click Here</button> to get Detailled Analysis of all Data by Entering Rates with respect to Material type
        </div>
        </div>
        {
          flag && (
            <div className='m-3'>
              <h1 className="text-center mb-4">Overall Material Estimated</h1>
          <table className="table" >
            <thead>
              <tr>
                <th>Material Type</th>
                <th>Overall Quantity</th>
                <th>Rate of Quantity</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody  >
              {/* {myData.map((myData) => ( */}
                <tr  >
                  <th >No. of Cement Bags</th>
                  <td >{myData.Cement}</td>
                  <td ><input className='form-control' id="rateCement" placeholder="Enter Rate of one Cement Bag" value={rate.rateCement} onChange={(e) => change(e)} required/></td>
                  <td >{myData.Cement * rate.rateCement}</td>
                </tr>
                <tr  >
                  <th >Sand Required</th>
                  <td >{parseFloat((myData.Sand * 0.353).toFixed(3), 10)} Brass</td>
                  <td ><input className='form-control' id="rateSand" placeholder="Enter Rate of Sand per brass" value={rate.rateSand} onChange={(e) => change(e)} required/></td>
                  <td >{myData.Sand * 0.353 * rate.rateSand}</td>
                </tr>
                <tr  >
                  <th >Aggregate Required</th>
                  <td >{parseFloat((myData.Aggregate * 0.353).toFixed(3), 10)} Brass</td>
                  <td ><input className='form-control' id="rateAggregate" placeholder="Enter Rate of Aggregate per brass" value={rate.rateAggregate} onChange={(e) => change(e)} required/></td>
                  <td >{myData.Aggregate * 0.353 * rate.rateAggregate}</td>
                </tr>

              {/* ))} */}

              {/* <tr>
                <th><button className='btn btn-outline-primary fw-bolder p-2 border-2 ' onClick={Total} >Click here to Get Total</button></th>
                <td> </td>
                <td> </td>
                <th key={total.slabCement}>{total.slabCement}</th>
                <th key={total.slabSand}>{total.slabSand}</th>
                <th key={total.slabAggregate}>{total.slabAggregate}</th>
                <th></th>
              </tr> */}

            </tbody>

          </table>

          <h3 className='mt-3 text-center'>Overall Steel Needed:</h3>
        <div>
          <table className="table">
            <thead>
              <tr>
                <th>Diameter</th>
                <th>Total</th>
                <th>Wastage of 10%</th>
                <th>Overall Total</th>
                <th>Order Place</th>
              </tr>
            </thead>
            <tbody >
              {Object.entries(Steel).map(([dia, weight]) => (
                < tr>
                  <td >{dia} MM</td>
                  <td >{parseFloat((weight).toFixed(3), 10)} KG</td>
                  <td >{parseFloat((0.1 * weight).toFixed(3), 10)} KG</td>
                  <td >{parseFloat(((0.1 * weight) + weight).toFixed(3), 10)} KG</td>
                  <td >{parseFloat((((0.1 * weight) + weight + 200) / 1000).toFixed(3), 10)} Tone</td>

                </tr>
              ))}




            </tbody>
          </table>
        </div>
        <button className='btn btn-outline-primary fw-bolder p-2 border-2 text-center' onClick={Print} >Print Page</button>
        </div>
          )}
    </div>
  );
};

export default Profile;