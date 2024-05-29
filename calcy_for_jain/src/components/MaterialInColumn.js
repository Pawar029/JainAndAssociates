import React, { useState, useEffect } from 'react'
import Axios from 'axios';

export default function MaterialInColumn() {

  const [material, setMaterial] = useState({
    name: "",
    noOfSameColumn: "",
    length: "",
    breadth: "",
    height: "",
    long_dia: "",
    no_long_bar: "",
    stir_dia: "",
    spac_stir: "",
    leg_len: "",
    col_cov: "",
    diameter: ""
  })

  const name = material.name;
  const noOfSameColumn = parseFloat(material.noOfSameColumn);
  const length = parseFloat(material.length);
  const breadth = parseFloat(material.breadth);
  const height = parseFloat(material.height);
  const long_dia = parseFloat(material.long_dia);
  const no_long_bar = parseFloat(material.no_long_bar);
  const stir_dia = parseFloat(material.stir_dia);
  const spac_stir = parseFloat(material.spac_stir);
  const leg_len = parseFloat(material.leg_len);
  const col_cov = parseFloat(material.col_cov);
  const diameter = parseFloat(material.diameter);



  const [No_of_cement_bags, setNo_of_cement_bags] = useState("");
  const [Vol_of_sand, setVol_of_sand] = useState("");
  const [Vol_of_Aggregate, setVol_of_Aggregate] = useState("");
  const [longitudinalBarWeight, setLongitudinalBarWeight] = useState("");
  const [stirrupsWeight, setStirrupsWeight] = useState("");

  const [showresult, setShowresult] = useState(false);

  const [selectedOption, setSelectedOption] = useState(null);

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

    Axios.get("http://localhost:8000/column/")
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
  // console.log("result  ",myData);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const submit = (e) => {

    e.preventDefault();

    // Calculation of Steel
    if (selectedOption === "circular") {

      const wet_vol = (3.14 * diameter * diameter * height) / 4;
      // console.log(wet_vol);
      const dry_vol = wet_vol * 1.54;
      const total_ratio = 1 + 1.5 + 3;  //ratio 1 : 1.5 : 3
      const vol_cement = (1 / total_ratio) * dry_vol;
      setNo_of_cement_bags(Math.ceil((vol_cement * noOfSameColumn) / 0.03539));  // volumne of each cement bag in cubic feet is 1.25

      const vol_sand = (1.5 / total_ratio) * dry_vol;
      setVol_of_sand(parseFloat((vol_sand * noOfSameColumn).toFixed(3), 10));


      const vol_Aggregate = (3 / total_ratio) * dry_vol;
      setVol_of_Aggregate(parseFloat((vol_Aggregate * noOfSameColumn).toFixed(3), 10));

      const len_long_bar = height + leg_len;
      const total_len_long_bar = no_long_bar * len_long_bar;
      const wei_long_bar = (total_len_long_bar * long_dia * long_dia) / 162.2;

      const dia_ring = diameter - 2 * col_cov;
      const len_one_ring = (2 * 3.14 * (dia_ring / 2)) + 2 * 10 * (stir_dia / 1000) - 2 * 2 * (stir_dia / 1000);
      const total_no_of_rings = height / spac_stir + 1;
      const total_len_ring = total_no_of_rings * len_one_ring;
      const wei_ring_bar = (total_len_ring * stir_dia * stir_dia) / 162.2;
      setLongitudinalBarWeight(parseFloat((wei_long_bar * noOfSameColumn).toFixed(3), 10));
      setStirrupsWeight(parseFloat((wei_ring_bar * noOfSameColumn).toFixed(3), 10));


    }
    else {

      const wet_vol = length * breadth * height;
      // console.log(wet_vol);
      const dry_vol = wet_vol * 1.54;
      const total_ratio = 1 + 1.5 + 3;  //ratio 1 : 1.5 : 3
      const vol_cement = (1 / total_ratio) * dry_vol;
      setNo_of_cement_bags(Math.ceil((vol_cement * noOfSameColumn) / 0.03539));  // volumne of each cement bag in cubic feet is 1.25

      const vol_sand = (1.5 / total_ratio) * dry_vol;
      setVol_of_sand(parseFloat((vol_sand * noOfSameColumn).toFixed(3), 10));


      const vol_Aggregate = (3 / total_ratio) * dry_vol;
      setVol_of_Aggregate(parseFloat((vol_Aggregate * noOfSameColumn).toFixed(3), 10));


      const len_one_bar = height + leg_len;
      const total_len_long_bar = no_long_bar * len_one_bar;
      const len_one_ring = (((length + breadth) - (4 * col_cov)) * 2) + (2 * 0.075); //Hock length is 0.075 m
      console.log(len_one_ring);
      console.log(((length + breadth) - (4 * col_cov)));
      const total_no_of_rings = height / spac_stir;
      const total_len_ring = total_no_of_rings * len_one_ring;

      const wei_long_bar = (total_len_long_bar * long_dia * long_dia) / 162.2;
      const wei_ring_bar = (total_len_ring * stir_dia * stir_dia) / 162.2;

      setLongitudinalBarWeight(parseFloat((wei_long_bar * noOfSameColumn).toFixed(3), 10));
      setStirrupsWeight(parseFloat((wei_ring_bar * noOfSameColumn).toFixed(3), 10));

    }



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
      await Axios.post("http://localhost:8000/column/", {
        clientName:logindata.data.name,
        clientNumber:logindata.data.number,
        name,
        selectedOption,
        noOfSameColumn,
        No_of_cement_bags,
        Vol_of_sand,
        Vol_of_Aggregate,
        long_dia,
        longitudinalBarWeight,
        stir_dia,
        stirrupsWeight,

      });
      const res = await Axios.get("http://localhost:8000/column/");
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

  const [columnSteel, setColumnSteel] = useState({});
  const [total, setTotal] = useState([]);
  const Total = async (e) => {
    e.preventDefault();
    try {

      await Axios.patch("http://localhost:8000/resultcolumn/");

      const response = await Axios.get("http://localhost:8000/resultcolumn/");
      setTotal(response.data);
      const { columnSteel } = response.data;
      if(columnSteel){
        setColumnSteel(columnSteel);
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
    await Axios.delete(`http://localhost:8000/column/${id}`)
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

    await Axios.get("http://localhost:8000/column/");
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
    // <div className='p-4'>

    <div align="center"  >
      <figure className="figure" >
        {/* <img src={pic} className="bg-opacity-25 figure-img img-fluid rounded" alt="..." /> */}
        <figcaption className="figure-caption" >
          <div className='  p-2 my-4 text-primary-emphasis bg-light border border-primary rounded-3' >
            <h2 className='p-2' align='center'>Material Needed for Column</h2>
            <form className='align-center'  >
              <div className="row mb-3">
                <div className='col-sm-2'></div>
                <label htmlFor="inputEmail3" className="col-sm-3 fs-5 col-form-label">Column Name:</label>
                <div className="col-sm-5">
                  <input type="text" className="form-control" id="name" placeholder="Enter C1,C2,....." value={material.name} onChange={(e) => change(e)} required />
                </div>
              </div>
              <div className="row mb-3">
                <div className='col-sm-0'></div>
                <label htmlFor="inputEmail3" className="col-sm-5 fs-5 col-form-label">Number of <b>{material.name}</b> Column :</label>
                <div className="col-sm-5">
                  <input type="number" className="form-control" id="noOfSameColumn" placeholder="Enter No. of Same Column" value={material.noOfSameColumn} onChange={(e) => change(e)} required />
                </div>
              </div>
              <div className="input-group row mb-3">
                <div className='col-sm-2'></div>
                {/* <div className="input-group-prepend"> */}
                <label className="col-sm-3 fs-5 col-form-label" htmlFor="inputGroupSelect01">Type Of Column:</label>
                {/* </div> */}
                <div className="col-sm-5">
                  <select className="custom-select form-control" id="inputGroupSelect01" value={selectedOption !== null ? selectedOption : ''} onChange={handleOptionChange}>
                    <option selected>Choose Column Type</option>
                    <option value="simple"  >Simple Column</option>
                    <option value="circular"  >Circular Collumn</option>
                  </select>
                </div>
              </div>

              {
                (selectedOption === "circular") ? (
                  <div className="row mb-3">
                    <div className='col-sm-2'></div>
                    <label htmlFor="inputEmail3" className="col-sm-3 fs-5 col-form-label">Diameter of column:</label>
                    <div className="col-sm-5">
                      <input type="number" className="form-control" id="diameter" placeholder="Enter in Meter" value={material.diameter} onChange={(e) => change(e)} required />
                    </div>
                  </div>
                ) :

                  (
                    <div>
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
                    </div>
                  )}


              <div className="row mb-3">
                <div className='col-sm-2'></div>
                <label htmlFor="inputEmail3" className="col-sm-3 fs-5 col-form-label">Height:</label>
                <div className="col-sm-5">
                  <input type="number" className="form-control" id="height" placeholder="Enter in Meter" value={material.height} onChange={(e) => change(e)} required />
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
                <label htmlFor="inputEmail3" className="col-sm-5 fs-5 col-form-label">No. Of Long Bars:</label>
                <div className="col-sm-5">
                  <input type="number" className="form-control" id="no_long_bar" placeholder="Enter Number of bars" value={material.no_long_bar} onChange={(e) => change(e)} required />
                </div>
              </div>
              <div className="row mb-3">
                <div className='col-sm-0'></div>
                <label htmlFor="inputEmail3" className="col-sm-5 fs-5 col-form-label">Diameter of Stirrups :</label>
                <div className="col-sm-5">
                  <input type="number" className="form-control" id="stir_dia" placeholder="Enter in MM" value={material.stir_dia} onChange={(e) => change(e)} required />
                </div>
              </div>
              <div className="row mb-3">
                <div className='col-sm-0'></div>
                <label htmlFor="inputEmail3" className="col-sm-5 fs-5 col-form-label">Spacing Between Stirrups :</label>
                <div className="col-sm-5">
                  <input type="number" className="form-control" id="spac_stir" placeholder="Enter in Meter" value={material.spac_stir} onChange={(e) => change(e)} required />
                </div>
              </div>
              <div className="row mb-3">
                <div className='col-sm-0'></div>
                <label htmlFor="inputEmail3" className="col-sm-5 fs-5 col-form-label">Leg Length :</label>
                <div className="col-sm-5">
                  <input type="number" className="form-control" id="leg_len" placeholder="Enter in Meter" value={material.leg_len} onChange={(e) => change(e)} required />
                </div>
              </div>
              <div className="row mb-3">
                <div className='col-sm-0'></div>
                <label htmlFor="inputEmail3" className="col-sm-5 fs-5 col-form-label">Size of Column Cover :</label>
                <div className="col-sm-5">
                  <input type="number" className="form-control" id="col_cov" placeholder="Enter in Meter" value={material.col_cov} onChange={(e) => change(e)} required />
                </div>
              </div>
              <div align='center' className="align-content-center">
                <button type="submit" className="btn btn-outline-primary fw-bolder p-2 border-2    fs-5" onClick={submit}>Calculate Material Needed</button>
                {showresult && (
                  <div id="textField" className='fs-4' >
                    <p>Number of Cement Bags Needed are : {No_of_cement_bags}</p>
                    <p>Sand Needed is : {Vol_of_sand} Cubic feet ({Vol_of_sand * 0.353} brass)</p>
                    <p>Aggregate Needed is : {Vol_of_Aggregate} Cubic feet ({Vol_of_Aggregate * 0.353} brass)</p>
                    <p>Weight of Longitudinal Bars Needed is : {longitudinalBarWeight}  kg</p>
                    <p>Weight of Stirrups Needed is : {stirrupsWeight}  kg</p>

                  </div>
                )}
              </div>




            </form>
          </div>
        </figcaption>
      </figure>


      <div className="m-3" id='printablediv'>
        <h1 className="text-center mb-4">List of Material Estimated for Column</h1>
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
              <th>Column Type</th>
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
                <td >{myData.noOfSameColumn}</td>
                <td >{myData.selectedOption}</td>
                <td >{myData.No_of_cement_bags}</td>
                <td >{myData.Vol_of_sand}</td>
                <td >{myData.Vol_of_Aggregate}</td>
                <th><button className='btn btn-outline-primary fw-bolder p-2 border-2 m-2' onClick={(e) => handleDelete(e, myData._id)}>Delete</button></th>
              </tr>

            ))}
            <tr>
              <th><button className='btn btn-outline-primary fw-bolder p-2 border-2 ' onClick={Total} >Click here to Get Total</button></th>
              <td> </td>
              <td> </td>
              <th key={total.columnCement}>{total.columnCement}</th>
              <th key={total.columnSand}>{total.columnSand}</th>
              <th key={total.columnAggregate}>{total.columnAggregate}</th>
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

                {Object.entries(columnSteel).map(([dia, weight]) => (
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