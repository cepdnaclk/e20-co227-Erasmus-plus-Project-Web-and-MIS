/*Not in use now*/

import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import style from '../components/Login.module.css';
import cylcleLogo from '../assets/CYCLE-logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import {domainName} from "../DomainName"


export let appUserRole = "";
export let userID = 0;

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    
    async function login(event) {
        event.preventDefault();
        try {
            await axios.post(`${domainName}/api/v1/registration/login`, {
                email: email,
                password: password,
            }).then((res) => {
                console.log(res.data);

                if (res.data.message === "Email does not exist") {
                    alert("Not a registered user. Email not found");
                } else if (res.data.message === "Login Success") {
                    loggedInUser = {
                        isLoggedIn: true,
                        firstName: res.data.firstName,
                        lastName: res.data.lastName
                    };
                    userID = res.data.userID;
                    if (res.data.userRole === "[USER]") {
                        appUserRole = "USER";
                    } else if (res.data.userRole === "[ADMIN]") {
                        appUserRole = "ADMIN";
                    }
                    navigate('/');
                } else {
                    alert("Login Failed! Password does not match!");
                }
            });
        } catch (err) {
            alert(err);
        }
    }

    const handleRegister = () => {
        navigate('/registration'); 
    };

    
    const googleLogin = () => {
        // Redirect to the backend for Google login
        window.location.href = `${domainName}/oauth2/authorization/google`;
    }

    return (
        <div className={style["LoginCard"]}>
            <img src={cylcleLogo} alt="Cycle Logo" className={style["CycleLogo"]} />
            <form onSubmit={login}>
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Enter Email"
                        // value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />
                </div>

                <div className={style["input-group"]}>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter Password"
                        // value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                    />
                    <div className={style["input-group-append"]}>
                        <span className={style["input-group-text"]} onClick={togglePasswordVisibility}>
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        </span>
                    </div>
                </div>

                <button type="submit">Login</button>

                {/* Register now link */}
                <p className={style["register-link"]}>
                    Don't have an account? 
                    <button type="button" className="btn btn-link" onClick={handleRegister}>Register Now</button>
                </p>
            </form>

            <button onClick={googleLogin} className={style["google-login-button"]}>
                Login with Google
            </button>
        </div>
    );
}

export default Login;
