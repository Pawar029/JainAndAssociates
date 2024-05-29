import React, { useState, useEffect } from 'react'
import Axios from 'axios';

export default function MaterialInBeam() {

  const [material, setMaterial] = useState({
    name: "",
    noOfSameBeam: "",
    length: "",
    depth: "",
    width: "",
    top_dia: "",
    bott_dia: "",
    no_top_bar: "",
    no_bott_bar: "",
    stir_dia: "",
    spac_stir: "",
    top_ex_dia: "",
    bott_ex_dia: "",
    no_top_ex: "",
    no_bott_ex: "",
    cov_top_bott: "",
    cov_side: ""
  })

  const name = material.name;
  const noOfSameBeam = parseFloat(material.noOfSameBeam);
  const length = parseFloat(material.length);
  const depth = parseFloat(material.depth);
  const width = parseFloat(material.width);
  const top_dia = parseFloat(material.top_dia);
  const bott_dia = parseFloat(material.bott_dia);
  const no_top_bar = parseFloat(material.no_top_bar);
  const no_bott_bar = parseFloat(material.no_bott_bar);
  const stir_dia = parseFloat(material.stir_dia);
  const spac_stir = parseFloat(material.spac_stir);
  const top_ex_dia = parseFloat(material.top_ex_dia);
  const bott_ex_dia = parseFloat(material.bott_ex_dia);
  const no_top_ex = parseFloat(material.no_top_ex);
  const no_bott_ex = parseFloat(material.no_bott_ex);
  const cov_top_bott = parseFloat(material.cov_top_bott);
  const cov_side = parseFloat(material.cov_side);


  const [No_of_cement_bags, setNo_of_cement_bags] = useState("");
  const [Vol_of_sand, setVol_of_sand] = useState("");
  const [Vol_of_Aggregate, setVol_of_Aggregate] = useState("");
  const [Weight_tb, setWeight_tb] = useState("");
  const [Weight_bb, setWeight_bb] = useState("");
  const [Weight_st, setWeight_st] = useState("");
  const [Weight_top_ex, setWeight_top_ex] = useState("");
  const [Weight_bott_ex, setWeight_bott_ex] = useState("");

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

    Axios.get("http://localhost:8000/beam/")
      .then((res) => {
        if(login){
          setMyData(res.data)
        }
        else{
          setMyData([]);
        }
      }
      );

  }, [myData,login]);

  const submit = (e) => {

    e.preventDefault()
    const wet_vol = length * depth * width;
    // console.log(wet_vol);
    const dry_vol = wet_vol * 1.54;
    const total_ratio = 1 + 1.5 + 3;  //ratio 1 : 1.5 : 3
    const vol_cement = (1 / total_ratio) * dry_vol;
    setNo_of_cement_bags(Math.ceil((vol_cement * noOfSameBeam) / 0.03539));  // volumne of each cement bag in cubic feet is 1.25

    const vol_sand = (1.5 / total_ratio) * dry_vol;
    setVol_of_sand(parseFloat((vol_sand * noOfSameBeam).toFixed(3), 10));


    const vol_Aggregate = (3 / total_ratio) * dry_vol;
    setVol_of_Aggregate(parseFloat((vol_Aggregate * noOfSameBeam).toFixed(3), 10));

    // Calculation for Steel
    const len_bott_bar = length + (2 * 50 * (bott_dia / 1000));
    const len_top_bar = length + (2 * 50 * (top_dia / 1000));
    const no_of_stir = Math.ceil((length / spac_stir) + 1);
    const len_stir = 2 * ((depth - (2 * cov_top_bott)) + (width - (2 * cov_side))) + (2 * 10 * (stir_dia / 1000));

    const wei_bott_bar = (no_bott_bar * len_bott_bar * bott_dia * bott_dia) / 162.2;
    const wei_top_bar = (no_top_bar * len_top_bar * top_dia * top_dia) / 162.2;
    const wei_stir = (no_of_stir * len_stir * stir_dia * stir_dia) / 162.2;

    setWeight_bb(parseFloat((wei_bott_bar * noOfSameBeam).toFixed(3), 10));
    setWeight_tb(parseFloat((wei_top_bar * noOfSameBeam).toFixed(3), 10));
    setWeight_st(parseFloat((wei_stir * noOfSameBeam).toFixed(3), 10));

    // For Top Extra Bar
    const len_top_ext_bar = 0.3 * len_top_bar;          // Total extra bars from both side should be given by user
    const wei_top_ext_bar = (no_top_ex * len_top_ext_bar * top_ex_dia * top_ex_dia) / 162.2;
    setWeight_top_ex(parseFloat((wei_top_ext_bar * noOfSameBeam).toFixed(3), 10));

    // For Bottom Extra Bar
    const a = 0.2 * len_bott_bar;
    const len_bott_ext_bar = len_bott_bar - (2 * a)
    const wei_bott_ext_bar = (no_bott_ex * len_bott_ext_bar * bott_ex_dia * bott_ex_dia) / 162.2;
    setWeight_bott_ex(parseFloat((wei_bott_ext_bar * noOfSameBeam).toFixed(3), 10));


    setShowresult(true)
  }

  const change = e => {
    const newdata = { ...material }
    newdata[e.target.id] = e.target.value
    setMaterial(newdata)
  }


  async function addTask(e) {
    e.preventDefault();
    console.log("addtask invoked");

    try {
      // console.log("hello");
      const logindata = await Axios.get("http://localhost:8000/profile");
      await Axios.post("http://localhost:8000/beam/", {
        clientName:logindata.data.name,
        clientNumber:logindata.data.number,
        name,
        noOfSameBeam, 
        No_of_cement_bags,
        Vol_of_sand,
        Vol_of_Aggregate,
        top_dia,
        Weight_tb,
        bott_dia,
        Weight_bb,
        stir_dia,
        Weight_st,
        top_ex_dia,
        Weight_top_ex,
        bott_ex_dia,
        Weight_bott_ex,
      });
      const res = await Axios.get("http://localhost:8000/beam/");
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

  const [beamSteel, setBeamSteel] = useState({});
  const [total, setTotal] = useState([]);

  const Total = async (e) => {
    e.preventDefault();


    try {

      await Axios.patch("http://localhost:8000/resultbeam/");

      const response = await Axios.get("http://localhost:8000/resultbeam/");
      setTotal(response.data);
      const { beamSteel } = response.data;
      if(beamSteel){
        setBeamSteel(beamSteel);
      }
      console.log("response data", response.data);
    }
    catch (e) {
      // console.log("here is error");
      console.log(e);
    }

  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    // Perform delete operation using the id
    console.log(`Deleting data with id ${id}`);
    await Axios.delete(`http://localhost:8000/beam/${id}`)
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

    // Call the Total function
    await Total(e);
    await Axios.get("http://localhost:8000/beam/");
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

    <div align="center"  >
      <figure className="figure" >
        {/* <img src={pic} className="bg-opacity-25 figure-img img-fluid rounded" alt="..." /> */}
        <figcaption className="figure-caption" >
          <div className='  p-2 my-4 text-primary-emphasis bg-light border border-primary rounded-3' >
            <h2 className='p-2' align='center'>Material Needed for Beam</h2>
            <form className='align-center'  >
              <div className="row mb-3">
                <div className='col-sm-2'></div>
                <label htmlFor="inputEmail3" className="col-sm-3 fs-5 col-form-label">Beam Name:</label>
                <div className="col-sm-5">
                  <input type="text" className="form-control" id="name" placeholder="Enter B1,B2,....." value={material.name} onChange={(e) => change(e)} required />
                </div>
              </div>
              <div className="row mb-3">
                <div className='col-sm-2'></div>
                <label htmlFor="inputEmail3" className="col-sm-3 fs-5 col-form-label">Number of <b>{material.name}</b> Beam :</label>
                <div className="col-sm-5">
                  <input type="number" className="form-control" id="noOfSameBeam" placeholder="Enter No. of Same Beam" value={material.noOfSameBeam} onChange={(e) => change(e)} required />
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
                <label htmlFor="inputEmail3" className="col-sm-3 fs-5 col-form-label">Depth:</label>
                <div className="col-sm-5">
                  <input type="number" className="form-control" id="depth" placeholder="Enter in Meter" value={material.depth} onChange={(e) => change(e)} required />
                </div>
              </div>
              <div className="row mb-3">
                <div className='col-sm-2'></div>
                <label htmlFor="inputEmail3" className="col-sm-3 fs-5 col-form-label">Width:</label>
                <div className="col-sm-5">
                  <input type="number" className="form-control" id="width" placeholder="Enter in Meter" value={material.width} onChange={(e) => change(e)} required />
                </div>
              </div>
              <div className="row mb-3">
                <div className='col-sm-0'></div>
                <label htmlFor="inputEmail3" className="col-sm-5 fs-5 col-form-label">Diameter of Top Bars :</label>
                <div className="col-sm-5">
                  <input type="number" className="form-control" id="top_dia" placeholder="Enter in MM" value={material.top_dia} onChange={(e) => change(e)} required />
                </div>
              </div>
              <div className="row mb-3">
                <div className='col-sm-0'></div>
                <label htmlFor="inputEmail3" className="col-sm-5 fs-5 col-form-label">Diameter of Bottom Bar :</label>
                <div className="col-sm-5">
                  <input type="number" className="form-control" id="bott_dia" placeholder="Enter in MM" value={material.bott_dia} onChange={(e) => change(e)} required />
                </div>
              </div>
              <div className="row mb-3">
                <div className='col-sm-0'></div>
                <label htmlFor="inputEmail3" className="col-sm-5 fs-5 col-form-label">No. of Top Bars :</label>
                <div className="col-sm-5">
                  <input type="number" className="form-control" id="no_top_bar" placeholder="Enter Number of Bars" value={material.no_top_bar} onChange={(e) => change(e)} required />
                </div>
              </div>
              <div className="row mb-3">
                <div className='col-sm-0'></div>
                <label htmlFor="inputEmail3" className="col-sm-5 fs-5 col-form-label">No. of Bottom Bar :</label>
                <div className="col-sm-5">
                  <input type="number" className="form-control" id="no_bott_bar" placeholder="Enter Number of Bars" value={material.no_bott_bar} onChange={(e) => change(e)} required />
                </div>
              </div>
              <div className="row mb-3">
                <div className='col-sm-0'></div>
                <label htmlFor="inputEmail3" className="col-sm-5 fs-5 col-form-label">Diameter of Stirrups Bar :</label>
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
                <label htmlFor="inputEmail3" className="col-sm-5 fs-5 col-form-label">Diameter of Top Extra Bar :</label>
                <div className="col-sm-5">
                  <input type="number" className="form-control" id="top_ex_dia" placeholder="Enter in MM" value={material.top_ex_dia} onChange={(e) => change(e)} required />
                </div>
              </div>
              <div className="row mb-3">
                <div className='col-sm-0'></div>
                <label htmlFor="inputEmail3" className="col-sm-5 fs-5 col-form-label">Diameter of Bottom Extra Bar :</label>
                <div className="col-sm-5">
                  <input type="number" className="form-control" id="bott_ex_dia" placeholder="Enter in MM" value={material.bott_ex_dia} onChange={(e) => change(e)} required />
                </div>
              </div>
              <div className="row mb-3">
                <div className='col-sm-0'></div>
                <label htmlFor="inputEmail3" className="col-sm-5 fs-5 col-form-label">No. of Top Extra Bar :</label>
                <div className="col-sm-5">
                  <input type="number" className="form-control" id="no_top_ex" placeholder="Enter Number of Bars" value={material.no_top_ex} onChange={(e) => change(e)} required />
                </div>
              </div>
              <div className="row mb-3">
                <div className='col-sm-0'></div>
                <label htmlFor="inputEmail3" className="col-sm-5 fs-5 col-form-label">No. of Bottom Extra Bar :</label>
                <div className="col-sm-5">
                  <input type="number" className="form-control" id="no_bott_ex" placeholder="Enter Number of Bars" value={material.no_bott_ex} onChange={(e) => change(e)} required />
                </div>
              </div>
              <div className="row mb-3">
                <div className='col-sm-0'></div>
                <label htmlFor="inputEmail3" className="col-sm-5 fs-5 col-form-label">Covering of Top & Bottom :</label>
                <div className="col-sm-5">
                  <input type="number" className="form-control" id="cov_top_bott" placeholder="Enter in Meter" value={material.cov_top_bott} onChange={(e) => change(e)} required />
                </div>
              </div>
              <div className="row mb-3">
                <div className='col-sm-0'></div>
                <label htmlFor="inputEmail3" className="col-sm-5 fs-5 col-form-label">Covering of Side :</label>
                <div className="col-sm-5">
                  <input type="number" className="form-control" id="cov_side" placeholder="Enter in Meter" value={material.cov_side} onChange={(e) => change(e)} required />
                </div>
              </div>





              <div align='center' className="align-content-center">
                <button type="submit" className="btn btn-outline-primary fw-bolder p-2 border-2  fs-5" onClick={submit}>Calculate Material Needed</button>
                {showresult && (
                  <div id="textField" className='fs-4' >
                    <p>Number of Cement Bags Needed are : {No_of_cement_bags}</p>
                    <p>Sand Needed is : {Vol_of_sand} Cubic feet ({Vol_of_sand * 0.353} brass)</p>
                    <p>Aggregate Needed is : {Vol_of_Aggregate} Cubic feet ({Vol_of_Aggregate * 0.353} brass)</p>
                    <p>Weight of Top Bars Needed is : {Weight_tb}  kg</p>
                    <p>Weight of Bottom Bars Needed is : {Weight_bb}  kg</p>
                    <p>Weight of Stirrups Needed is : {Weight_st}  kg</p>
                    <p>Weight of Top Extra Bar Needed is : {Weight_top_ex}  kg</p>
                    <p>Weight of Bottom Extra Bar Needed is : {Weight_bott_ex}  kg</p>
                  </div>
                )}
              </div>




            </form>
          </div>
        </figcaption>
      </figure>


      <div className="m-3" id='printablediv'>
        <h1 className="text-center mb-4">List of Material Estimated for Beam</h1>
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
              <th>Name of Slab</th>
              <th>No of Same Slab</th>
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
                <td >{myData.noOfSameBeam}</td>
                <td >{myData.No_of_cement_bags}</td>
                <td >{myData.Vol_of_sand}</td>
                <td >{myData.Vol_of_Aggregate}</td>
                <th><button className='btn btn-outline-primary fw-bolder p-2 border-2 m-2' onClick={(e) => handleDelete(e, myData._id)}>Delete</button></th>
              </tr>

            ))}
            <tr>
              <th><button className='btn btn-outline-primary fw-bolder p-2 border-2 ' onClick={Total} >Click here to Get Total</button></th>
              <td> </td>
              <th key={total.beamCement}>{total.beamCement}</th>
              <th key={total.beamSand}>{total.beamSand}</th>
              <th key={total.beamAggregate}>{total.beamAggregate}</th>
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

                {Object.entries(beamSteel).map(([dia, weight]) => (
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
        <button className='btn btn-outline-primary fw-bolder p-2 border-2' onClick={Print} >Print Page</button>
      </div>
    </div>
  )
}
