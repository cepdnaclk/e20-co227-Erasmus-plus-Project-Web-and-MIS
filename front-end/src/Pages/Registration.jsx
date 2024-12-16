import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import style from "../components/Registration.module.css"; // Assuming you have CSS in place
import cylcleLogo from '../assets/CYCLE-logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import {domainName} from "../DomainName"

function Registration() {
  // State for form inputs
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
};

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare user data to send to backend
    const userData = {
      firstName,
      lastName,
      email,
      password,
    };

    try {
      // Send POST request to backend
      const response = await axios.post(`${domainName}/api/v1/registration`, userData);

      // Handle success (optional)
      if (response.status === 200) {
        alert("Registration successful!");
        navigate('/login');
      }
    } catch (error) {
      console.error("There was an error registering the user!", error);
      alert("Registration failed. Please try again.");
    }
  };


  return (
    <div className={style.registrationContainer}>
        <img src={cylcleLogo} alt="Cycle Logo" className={style["CycleLogo"]} />
      <form onSubmit={handleSubmit}>
        <div className={style.formGroup}>
          <label>First Name</label>
          <input
            type="text"
            placeholder="Enter First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className={style.formGroup}>
          <label>Last Name</label>
          <input
            type="text"
            placeholder="Enter Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div className={style.formGroup}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={style.formGroup}>
        <label>Password</label>
        <div className={style.inputGroup}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className={style.inputGroupAppend}>
                        <span className={style.inputGroupText} onClick={togglePasswordVisibility}>
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        </span>
            </div>
            </div>
        </div>
        <button type="submit" className={style.registerButton}>
          Register
        </button>
      </form>
    </div>
  );
}

export default Registration;
