import React, { useState } from "react";
import './Register.css';
import Axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [number, setNumber] = useState("");
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await Axios.post("https://jain-and-associates-backend.vercel.app/register", {
                name,
                location,
                number,
                email,
            });

            if (res.data.success) {
                navigate("/login");
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrorMessage("User already exists");
            } else {
                setErrorMessage("An error occurred while registering");
            }
        }
    };

    return (
        <div className="deg">
            <div class="container">
                <div class="title">Registration</div>
                <div class="content">
                    <form>
                        <div class="user-details">
                            <div class="input-box">
                                <span class="details">Name</span>
                                <input type="text" value={name}
                                    onChange={(e) => setName(e.target.value)} placeholder="Enter your name" required />
                            </div>
                            <div class="input-box">
                                <span class="details">Location</span>
                                <input type="text" value={location}
                                    onChange={(e) => setLocation(e.target.value)} placeholder="Enter site location" required />
                            </div>
                            <div class="input-box">
                                <span class="details">Mobile Number</span>
                                <input type="number" value={number}
                                    onChange={(e) => setNumber(e.target.value)} placeholder="Enter client mobile number" required />
                            </div>
                            <div class="input-box">
                                <span class="details">Email</span>
                                <input type="text" value={email}
                                    onChange={(e) => setEmail(e.target.value)} placeholder="Enter client mobile number" required />
                            </div>
                            {errorMessage && <div className="error">{errorMessage}</div>}
                            <button type="submit" onClick={handleSubmit} className="btn btn-primary">
                                REGISTER
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register;
