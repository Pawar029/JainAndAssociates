import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import Axios from 'axios';

export default function ClientList() {
    const [myData,setMyData] = useState([]);
    useEffect(() => {
        Axios.get("https://jain-and-associates-backend.vercel.app/register")
            .then((res) => {
              // console.log(res.data)
                setMyData(res.data);
            })
    })

    const handleDelete = async (e, id) => {
      // Perform delete operation using the id
      console.log(`Deleting data with id ${id}`);
      await Axios.delete(`https://jain-and-associates-backend.vercel.app/register/${id}`)
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

    };
  
  return (
    <div className='text-center m-3'>
       <h2>List Of Client Registered</h2> 
       <div>
       <table className="table">
          <thead>
            <tr>
              <th>Name of Client</th>
              <th>Phone No.</th>
              <th>Address</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {myData.map((myData) => (
              <tr  >
                <td >{myData.name}</td>
                <td >{myData.number}</td>
                <td >{myData.location}</td>
                <td >{myData.email}</td>
                <th><button className='btn btn-outline-primary fw-bolder p-2 border-2 m-2' onClick={(e) => handleDelete(e, myData._id)}>Delete</button></th>
              </tr>
            ))}    
          </tbody>
        </table>
       </div>
    </div>
  )
}
