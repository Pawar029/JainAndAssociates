import React, { useState,useEffect } from 'react';
import Axios from 'axios';


export default function MaterialInFooting() {

  const [material, setMaterial] = useState({
    name:"",
    noOfSameFooting:"",
    length: "",
    breadth: "",
    thickness: "",
    long_dia: "",
    short_dia: "",
    spac_long: "",
    spac_short: "",
    con_cov: ""
     
  })


  const name = material.name;
  const noOfSameFooting = parseFloat(material.noOfSameFooting);
  const length = parseFloat(material.length);
  const breadth = parseFloat(material.breadth);
  const thickness = parseFloat(material.thickness);
  const long_dia = parseFloat(material.long_dia);
  const short_dia = parseFloat(material.short_dia);
  const spac_long = parseFloat(material.spac_long);
  const spac_short = parseFloat(material.spac_short);
  const con_cov = parseFloat(material.con_cov);
  



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

    Axios.get("https://jain-and-associates-backend.vercel.app/profile")
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

    Axios.get("https://jain-and-associates-backend.vercel.app/footing/")
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


    const wet_vol = length * breadth * thickness;
    // console.log(wet_vol);
    const dry_vol = wet_vol * 1.54;
    const total_ratio = 1 + 1.5 + 3;  //ratio 1 : 1.5 : 3
    const vol_cement = (1 / total_ratio) * dry_vol;
    setNo_of_cement_bags(Math.ceil((vol_cement*noOfSameFooting) / 0.03539));  // volumne of each cement bag in cubic feet is 1.25

    const vol_sand = (1.5 / total_ratio) * dry_vol;
    setVol_of_sand((vol_sand*noOfSameFooting));


    const vol_Aggregate = (3 / total_ratio) * dry_vol;
    setVol_of_Aggregate((vol_Aggregate*noOfSameFooting));


    // Calculation of Steel
    const no_long_bar = ((breadth - (2 * con_cov))/spac_long) +1;
    const no_short_bar = ((length - (2 * con_cov))/spac_short) +1;
    const len_long_bar = (length - (2 * con_cov)) + (2 * (12*long_dia))/1000;       //Hock length is 12*long_dia = 12D
    const total_len_long_bar = len_long_bar * no_long_bar;
    const len_short_bar = (breadth - (2 * con_cov)) + (2 * (12*short_dia))/1000 ;       //Hock length is 12*short_dia = 12D
    const total_len_short_bar = len_short_bar * no_short_bar;
    const wei_long_bar = (long_dia * long_dia * total_len_long_bar) / 162 ;
    const wei_short_bar = (short_dia * short_dia * total_len_short_bar) / 162 ;

    setLongBarWeight(parseFloat((wei_long_bar*noOfSameFooting).toFixed(3), 10));
    setShortBarWeight(parseFloat((wei_short_bar*noOfSameFooting).toFixed(3), 10));



    


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
      const logindata = await Axios.get("https://jain-and-associates-backend.vercel.app/profile");
      await Axios.post("https://jain-and-associates-backend.vercel.app/footing/", {
        clientName:logindata.data.name,
        clientNumber:logindata.data.number,
        name,
        noOfSameFooting,
        No_of_cement_bags,
        Vol_of_sand,
        Vol_of_Aggregate,
        long_dia,
        longBarWeight,
        short_dia,
        shortBarWeight,

      });
      const res = await Axios.get("https://jain-and-associates-backend.vercel.app/column/");
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

  const [footingSteel, setFootingSteel] = useState({});
  const [total, setTotal] = useState([]);
  const Total = async (e) => {
    e.preventDefault();


    try {

      await Axios.patch("https://jain-and-associates-backend.vercel.app/resultfooting/");

      const response = await Axios.get("https://jain-and-associates-backend.vercel.app/resultfooting/");
      setTotal(response.data);
      const { footingSteel } = response.data;
      if(footingSteel){
        setFootingSteel(footingSteel);
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
    await Axios.delete(`https://jain-and-associates-backend.vercel.app/footing/${id}`)
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

    await Axios.get("https://jain-and-associates-backend.vercel.app/footing/");
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
    <div align="center" className='p-4'>

      <div   >
        <figure className="figure" >
          {/* <img src={pic} className="bg-opacity-25 figure-img img-fluid rounded" alt="..." /> */}
          <figcaption className="figure-caption" >
            <div className='  p-2 my-4 text-primary-emphasis bg-light border border-primary rounded-3' >
              <h2 className='p-2' align='center'>Material Needed for Footing</h2>
              <form className='align-center'  >
                <div className="row mb-3">
                  <div className='col-sm-2'></div>
                  <label htmlFor="inputEmail3" className="col-sm-3 fs-5 col-form-label">Footing Name:</label>
                  <div className="col-sm-5">
                    <input type="text" className="form-control" id="name" placeholder="Enter F1,F2,....." value={material.name} onChange={(e) => change(e)} required />
                  </div>
                </div>
                <div className="row mb-3">
                <div className='col-sm-0'></div>
                <label htmlFor="inputEmail3" className="col-sm-5 fs-5 col-form-label">Number of <b>{material.name}</b> Footing :</label>
                <div className="col-sm-5">
                  <input type="number" className="form-control" id="noOfSameFooting" placeholder="Enter No. of Same Column" value={material.noOfSameFooting} onChange={(e) => change(e)} required />
                </div>
              </div>
                <div className="row mb-3">
                  <div className='col-sm-2'></div>
                  <label htmlFor="inputEmail3" className="col-sm-3 fs-5 col-form-label">Length:</label>
                  <div className="col-sm-5">
                    <input type="number" className="form-control" id="length" placeholder="Enter in Meter" value={material.length} onChange={(e) => change(e)} required />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className='col-sm-2'></div>
                  <label htmlFor="inputEmail3" className="col-sm-3 fs-5 col-form-label">Breadth:</label>
                  <div className="col-sm-5">
                    <input type="number" className="form-control" id="breadth" placeholder="Enter in Meter" value={material.breadth} onChange={(e) => change(e)} required />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className='col-sm-2'></div>
                  <label htmlFor="inputEmail3" className="col-sm-3 fs-5 col-form-label">Thickness:</label>
                  <div className="col-sm-5">
                    <input type="number" className="form-control" id="thickness" placeholder="Enter in Meter" value={material.thickness} onChange={(e) => change(e)} required />
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
                  <label htmlFor="inputEmail3" className="col-sm-5 fs-5 col-form-label">Concrete Cover :</label>
                  <div className="col-sm-5">
                    <input type="number" className="form-control" id="con_cov" placeholder="Enter in Meter" value={material.con_cov} onChange={(e) => change(e)} required />
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
        <h1 className="text-center mb-4">List of Material Estimated for Footing</h1>
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
                <td >{myData.noOfSameFooting}</td>
                <td >{myData.No_of_cement_bags}</td>
                <td >{myData.Vol_of_sand}</td>
                <td >{myData.Vol_of_Aggregate}</td>
                <th><button className='btn btn-outline-primary fw-bolder border-2' onClick={(e) => handleDelete(e, myData._id)}>Delete</button></th>
              </tr>

            ))}
            <tr>
              <th><button className='btn btn-outline-primary fw-bolder p-2 border-2 ' onClick={Total} >Click here to Get Total</button></th>
              <td> </td>
              <th key={total.footingCement}>{total.footingCement}</th>
              <th key={total.footingSand}>{total.footingSand}</th>
              <th key={total.footingAggregate}>{total.footingAggregate}</th>
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

                {Object.entries(footingSteel).map(([dia, weight]) => (
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