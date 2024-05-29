import React, { useState, useEffect } from 'react';
// import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Axios from 'axios';



export default function MaterialInSlab() {

  const [material, setMaterial] = useState({
    name: "",
    noOfSameSlab:"",
    length: "",
    bredth: "",
    thick: "",
    main_dia: "",
    dist_dia: "",
    spac_main: "",
    spac_dist: "",
    cover_slab: "",
    top_ex_bar: "",
    spac_ex_bar: "",
    widt_b1: "",
    widt_b2: "",
    beam_cov: ""


  })

  const name = material.name;
  const noOfSameSlab = parseFloat(material.noOfSameSlab);
  const length = parseFloat(material.length);
  const bredth = parseFloat(material.bredth);
  const thick = parseFloat(material.thick);
  const main_dia = parseFloat(material.main_dia);
  const dist_dia = parseFloat(material.dist_dia);
  const spac_main = parseFloat(material.spac_main);
  const spac_dist = parseFloat(material.spac_dist);
  const cover_slab = parseFloat(material.cover_slab);
  const top_ex_bar = parseFloat(material.top_ex_bar);
  const spac_ex_bar = parseFloat(material.spac_ex_bar);
  const widt_b1 = parseFloat(material.widt_b1);
  const widt_b2 = parseFloat(material.widt_b2);
  const beam_cov = parseFloat(material.beam_cov);


  const [No_of_cement_bags, setNo_of_cement_bags] = useState(0);
  const [Vol_of_sand, setVol_of_sand] = useState(0);
  const [Vol_of_Aggregate, setVol_of_Aggregate] = useState(0);
  const [Weight_mb, setWeight_mb] = useState(0);
  const [Weight_db, setWeight_db] = useState(0);
  const [Weight_tb, setWeight_tb] = useState(0);  // it used for one way

  const [showresult, setShowresult] = useState(false);

  const [selectedOption, setSelectedOption] = useState(null);

  const [myData, setMyData] = useState([]);
  const [login,setlogin] = useState(false);
  const [loginData, setloginData] = useState("");
  useEffect(() => {

    Axios.get("http://localhost:8000/profile")
      .then((logindata) => {
        if(logindata.data.length!==0){
          setlogin(true);
          setloginData(logindata.data);
        }
        else{
          setlogin(false);
          setloginData("");
        }
      })

    Axios.get("http://localhost:8000/slab/")
      .then((res) =>{
        if(login){
          setMyData(res.data);
        
        }
        else{
          setMyData([]);
        }
      }
      );

    
    

  }, [myData,login]);
  // console.log("Data from backend ", myData);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const submit = (e) => {

    e.preventDefault();


    const wet_vol = length * bredth * thick;
    // console.log(wet_vol);
    const dry_vol = wet_vol * 1.54;
    const total_ratio = 1 + 1.5 + 3;  //ratio 1 : 1.5 : 3
    const vol_cement = (1 / total_ratio) * dry_vol;
    setNo_of_cement_bags(Math.ceil((vol_cement*noOfSameSlab) / 0.03539));  // volumne of each cement bag in cubic feet is 1.25 , and in cubic meter is 0.03539

    const vol_sand = (1.5 / total_ratio) * dry_vol;
    setVol_of_sand(Math.ceil(vol_sand*noOfSameSlab));

    console.log("Cement ",vol_cement/0.03539 , (vol_cement*noOfSameSlab) / 0.03539);
    const vol_Aggregate = (3 / total_ratio) * dry_vol;
    setVol_of_Aggregate(Math.ceil(vol_Aggregate*noOfSameSlab));

    // Steel Calculation of for One-Way Slab
    if (selectedOption === 'oneway') {
      const No_of_mb = (length / spac_main) + 1;
      const No_of_db = (bredth / spac_dist) + 1;
      console.log("main bar ", No_of_mb);
      const d = thick - (2 * cover_slab) - (main_dia / 1000);
      const bend = main_dia / 1000;
      const a = (widt_b1 + widt_b2 - (beam_cov * 2));
      const cut_len_main = bredth + a + (0.42 * d) - bend * 2;
      const cut_len_dist = length - (beam_cov * 2);
      const top_ext_bar = bredth / 4;
      const No_top_ext_bar = ((top_ext_bar / spac_ex_bar) + 1) * 2;
      const cut_len_top_ext = cut_len_dist;
      const wei_main = (cut_len_main * (main_dia * main_dia) * No_of_mb) / 162;
      const wei_dist = (cut_len_dist * (dist_dia * dist_dia) * No_of_db) / 162;
      const wei_top_ext_bar = (cut_len_top_ext * (top_ex_bar * top_ex_bar) * No_top_ext_bar) / 162;


      setWeight_mb(parseFloat((wei_main*noOfSameSlab).toFixed(3), 10));
      setWeight_db(parseFloat((wei_dist*noOfSameSlab).toFixed(3), 10));
      setWeight_tb(parseFloat((wei_top_ext_bar*noOfSameSlab).toFixed(3), 10)); //tb- top extra bar
    }

    // Steel Calculation of for Two-Way Slab

    else if (selectedOption === 'twoway') {
      console.log("Start")
      const No_of_mb = (length / spac_main) + 1;
      const No_of_db = (bredth / spac_dist) + 1;
      const d_main = thick - 2 * cover_slab - main_dia / 1000;
      const degree45_main = 1 * (main_dia / 1000);
      const cut_len_main = bredth + (2 * 40 * (main_dia / 1000)) + (0.42 * d_main) - (degree45_main * 2);

      const d_dist = thick - 2 * cover_slab - dist_dia / 1000;
      const degree45_dist = 1 * (dist_dia / 1000);
      const cut_len_dist = length + (2 * 40 * (dist_dia / 1000)) + (0.42 * d_dist) - (degree45_dist * 2);

      const No_of_top_long_bar = (((bredth / 5) / spac_ex_bar) + 1) * 2;
      const No_of_top_short_bar = (((length / 5) / spac_ex_bar) + 1) * 2;
      const cut_len_top_long_ext = length + (2 * 40 * (top_ex_bar / 1000));
      const cut_len_top_short_ext = bredth + (2 * 40 * (top_ex_bar / 1000));

      const wei_main = ((main_dia * main_dia) / 162.2) * cut_len_main * No_of_mb;
      const wei_dist = ((dist_dia * dist_dia) / 162.2) * cut_len_dist * No_of_db;
      const wei_short_ext = ((top_ex_bar * top_ex_bar) / 162.2) * cut_len_top_short_ext * No_of_top_short_bar;
      const wei_long_ext = ((top_ex_bar * top_ex_bar) / 162.2) * cut_len_top_long_ext * No_of_top_long_bar;

      const wei_top_ext_bar = wei_short_ext + wei_long_ext;
      console.log("hello");
      console.log(wei_main);
      console.log(wei_dist);
      console.log(wei_top_ext_bar);
      setWeight_mb(parseFloat((wei_main*noOfSameSlab).toFixed(3), 10));
      setWeight_db(parseFloat((wei_dist*noOfSameSlab).toFixed(3), 10));
      setWeight_tb(parseFloat((wei_top_ext_bar*noOfSameSlab).toFixed(3), 10)); //tb- top extra bar
    }

    //  Steel Calculation of for Simple Slab
    else {
      const No_of_mb = (length / spac_main) + 1;   //For Main Bars we use spacing as 0.984 feet (0.984 feet = 300 mm)
      const No_of_db = (bredth / spac_dist) + 1;   //For Distributed Bars we use spacing as 1.476 feet (1.476 feet = 450 mm)

      const weight_mainbar = ((main_dia * main_dia) * bredth * No_of_mb) / 162.2;   //((D^2) x total length of bars)/162 -----Diameter(D) is in mm
      const weight_distbar = ((dist_dia * dist_dia) * length * No_of_db) / 162.2;   //((D^2) x total length of bars)/162 -----Diameter(D) is in mm
      setWeight_mb(parseFloat((weight_mainbar*noOfSameSlab).toFixed(3), 10));
      setWeight_db(parseFloat((weight_distbar*noOfSameSlab).toFixed(3), 10));
    }

    setShowresult(true)




  }

  const change = e => {
    const newdata = { ...material }
    newdata[e.target.id] = e.target.value
    setMaterial(newdata)
    // setlength(event.target.length)
  }

  async function addTask(e) {
    e.preventDefault();
    console.log("addtask invoked");

    try {
      // console.log("hello");
      const logindata = await Axios.get("http://localhost:8000/profile");
      // console.log("Here is login data ",logindata);
      console.log("Here is login data ",logindata.data.name);
      await Axios.post("http://localhost:8000/slab/", {
        clientName:logindata.data.name,
        clientNumber:logindata.data.number,
        name,
        selectedOption,
        noOfSameSlab,
        No_of_cement_bags,
        Vol_of_sand,
        Vol_of_Aggregate,
        main_dia,
        Weight_mb,
        dist_dia,
        Weight_db,
        top_ex_bar,
        Weight_tb,

      });
      const res = await Axios.get("http://localhost:8000/slab/");
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

  const [slabSteel, setSlabSteel] = useState({});
  const [total, setTotal] = useState([]);
  const Total = async (e) => {
    e.preventDefault();
    try {

      await Axios.patch("http://localhost:8000/result/");

      const response = await Axios.get("http://localhost:8000/result/");
      setTotal(response.data);
      const { slabSteel } = response.data;
      if(slabSteel){
        setSlabSteel(slabSteel);
      }
      console.log("response data", response.data);
    }
    catch (e) {
      // console.log("here is error");
      console.log(e);
    }

  };

  const handleDelete = async (id) => {
    // Perform delete operation using the id
    console.log(`Deleting data with id ${id}`);
    await Axios.delete(`http://localhost:8000/slab/${id}`)
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

    await Axios.get("http://localhost:8000/slab/");
  };
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
    <div align="center" >
      {/* <figure className="w-100 figure" > */}
      <figure className=" figure" >
        {/* <img src={pic} className="bg-opacity-25 figure-img img-fluid rounded" alt="..." /> */}
        <figcaption className="figure-caption" >
          <div className='container p-2 my-4 text-primary-emphasis bg-table-info bg-light border border-primary rounded-3 '>
            <h2 className='p-2' align='center'>Material Needed for Slab</h2>
            <form className='align-center'  >
              <div className="row mb-3">
                <div className='col-sm-2'></div>
                <label htmlFor="inputEmail3" className="col-sm-3 fs-5 col-form-label">Slab Name :</label>
                <div className="col-sm-5">
                  <input type="text" className="form-control" id="name" placeholder="Enter S1,S2,....." value={material.name} onChange={(e) => change(e)} required />
                </div>
              </div>
              <div className="row mb-3">
                <div className='col-sm-0'></div>
                <label htmlFor="inputEmail3" className="col-sm-5 fs-5 col-form-label">Number of <b>{material.name}</b> Slab :</label>
                <div className="col-sm-5">
                  <input type="number" className="form-control" id="noOfSameSlab" placeholder="Enter No. of Same Slab" value={material.noOfSameSlab} onChange={(e) => change(e)} required />
                </div>
              </div>
              <div className="input-group row mb-3">
                <div className='col-sm-2'></div>
                {/* <div className="input-group-prepend"> */}
                <label className="col-sm-3 fs-5 col-form-label" htmlFor="inputGroupSelect01">Type Of Slab :</label>
                {/* </div> */}
                <div className="col-sm-5">
                  <select className="custom-select form-control" id="inputGroupSelect01" value={selectedOption !== null ? selectedOption : ''} onChange={handleOptionChange}>
                    <option selected>Choose Slab Type</option>
                    <option value="simple"  >Simple Slab</option>
                    <option value="oneway"  >One-Way Slab</option>
                    <option value="twoway"  >Two-Way Slab</option>
                  </select>
                </div>
              </div>
              <div className="row mb-3">
                <div className='col-sm-2'></div>
                <label htmlFor="inputEmail3" className="col-sm-3 fs-5 col-form-label">Length :</label>
                <div className="col-sm-5">
                  <input type="number" className="form-control" id="length" placeholder="Enter in Meter" value={material.length} onChange={(e) => change(e)} required />
                </div>
              </div>
              <div className="row mb-3">
                <div className='col-sm-2'></div>
                <label htmlFor="inputEmail3" className="col-sm-3 fs-5 col-form-label">Breadth:</label>
                <div className="col-sm-5">
                  <input type="number" className="form-control" id="bredth" placeholder="Enter in Meter" value={material.bredth} onChange={(e) => change(e)} required />
                </div>
              </div>
              <div className="row mb-3">
                <div className='col-sm-2'></div>
                <label htmlFor="inputEmail3" className="col-sm-3 fs-5 col-form-label">Thickness:</label>
                <div className="col-sm-5">
                  <input type="number" className="form-control" id="thick" placeholder="Enter in Meter" value={material.thick} onChange={(e) => change(e)} required />
                </div>
              </div>
              <div className="row mb-3">
                <div className='col-sm-0'></div>
                <label htmlFor="inputEmail3" className="col-sm-5 fs-5 col-form-label">Diameter of Main Bars :</label>
                <div className="col-sm-5">
                  <input type="number" className="form-control" id="main_dia" placeholder="Enter in MM" value={material.main_dia} onChange={(e) => change(e)} required />
                </div>
              </div>
              <div className="row mb-3">
                <div className='col-sm-0'></div>
                <label htmlFor="inputEmail3" className="col-sm-5 fs-5 col-form-label">Diameter of Distribution Bar :</label>
                <div className="col-sm-5">
                  <input type="number" className="form-control" id="dist_dia" placeholder="Enter in MM" value={material.dist_dia} onChange={(e) => change(e)} required />
                </div>
              </div>
              <div className="row mb-3">
                <div className='col-sm-0'></div>
                <label htmlFor="inputEmail3" className="col-sm-5 fs-5 col-form-label">Spacing Between Main bar :</label>
                <div className="col-sm-5">
                  <input type="number" className="form-control" id="spac_main" placeholder="Enter in Meter" value={material.spac_main} onChange={(e) => change(e)} required />
                </div>
              </div>
              <div className="row mb-3">
                <div className='col-sm-0'></div>
                <label htmlFor="inputEmail3" className="col-sm-5 fs-5 col-form-label">Spacing Between Distribution bar :</label>
                <div className="col-sm-5">
                  <input type="number" className="form-control" id="spac_dist" placeholder="Enter in Meter" value={material.spac_dist} onChange={(e) => change(e)} required />
                </div>
              </div>

              {selectedOption === 'oneway' && (
                <div>
                  <div className="row mb-3">
                    <div className='col-sm-0'></div>
                    <label htmlFor="inputEmail3" className="col-sm-5 fs-5 col-form-label">Clear Cover Of Slab :</label>
                    <div className="col-sm-5">
                      <input type="number" className="form-control" id="cover_slab" placeholder="Enter in Meter" value={material.cover_slab} onChange={(e) => change(e)} required />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className='col-sm-0'></div>
                    <label htmlFor="inputEmail3" className="col-sm-5 fs-5 col-form-label">Diameter of Top Extra Bar :</label>
                    <div className="col-sm-5">
                      <input type="number" className="form-control" id="top_ex_bar" placeholder="Enter in MM" value={material.top_ex_bar} onChange={(e) => change(e)} required />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className='col-sm-0'></div>
                    <label htmlFor="inputEmail3" className="col-sm-5 fs-5 col-form-label">Spacing of Top Extra Bar :</label>
                    <div className="col-sm-5">
                      <input type="number" className="form-control" id="spac_ex_bar" placeholder="Enter in Meter" value={material.spac_ex_bar} onChange={(e) => change(e)} required />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className='col-sm-0'></div>
                    <label htmlFor="inputEmail3" className="col-sm-5 fs-5 col-form-label">Width of beam1 :</label>
                    <div className="col-sm-5">
                      <input type="number" className="form-control" id="widt_b1" placeholder="Enter in Meter" value={material.widt_b1} onChange={(e) => change(e)} required />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className='col-sm-0'></div>
                    <label htmlFor="inputEmail3" className="col-sm-5 fs-5 col-form-label">Width of beam2 :</label>
                    <div className="col-sm-5">
                      <input type="number" className="form-control" id="widt_b2" placeholder="Enter in Meter" value={material.widt_b2} onChange={(e) => change(e)} required />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className='col-sm-0'></div>
                    <label htmlFor="inputEmail3" className="col-sm-5 fs-5 col-form-label">Beam Cover :</label>
                    <div className="col-sm-5">
                      <input type="number" className="form-control" id="beam_cov" placeholder="Enter in Meter" value={material.beam_cov} onChange={(e) => change(e)} required />
                    </div>
                  </div>
                </div>
              )}
              {selectedOption === 'twoway' && (
                <div>
                  <div className="row mb-3">
                    <div className='col-sm-0'></div>
                    <label htmlFor="inputEmail3" className="col-sm-5 fs-5 col-form-label">Clear Cover Of Slab :</label>
                    <div className="col-sm-5">
                      <input type="number" className="form-control" id="cover_slab" placeholder="Enter in Meter" value={material.cover_slab} onChange={(e) => change(e)} required />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className='col-sm-0'></div>
                    <label htmlFor="inputEmail3" className="col-sm-5 fs-5 col-form-label">Diameter of Top Extra Bar :</label>
                    <div className="col-sm-5">
                      <input type="number" className="form-control" id="top_ex_bar" placeholder="Enter in MM" value={material.top_ex_bar} onChange={(e) => change(e)} required />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className='col-sm-0'></div>
                    <label htmlFor="inputEmail3" className="col-sm-5 fs-5 col-form-label">Spacing of Top Extra Bar :</label>
                    <div className="col-sm-5">
                      <input type="number" className="form-control" id="spac_ex_bar" placeholder="Enter in Meter" value={material.spac_ex_bar} onChange={(e) => change(e)} required />
                    </div>
                  </div>
                </div>
              )}




              <div align='center' className="align-content-center">
                <button type="submit" className="btn btn-outline-primary   fw-bolder  p-2 border-2    fs-5" onClick={submit}>Calculate Material Needed</button>
                {showresult && (
                  <div id="textField" className='fs-4' >
                    <p>Number of Cement Bags Needed are : {No_of_cement_bags}</p>
                    <p>Sand Needed is : {Vol_of_sand} Cubic Meter ({Vol_of_sand * 0.353} brass)</p>
                    <p>Aggregate Needed is : {Vol_of_Aggregate} Cubic Meter ({Vol_of_Aggregate * 0.353} brass)</p>
                    <p>Weight of Main Bars Needed is : {Weight_mb}  kg</p>
                    <p>Weight of Distribution Bars Needed is : {Weight_db}  kg</p>
                    <p>Weight of Top Extra Bars Needed is : {Weight_tb}  kg</p>
                  </div>
                )}
              </div>
            </form>
          </div>
        </figcaption>
      </figure>


      <div className="m-3" id='printablediv'>
        <h1 className="text-center mb-4">List of Material Estimated for Slab</h1>
        <div id="create-task" className="mb-3">
          <div className="input-group">

            <button className="btn btn-outline-primary fw-bolder p-2 border-2" onClick={(e) => addTask(e)}>
              Add
            </button>
          </div>
          <div className='text-start mt-4'>
            <p>Client Name: {loginData.name}</p>
            <p>Phone No.: {loginData.number}</p>
          </div>
        </div>
        <div >
          <table className="table" >
            <thead>
              <tr>
                <th>Name of Slab</th>
                <th>No of Same Slab</th>
                <th>Slab Type</th>
                <th>No. of Cement bags</th>
                <th>Sand</th>
                <th>Aggregate</th>
                <th>Actions</th>


              </tr>
            </thead>
            <tbody  >
              {myData.map((myData) => (
                <tr  >
                  <td >{myData.name}</td>
                  <td >{myData.noOfSameSlab}</td>
                  <td >{myData.selectedOption}</td>
                  <td >{myData.No_of_cement_bags}</td>
                  <td >{myData.Vol_of_sand}</td>
                  <td >{myData.Vol_of_Aggregate}</td>
                  <th><button className='btn btn-outline-primary fw-bolder border-2 ' onClick={() => handleDelete(myData._id)}>Delete</button></th>
                </tr>

              ))}

              <tr>
                <th><button className='btn btn-outline-primary fw-bolder p-2 border-2 ' onClick={Total} >Click here to Get Total</button></th>
                <td> </td>
                <td> </td>
                <th key={total.slabCement}>{total.slabCement}</th>
                <th key={total.slabSand}>{total.slabSand}</th>
                <th key={total.slabAggregate}>{total.slabAggregate}</th>
                <th></th>
              </tr>

            </tbody>

          </table>
        </div>

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
            <tbody >
              {Object.entries(slabSteel).map(([dia, weight]) => (
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


        <button className='btn btn-outline-primary fw-bolder p-2 border-2 ' onClick={Print} >Print Page</button>
        {/* <PrintComponent/> */}
      </div>





    </div>
  )
}

