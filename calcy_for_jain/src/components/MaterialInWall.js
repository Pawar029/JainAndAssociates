import React, { useState, useEffect } from 'react';
import Axios from 'axios';


export default function MaterialInWall() {

  const [material, setMaterial] = useState({
    name: "",
    noOfSameWall: "",
    length: "",
    breadth: "",
    height: ""
  })

  const name = material.name;
  const noOfSameWall = parseFloat(material.noOfSameWall);
  const length = parseFloat(material.length);
  const breadth = parseFloat(material.breadth);
  const height = parseFloat(material.height);

  const [numberOfBricks, setNumberOfBricks] = useState(null);
  const [No_of_cement_bags, setNo_of_cement_bags] = useState("");
  const [Vol_of_sand, setVol_of_sand] = useState("");

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

    Axios.get("https://jain-and-associates-backend.vercel.app/wall/")
      .then((res) => {
        if (login) {
          setMyData(res.data);
        }
        else {
          setMyData([]);
        }
      }
        // console.log(res.data["Member List"])
      )

    

    // const logindata = Axios.get("https://jain-and-associates-backend.vercel.app/profile");
    // setloginName(logindata.data.name);
    // setloginNumber(logindata.data.number);
    // console.log("here is login data ",loginName);

  }, [myData, login]);


  // console.log("login data in wall ",login);
  // console.log("login data in wall ",loginName);
  // console.log("login data in wall ",loginNumber);

  const calculateBricks = (e) => {
    e.preventDefault();
    const volume = length * breadth * height;
    // Assuming standard brick dimensions
    const brickVolume = 0.2 * 0.1 * 0.1; // Length * Breadth * Height of a brick
    const bricksNeeded = Math.ceil(volume / brickVolume);
    setNumberOfBricks(noOfSameWall * bricksNeeded);
    console.log(numberOfBricks);
    const wet_volume = (volume * 35.3147) - (bricksNeeded * 0.05434);
    const total_ratio = 1 + 3;   //ratio for motar
    const dry_volume = wet_volume * 1.54;   //conversion from wet vol to dry vol constant is 1.54
    const volumeOfCement = (1 / total_ratio) * dry_volume;

    const volumeOfSand = (3 / total_ratio) * dry_volume;

    //for plastering

    const wet_vol = length * breadth * 0.0127;
    const dry_vol = (wet_vol * 35.3147) * 1.33;
    const tot_ratio = 1 + 5; // ratio of plaster
    const cement_req = (1 / tot_ratio) * dry_vol;
    const fullCement = volumeOfCement + cement_req;
    const noOfbags = Math.ceil(fullCement / 0.03539);
    setNo_of_cement_bags(noOfSameWall * noOfbags);
    const sand_req = (5 / tot_ratio) * dry_vol;
    const fullSand = volumeOfSand + sand_req;
    setVol_of_sand(parseFloat((noOfSameWall * fullSand).toFixed(3), 10));
    // setquaOfSandInMo(fullSand);

    setShowresult(true)

  };

  const change = (e) => {
    const newdata = { ...material };
    newdata[e.target.id] = e.target.value;
    setMaterial(newdata);
  }

  const addTask = async (e) => {
    e.preventDefault();
    console.log("addtask invoked")

    try {
      const logindata = await Axios.get("https://jain-and-associates-backend.vercel.app/profile");
      // setloginName(logindata.data.name);
      // setloginNumber(logindata.data.number);
      await Axios.post("https://jain-and-associates-backend.vercel.app/wall/", {
        clientName: logindata.data.name,
        clientNumber: logindata.data.number,
        name,
        noOfSameWall,
        numberOfBricks,
        No_of_cement_bags,
        Vol_of_sand,
      });
      const res = await Axios.get("https://jain-and-associates-backend.vercel.app/wall/");
      setMyData(res.data);
      console.log("res", res.data);
    }
    catch (e) {
      // console.log("here is error");
      console.log(e);
    }

    // Call the Total function
    await Total(e);
  }

  const [total, setTotal] = useState([]);
  const Total = async (e) => {
    e.preventDefault();


    try {

      await Axios.patch("https://jain-and-associates-backend.vercel.app/resultwall/");

      const response = await Axios.get("https://jain-and-associates-backend.vercel.app/resultwall/");
      setTotal(response.data);
      // const { columnSteel } = response.data;
      // setColumnSteel(columnSteel);
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
    await Axios.delete(`https://jain-and-associates-backend.vercel.app/wall/${id}`)
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

    await Axios.get("https://jain-and-associates-backend.vercel.app/wall/");
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
    <div align="center" className='p-4' >
      <figure className="figure" >
        <figcaption className="figure-caption" >
          <div className='  p-2 my-4 text-primary-emphasis bg-table-info bg-light border border-primary rounded-3' >
            <h2 className='p-2' align='center'>Calculation of Number of Bricks</h2>

            <form className='align-center'  >
              <div className="row mb-3">
                <div className='col-sm-2'></div>
                <label htmlFor="inputEmail3" className="col-sm-3 fs-5 col-form-label">Wall Name:</label>
                <div className="col-sm-5">
                  <input type="text" className="form-control" id="name" placeholder="Enter W1,W2,....." value={material.name} onChange={(e) => change(e)} required />
                </div>
              </div>
              <div className="row mb-3">
                <div className='col-sm-0'></div>
                <label htmlFor="inputEmail3" className="col-sm-5 fs-5 col-form-label">Number of <b>{material.name}</b> Wall :</label>
                <div className="col-sm-5">
                  <input type="number" className="form-control" id="noOfSameWall" placeholder="Enter No. of Same Column" value={material.noOfSameWall} onChange={(e) => change(e)} required />
                </div>
              </div>
              <div className="row mb-3">
                <div className='col-sm-2'></div>
                <label htmlFor="inputEmail3" className="col-sm-3 fs-5 col-form-label">Length:</label>
                <div className="col-sm-5">
                  {/* <input type="number" className="form-control" id="length" placeholder="Enter in Meter" value={material.length} onChange={(e) => change(e)} required /> */}
                  <input type="number" className="form-control" id="length" inputMode="decimal" placeholder="Enter in meter" value={material.length} onChange={(e) => change(e)} required />
                </div>
              </div>
              <div className="row mb-3">
                <div className='col-sm-2'></div>
                <label htmlFor="inputEmail3" className="col-sm-3 fs-5 col-form-label">Breadth:</label>
                <div className="col-sm-5">
                  {/* <input type="number" className="form-control" id="length" placeholder="Enter in Meter" value={material.length} onChange={(e) => change(e)} required /> */}
                  <input type="number" className="form-control" id="breadth" inputMode="decimal" placeholder="Enter in meter" value={material.breadth} onChange={(e) => change(e)} required />
                </div>
              </div>
              <div className="row mb-3">
                <div className='col-sm-2'></div>
                <label htmlFor="inputEmail3" className="col-sm-3 fs-5 col-form-label">Thickness:</label>
                <div className="col-sm-5">
                  {/* <input type="number" className="form-control" id="length" placeholder="Enter in Meter" value={material.length} onChange={(e) => change(e)} required /> */}
                  <input type="number" className="form-control" id="height" inputMode="decimal" placeholder="Enter in meter" value={material.height} onChange={(e) => change(e)} required />
                </div>
              </div>

              <div align='center' className="align-content-center">
                <button type="submit" className="btn btn-outline-primary fw-bolder p-2 border-2 fs-5" onClick={calculateBricks}>Calculate Material Needed</button>
                {showresult && (
                  <div id="textField" className='fs-4' >
                    <div className='fs-4 mt-2'>
                      <p>No. of Bricks needed: {numberOfBricks !== null ? numberOfBricks : ''}</p>
                      <p>No. of Cement bags: {No_of_cement_bags !== null ? No_of_cement_bags : ''}</p>
                      <p>Volume of Sand (Cubic feet): {Vol_of_sand !== null ? Vol_of_sand : ''} ({Vol_of_sand / 100} brass)</p>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
        </figcaption>
      </figure>
      <div className="m-3" id='printablediv'>
        <h1 className="text-center mb-4">List of Material Estimated for Wall</h1>
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
              <th>Name of Wall</th>
              <th>No of Same Wall</th>
              <th>No. of Bricks</th>
              <th>No. of Cement bags</th>
              <th>Sand</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {myData.map((myData) => (
              <tr  >
                <td >{myData.name}</td>
                <td >{myData.noOfSameWall}</td>
                <td >{myData.numberOfBricks}</td>
                <td >{myData.No_of_cement_bags}</td>
                <td >{myData.Vol_of_sand}</td>
                <th><button className='btn btn-outline-primary fw-bolder border-2 ' onClick={(e) => handleDelete(e, myData._id)}>Delete</button></th>
              </tr>

            ))}
            <tr>
              <th><button className='btn btn-outline-primary fw-bolder p-2 border-2 ' onClick={Total} >Click here to Get Total</button></th>
              <td> </td>
              <th key={total.wallBricks}>{total.wallBricks}</th>
              <th key={total.wallCement}>{total.wallCement}</th>
              <th key={total.wallSand}>{total.wallSand}</th>
              <th></th>
            </tr>
          </tbody>

        </table>

        <button className='btn btn-outline-primary fw-bolder p-2 border-2 ' onClick={Print} >Print Page</button>
      </div>
    </div>
  )
}



