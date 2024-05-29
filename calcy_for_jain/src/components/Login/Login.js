import React, { useState } from "react";
import { Link } from 'react-router-dom';
import Axios from "axios";
// import { useNavigate } from "react-router-dom";
import './Login.css';

const Login = () => {
    const [name, setName] = useState("");
    const [number, setNumber] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    // const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            window.localStorage.setItem('number', number);
            const res = await Axios.post("http://localhost:8000/login", {
                name,
                number,
            });
            
            if (res.data.success) {
                // navigate("/");
                window.location.href = '/';
            } else {
                setErrorMessage(res.data.message);
            }
        } catch (error) {
            console.log(error);
            setErrorMessage("An error occurred while logging in");
        }
    };
    
    return (
        <div className="did">
            <div className="container">
                <div className="title">Login</div>
                <div className="content">
                    {errorMessage && <div className="error">{errorMessage}</div>}
                    <form action="#">
                        <div className="user-details">
                            <div className="input-box">
                                <span className="details">Name</span>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" required />
                            </div>
                            <div className="input-box">
                                <span className="details">Mobile Number</span>
                                <input type="text" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="Enter client mobile number" required />
                            </div>
                        </div>
                        <div className='reg'>
                            <p>Don't have account <span><Link to='/register'>Register now</Link></span></p>
                        </div>
                        <button type="submit" onClick={handleSubmit} className="btn btn-primary">
                            LOGIN
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;