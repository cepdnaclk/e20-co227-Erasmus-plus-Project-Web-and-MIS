import React, { useState } from 'react';
import DrUpulJayasinghe from '../assets/upul-jayasinghe.jpg';
import DrErunikaDayaratna from '../assets/erunika-dayaratna.jpg';
import contactImg from '../assets/contactImg.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPhone, faEnvelope} from '@fortawesome/free-solid-svg-icons';
import style from "../components/Contact.module.css";
/*Contact Page*/ 
function Contact() {
  
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailError, setEmailError] = useState('');

  const verifyEmail = async (email) => {
    try {
      const apiKey = "fb9d8901765dc9a5dc43042de370306046a2c366";
      const response = await fetch(
        `https://api.hunter.io/v2/email-verifier?email=${encodeURIComponent(email)}&api_key=${apiKey}`
      );
      const data = await response.json();
  
      if (data.data.status === "valid") {
        setEmailError(''); 
        return true;
      } else {
        setEmailError("The email address does not appear to be valid or existing.");
        return false;
      }
    } catch (error) {
      setEmailError("An error occurred while verifying the email.");
      console.error("Email verification error:", error);
      return false;
    }
  };
  

  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get("user_email");
  
    // Verify email and get the result directly
    const isEmailValid = await verifyEmail(email);
  
    if (!isEmailValid) {
      return; // Prevent form submission if email is not valid
    }
  
    formData.append("access_key", "dffdc218-3fd5-4ce9-b477-b1cae0107eb0");
  
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);
  
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: json,
    }).then((res) => res.json());
  
    if (res.success) {
      alert("Email sent successfully!");
      event.target.reset(); // Clear the form fields
    } else {
      alert("Failed to send email. Please try again.");
    }
  };
  

  return(
    <>
    <div className = "pageTitle"> 
    <h3>Contact</h3>
    <nav>
    <ol className="breadcrumb">
      <li className="breadcrumb-item">
        <a href="http://localhost:5173/"> 
          <span style={{ fontSize: 16}}>Home</span>
        </a>
      </li>
      <li className="breadcrumb-item active">
        <span style={{ fontSize: 16}}> Contact</span>
      </li>
    </ol>
  </nav>
    </div>

    <div className = {style["contactpage"]}>

    <div className = {style["contactDetails"]}>
    {/* Image and the contact details of the Project manager */}
    <div className = {style["contactManagerCoordinator"]}> 
      <img className = {style["Dr-Upul-Jayasinghe-img"]} src={DrUpulJayasinghe} alt="DrUpulJayasinghe" /> 
      <div className = {style["contactMCDetails"]}>
        <h3>Dr. Upul Jayasinghe</h3>
        <h4>Manager</h4>
        <p>Telephone Number: <a href="tel:+94760416590">+94 76 0416 590</a></p>
        <p>Email Address: <a href="mailto:upuljm@eng.pdn.ac.lk">upuljm@eng.pdn.ac.lk</a></p>
        <a href="https://people.ce.pdn.ac.lk/staff/academic/upul/"><FontAwesomeIcon className = {style["contactIcons"]} icon={faUser} /></a>
        <a href="tel:+94760416590"><FontAwesomeIcon className = {style["contactIcons"]} icon={faPhone} /></a>
        <a href="mailto:upuljm@eng.pdn.ac.lk"><FontAwesomeIcon className = {style["contactIcons"]} icon={faEnvelope} /></a>
      </div>

    </div>

    {/* Image and the contact details of the Project coordinator */}
    <div className = {style["contactManagerCoordinator"]}>
      <img  className = {style["Dr-Erunika-Dayaratna-img"]} src={DrErunikaDayaratna} alt="DrErunikaDayaratna" />
      <div className = {style["contactMCDetails"]}>
        <h3>Dr. Erunika Dayaratna</h3>
        <h4>Coordinator</h4>
        <p>Telephone Number: <a href="tel:+94766986500">+94 76 698 6500</a></p>
        <p>Email Address: <a href="mailto:dayaratna@sci.pdn.ac.lk">dayaratna@sci.pdn.ac.lk</a></p>
        <a href="https://sci.pdn.ac.lk/scs/staff/Erunika-Dayaratna"><FontAwesomeIcon className = {style["contactIcons"]} icon={faUser} /></a>
        <a href="tel:+94766986500"><FontAwesomeIcon className = {style["contactIcons"]} icon={faPhone} /></a>
        <a href="mailto:dayaratna@sci.pdn.ac.lk"><FontAwesomeIcon className = {style["contactIcons"]} icon={faEnvelope} /></a>
      </div>
    </div>
    </div>


    {/* Contact Us form */}
    <div className = {style["ContactUsTitle"]}>
      <h3>Contact Us</h3>
      <p className = {style["ContactUsSubTitle"]}>For inquiries or support, contact us and we'll respond promptly</p>
    </div>

    <div className = {style["contactUsForm"]}>
      <img className = {style["contactImg"]} src={contactImg} alt="contactImg" /> 
      <form onSubmit={onSubmit}>
        
        <div className = {style["inputbox"]}>
        <label>Full Name</label>
        <input type = "text" className = {style["field"]} placeholder = "Enter your Full Name" name = "user_name" required/>
        </div>

        <div className = {style["inputbox"]}>
        <label>Email Address</label>
        <input type = "email" className = {style["field"]} placeholder = "Enter your Email address" name = "user_email" required
            title="Please enter a valid email address"/>
            {emailError && <p style={{ color: 'red' , fontSize: 12 }}>{emailError}</p>}
        </div>

        <div className = {style["inputbox"]}>
        <label>Subject</label>
        <input type = "text" className = {style["field"]} placeholder = "Enter the Subject" name = "subject" required/>
        </div>
        <div className = {style["inputbox"]}>
        <label>Your Message</label>
        <textarea name = "message" id = "" className = {style["field-mess"]} placeholder = "Enter your message" required></textarea>
        </div>
        <button type = "submit" className = {style["contactButton"]}>Send Message</button>
      </form>

    </div>
    </div>
    </>
  );
}

export default Contact;

