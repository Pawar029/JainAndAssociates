import React, { useState,useEffect } from 'react'
import Axios from 'axios';

export default function MaterialInStaircase() {

  const [material, setMaterial] = useState({
    name: "",
    noOfSameStair: "",
    height: "",
    thick_stair: "",
    len_stair: "",
    hei_stair: "",
    wid_stair: "",
    long_dia: "",
    short_dia: "",
    spac_long: "",
    spac_short: "",
    slab_len: ""
     
  })

  const name = material.name;
  const noOfSameStair = parseFloat(material.noOfSameStair);
  const height = parseFloat(material.height);
  const thick_stair = parseFloat(material.thick_stair);
  const len_stair = parseFloat(material.len_stair);
  const hei_stair = parseFloat(material.hei_stair);
  const wid_stair = parseFloat(material.wid_stair);
  const long_dia = parseFloat(material.long_dia);
  const short_dia = parseFloat(material.short_dia);
  const spac_long = parseFloat(material.spac_long);
  const spac_short = parseFloat(material.spac_short);
  const slab_len = parseFloat(material.slab_len);
  



  const [No_of_cement_bags, setNo_of_cement_bags] = useState("");
  const [Vol_of_sand, setVol_of_sand] = useState("");
  const [Vol_of_Aggregate, setVol_of_Aggregate] = useState("");
  const [longBarWeight, setLongBarWeight] = useState("");
  const [shortBarWeight, setShortBarWeight] = useState("");

  const [showresult, setShowresult] = useState(false);

  const [myData, setMyData] = useState([]);
  const [login, setlogin] = useState(false);
  const [loginData, setloginData] = useState("");
  useEffect(() => {

    Axios.get("http://localhost:8000/profile")
      .then((logindata) => {
        if (logindata.data.length !== 0) {
          setlogin(true);
          setloginData(logindata.data);
        }
        else {
          setlogin(false);
          setloginData("");
        }
      })

    Axios.get("http://localhost:8000/stair/")
      .then((res) =>{
        if (login) {
          setMyData(res.data);
        }
        else {
          setMyData([]);
        }
      }
      );

  }, [myData,login]);

  const submit = (e) => {

    e.preventDefault();

    const no_of_steps = height / hei_stair ;
    const base_len = no_of_steps * len_stair ;
    const slant_len = Math.sqrt(height*height + base_len*base_len) ;
    const vol_slant = slant_len * wid_stair * thick_stair ;
    const vol_steps = 0.5 * len_stair * hei_stair * wid_stair * no_of_steps ;
    const tot_wet_vol = vol_slant + vol_steps ; 
    const dry_vol = tot_wet_vol * 1.54;
    const total_ratio = 1 + 1.5 + 3;  //ratio 1 : 1.5 : 3
    const vol_cement = (1 / total_ratio) * dry_vol;
    setNo_of_cement_bags(Math.ceil((vol_cement*noOfSameStair) / 0.03539));  // volumne of each cement bag in cubic feet is 1.25

    const vol_sand = (1.5 / total_ratio) * dry_vol;
    setVol_of_sand((vol_sand*noOfSameStair).toFixed(3), 10);


    const vol_Aggregate = (3 / total_ratio) * dry_vol;
    setVol_of_Aggregate((vol_Aggregate*noOfSameStair).toFixed(3), 10);


    // Calculation of Steel
   const no_of_long_bar = wid_stair / spac_long;
   const len_long_bar = (slant_len + 2 * slab_len) * no_of_long_bar ;
   const wei_long_bar = (len_long_bar * long_dia * long_dia) / 162 ;

   const no_of_short_bar = (slab_len + 2 * slab_len) / spac_short ;
   const len_short_bar = wid_stair * no_of_short_bar ;
   const wei_short_bar = (len_short_bar * short_dia * short_dia) / 162 ;


    setLongBarWeight(parseFloat((wei_long_bar*noOfSameStair).toFixed(3), 10));
    setShortBarWeight(parseFloat((wei_short_bar*noOfSameStair).toFixed(3), 10));



    


    setShowresult(true)


  }

  const change = e => {
    const newdata = { ...material }
    newdata[e.target.id] = e.target.value
    setMaterial(newdata)
  }

  const addTask = async (e) => {
    e.preventDefault();
    console.log("addtask invoked")

    try {
      const logindata = await Axios.get("http://localhost:8000/profile");
      await Axios.post("http://localhost:8000/stair/", {
        clientName:logindata.data.name,
        clientNumber:logindata.data.number,
        name,
        noOfSameStair,
        No_of_cement_bags,
        Vol_of_sand,
        Vol_of_Aggregate,
        long_dia,
        longBarWeight,
        short_dia,
        shortBarWeight,

      });
      const res = await Axios.get("http://localhost:8000/stair/");
      setMyData(res.data);
      console.log("res", res.data);
    }
    catch (e) {
      // console.log("here is error");
      console.log(e);
    }


    // Call the Total function
    await Total(e);
  };

  const [stairSteel, setStairSteel] = useState({});
  const [total, setTotal] = useState([]);
  const Total = async (e) => {
    e.preventDefault();


    try {

      await Axios.patch("http://localhost:8000/resultstair/");

      const response = await Axios.get("http://localhost:8000/resultstair/");
      setTotal(response.data);
      const { stairSteel } = response.data;
      if(stairSteel){
        setStairSteel(stairSteel);
      }
      
      console.log("response data", response.data);
    }
    catch (e) {
      // console.log("here is error");
      console.log(e);
    }

  };

  const handleDelete = async (e, id) => {
    // Perform delete operation using the id
    console.log(`Deleting data with id ${id}`);
    await Axios.delete(`http://localhost:8000/stair/${id}`)
      .then(response => {
        if (response.status === 200) {
          alert(`Data with id ${id} deleted successfully`);
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

    await Axios.get("http://localhost:8000/stair/");
    // Call the Total function
    await Total(e);
  };

  const Print = async (e) => {
    e.preventDefault();
    console.log('print');
    let printContents = document.getElementById('printablediv').innerHTML;

    let originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    window.close();
    document.body.innerHTML = originalContents;
    // Reload the current page
    window.location.reload();
    await Total(e);
  }   

  return (
    <div className='p-4' align="center"  >

      <div >
        <figure className="figure" >
          {/* <img src={pic} className="bg-opacity-25 figure-img img-fluid rounded" alt="..." /> */}
          <figcaption className="figure-caption" >
            <div className='  p-2 my-4 text-primary-emphasis bg-light border border-primary rounded-3' >
              <h2 className='p-2' align='center'>Material Needed for StairCase</h2>
              <form className='align-center'  >
                <div className="row mb-3">
                  <div className='col-sm-2'></div>
                  <label htmlFor="inputEmail3" className="col-sm-3 fs-5 col-form-label">Stair Name:</label>
                  <div className="col-sm-5">
                    <input type="text" className="form-control" id="name" placeholder="Enter St1,St2,....." value={material.name} onChange={(e) => change(e)} required />
                  </div>
                </div>
                <div className="row mb-3">
                <div className='col-sm-0'></div>
                <label htmlFor="inputEmail3" className="col-sm-5 fs-5 col-form-label">Number of <b>{material.name}</b> Stair :</label>
                <div className="col-sm-5">
                  <input type="number" className="form-control" id="noOfSameStair" placeholder="Enter No. of Same Column" value={material.noOfSameStair} onChange={(e) => change(e)} required />
                </div>
              </div>
                <div className="row mb-3">
                  <div className='col-sm-0'></div>
                  <label htmlFor="inputEmail3" className="col-sm-5 fs-5 col-form-label">Height:</label>
                  <div className="col-sm-5">
                    <input type="number" className="form-control" id="height" placeholder="Enter in Meter" value={material.height} onChange={(e) => change(e)} required />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className='col-sm-0'></div>
                  <label htmlFor="inputEmail3" className="col-sm-5 fs-5 col-form-label">Thickness of Stair:</label>
                  <div className="col-sm-5">
                    <input type="number" className="form-control" id="thick_stair" placeholder="Enter in Meter" value={material.thick_stair} onChange={(e) => change(e)} required />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className='col-sm-0'></div>
                  <label htmlFor="inputEmail3" className="col-sm-5 fs-5 col-form-label">Length of Stair :</label>
                  <div className="col-sm-5">
                    <input type="number" className="form-control" id="len_stair" placeholder="Enter in Meter" value={material.len_stair} onChange={(e) => change(e)} required />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className='col-sm-0'></div>
                  <label htmlFor="inputEmail3" className="col-sm-5 fs-5 col-form-label">Height of Stair :</label>
                  <div className="col-sm-5">
                    <input type="number" className="form-control" id="hei_stair" placeholder="Enter in Meter" value={material.hei_stair} onChange={(e) => change(e)} required />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className='col-sm-0'></div>
                  <label htmlFor="inputEmail3" className="col-sm-5 fs-5 col-form-label">Width of Stair:</label>
                  <div className="col-sm-5">
                    <input type="number" className="form-control" id="wid_stair" placeholder="Enter in Meter" value={material.wid_stair} onChange={(e) => change(e)} required />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className='col-sm-0'></div>
                  <label htmlFor="inputEmail3" className="col-sm-5 fs-5 col-form-label">Diameter of Long Bar :</label>
                  <div className="col-sm-5">
                    <input type="number" className="form-control" id="long_dia" placeholder="Enter in MM" value={material.long_dia} onChange={(e) => change(e)} required />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className='col-sm-0'></div>
                  <label htmlFor="inputEmail3" className="col-sm-5 fs-5 col-form-label">Diameter of Short Bar :</label>
                  <div className="col-sm-5">
                    <input type="number" className="form-control" id="short_dia" placeholder="Enter in MM" value={material.short_dia} onChange={(e) => change(e)} required />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className='col-sm-0'></div>
                  <label htmlFor="inputEmail3" className="col-sm-5 fs-5 col-form-label">Spacing Between long bars :</label>
                  <div className="col-sm-5">
                    <input type="number" className="form-control" id="spac_long" placeholder="Enter in Meter" value={material.spac_long} onChange={(e) => change(e)} required />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className='col-sm-0'></div>
                  <label htmlFor="inputEmail3" className="col-sm-5 fs-5 col-form-label">Spacing Between short bars :</label>
                  <div className="col-sm-5">
                    <input type="number" className="form-control" id="spac_short" placeholder="Enter in Meter" value={material.spac_short} onChange={(e) => change(e)} required />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className='col-sm-0'></div>
                  <label htmlFor="inputEmail3" className="col-sm-5 fs-5 col-form-label">Slab Length :</label>
                  <div className="col-sm-5">
                    <input type="number" className="form-control" id="slab_len" placeholder="Enter in Meter" value={material.slab_len} onChange={(e) => change(e)} required />
                  </div>
                </div>
               
                <div align='center' className="align-content-center">
                  <button type="submit" className="btn btn-outline-primary fw-bolder p-2 border-2    fs-5" onClick={submit}>Calculate Material Needed</button>
                  {showresult && (
                    <div id="textField" className='fs-4' >
                      <p>Number of Cement Bags Needed are : {No_of_cement_bags}</p>
                      <p>Sand Needed is : {Vol_of_sand} Cubic feet ({Vol_of_sand / 100} brass)</p>
                      <p>Aggregate Needed is : {Vol_of_Aggregate} Cubic feet ({Vol_of_Aggregate / 100} brass)</p>
                      <p>Weight of Long Bars Needed is : {longBarWeight}  kg</p>
                      <p>Weight of Short Bars Needed is : {shortBarWeight}  kg</p>

                    </div>
                  )}
                </div>




              </form>
            </div>
          </figcaption>
        </figure>

      </div>
      <div className="m-3" id='printablediv'>
        <h1 className="text-center mb-4">List of Material Estimated for Staircase</h1>
        <div id="create-task" className="mb-3">
          <div className="input-group">

            <button className="btn btn-outline-primary fw-bolder p-2 border-2" onClick={addTask}>
              Add
            </button>
          </div>
          <div className='text-start mt-4'>
            <p>Client Name: {loginData.name}</p>
            <p>Phone No.: {loginData.number}</p>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Name of Column</th>
              <th>No of Same Column</th>
              <th>No. of Cement bags</th>
              <th>Sand</th>
              <th>Aggregate</th>
              <th>Actions</th>


            </tr>
          </thead>
          <tbody>
            {myData.map((myData) => (
              <tr  >
                <td >{myData.name}</td>
                <td >{myData.noOfSameStair}</td>
                <td >{myData.No_of_cement_bags}</td>
                <td >{myData.Vol_of_sand}</td>
                <td >{myData.Vol_of_Aggregate}</td>
                <th><button className='btn btn-outline-primary fw-bolder border-2' onClick={(e) => handleDelete(e, myData._id)}>Delete</button></th>
              </tr>

            ))}
            <tr>
              <th><button className='btn btn-outline-primary fw-bolder p-2 border-2 ' onClick={Total} >Click here to Get Total</button></th>
              <td> </td>
              <th key={total.stairCement}>{total.stairCement}</th>
              <th key={total.stairSand}>{total.stairSand}</th>
              <th key={total.stairAggregate}>{total.stairAggregate}</th>
              <th></th>
            </tr>
          </tbody>

        </table>

        <div>
          <h3 className='mt-3'>Overall Steel Needed:</h3>
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
              <tbody>

                {Object.entries(stairSteel).map(([dia, weight]) => (
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
        </div>
        <button className='btn btn-outline-primary fw-bolder p-2 border-2 ' onClick={Print} >Print Page</button>
      </div>
    </div>
  )
}