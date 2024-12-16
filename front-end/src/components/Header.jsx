import React, {useState, useEffect} from 'react';
import {Link, Outlet, useLocation,useNavigate} from 'react-router-dom';  
import axios from 'axios';
import Switch from "react-switch";
import cylcleLogo from '../assets/CYCLE-logo.png';
import erasmusLogo from '../assets/erasmus-plus-logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage, faBell, faAngleRight, faUser, faUserCircle, faFile,faCalendarDays,faBars } from '@fortawesome/free-solid-svg-icons';
import {domainName} from "../DomainName"
// Global user state
export let loggedInUser = { isLoggedIn: false, firstName: '', lastName: '' ,email:'',userID:'',userRole:'',isRegisteredUser:false,isAdmin:false};

function Header(){
    // State for hamburger menu
    const [menuOpen, setMenuOpen] = useState(false);

    // State for admin menu
    const [adminmenuOpen, setAdminMenuOpen] = useState(false);

   // State for login button visibility
    const [isVisible, setIsVisible] = useState(true);

    const [user, setUser] = useState(null);

    const [logout, setLogout] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showAccount, setShowAccount] = useState(false);
    const [loggedInUserState,setLoggedInUser] = useState(loggedInUser.isLoggedIn); // if a user has logged in

    useEffect(() => {
        axios.get(`${domainName}/user-info`, { withCredentials: true }) 
            .then(response => { 

                //getting google account info
                const userData = response.data;
                setUser(userData);
                loggedInUser = {
                    isLoggedIn: true,
                    firstName: userData.name,
                    lastName: '',  // Assuming Google doesn't provide the last name
                    email:userData.email,
                    profilePicture: userData.picture && <img src = {userData.picture} alt = 'User Profile' referrerPolicy="no-referrer"/>
                };
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            })
            .then(()=>{
                //fetching the database info, to see whether the logging-in-user is a registered-user
                // for a null email -> no need to check (when the website is loading)
                   if(loggedInUser.email!=""){

                       axios.post(`${domainName}/api/v1/users/getUserByEmail`,{
                           email:loggedInUser.email})
                       .then((res) => {  
                            // console.log(res.data)
                           //null reply -> not registered
                          if ( Object.keys(res.data).length == 0 ) {
                              setLoggedInUser(false);
                              logOut();
                              alert("You have to be a registered user to be logged in!");
                          } else { // if the user is a registered user
                              loggedInUser.userID=res.data.id
                              loggedInUser.userRole=res.data.appUserRole
                              loggedInUser.isRegisteredUser=true
                              loggedInUser.isAdmin = res.data.isAdmin
                              localStorage.setItem("loggedInUser",JSON.stringify(loggedInUser))
                              setLoggedInUser(true);  // Updates the logged-in state immediately
                              fetchNotifications();
                              window.Location.reload
                          }})
                  .catch((err) =>{
                      alert(err);
                  })
                   }
            })
    
    },[]);

        const fetchNotifications = async () => {
            try{
                const user =JSON.parse(localStorage.getItem("loggedInUser"))
                const response = await axios.get(`${domainName}/api/v1/notifications/${user.userID}`);
                setNotifications(response.data);
            } catch (error) {
                console.error('Error fetching notifications: ', error);
            }
        };

    //If an ADMIN needs to create a notification
    // Create a new notification
    const handleCreateNotification = async () => {
        try {
            const response = await axios.post(`${domainName}/api/v1/notifications`, newNotification, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                }
            });
            setNotifications((prevNotifications) => [...prevNotifications, response.data]);
            setNewNotification('');
        } catch (error) {
            console.error('Error creating notification:', error);
        }
    };

    // Get the current location
    const location = useLocation();
    //to navigate between pages
    const navigate = useNavigate();
    //Const for edit mode
    const [isEditMode, setIsEditMode] = useState(false);
        
    //Change the vie mode and the edit mode when the switch handle is toggled
    //Implement the edit mode of the website
    const handleToggle = (checked) => {
        setIsEditMode(checked);
        };
    
        // // Initialize the state with a function that reads from localStorage
        // const [isEditMode, setIsEditMode] = useState(() => {
        //     const savedEditModeValue = localStorage.getItem('isEditMode');
        // return savedEditModeValue !== null ? JSON.parse(savedEditModeValue) : false; // Default to false if no saved value
        // });
    
        // // Change the view mode and the edit mode when the switch handle is toggled
        // const handleToggle = () => {

        //     setIsEditMode(checked => ({
        //         isEditMode: !checked.isEditMode}));
        //     localStorage.setItem('isEditMode', JSON.stringify(isEditMode));
        //     console.log(JSON.parse(localStorage.getItem('isEditMode')));
        // };
        

    // set hamburger menu to close when a link is clicked
    const handleLinkClick = () => {
        setMenuOpen(false);
        setAdminMenuOpen(false);
        setIsVisible(false);
    }

    const googleLogin = async() => {
        // Redirect to the backend for Google login
        setIsVisible(false); 
        window.location.href = await `${domainName}/api/v1/oauth2/authorization/google`;
        //fetch user data from backend
    }        
    
    useEffect(() => {
        if (location.pathname === '/login' || loggedInUser.isLoggedIn) {
            setIsVisible(false);   
            if (loggedInUser.isLoggedIn) {
                setLoggedInUser(true)
            }            
        } 
        else {
            setIsVisible(true);
            localStorage.removeItem("loggedInUser",JSON.stringify(loggedInUser))

        }
    })

    function logOut(){
        axios.get(`${domainName}/logout`, { withCredentials: true })
        .then(() => {
            // Clear any frontend user state
            loggedInUser = { isLoggedIn: false, firstName: '', lastName: '',email:'',userID:'' ,userRole:'',isRegisteredUser:false,isAdmin:false};

            setLoggedInUser(false);

            window.location.reload
            navigate('/')
            setShowAccount(false);
        })
        .catch(error => {
            console.error('Error during logout:', error);
        });
    }
    /************************** AI Assist ******************************/
    const [isChatLoaded, setChatLoaded] = useState(false);
    const [isChatVisible, setChatVisible] = useState(false);

//Function to load the Tawk.to script
const loadTawkTo = () => {
    if (!isChatLoaded) {
        var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
        var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
        s1.async = true;
        s1.src = 'https://embed.tawk.to/66bc3bda0cca4f8a7a75ac8b/1i57kjjg7';
        s1.charset = 'UTF-8';
        s1.setAttribute('crossorigin', 'anonymous');
        s0.parentNode.insertBefore(s1, s0);

        // Hide the default Tawk.to button once the script has loaded
        Tawk_API.onLoad = function() {
            Tawk_API.hideWidget(); // Initially hide the widget
        };

        setChatLoaded(true); // Mark the chat as loaded
    }
};
// Function to toggle the visibility of the chat
const toggleChat = () => {
    loadTawkTo();
    if (isChatLoaded && Tawk_API) {
        if (isChatVisible) {
            Tawk_API.hideWidget(); // Hide the chat widget
        } else {
            Tawk_API.showWidget(); // Show the chat widget
            Tawk_API.maximize();   // Optionally, open the chat window
        }
        setChatVisible(!isChatVisible); // Toggle the visibility state
    }
};
/********************************************************/

    // functions for the visibility of notifications and account info
    function showAccountInterface(){
        setShowAccount(previousShowAccount=>!previousShowAccount)        
        setShowNotifications(false);
    }

    function showNotificationInterface(){
        setShowAccount(false);
        setShowNotifications(previousShowNotifications=>!previousShowNotifications)       
    }

  // Function to close the sidebar when clicking outside of it
function closeOnClickOutside(selector, toggleClass) {
    document.addEventListener('click', function(event) {
      const element = document.querySelector(selector);
      const isClickInside = element.contains(event.target);
      const isClickOnToggleButton = event.target.closest('.adminNavBarRight li'); // Update with the toggle button selector
  
      if (!isClickInside && !isClickOnToggleButton) {
        element.classList.add(toggleClass); // Add the class to hide the element
      }
    });
  }
  
  // Call the function for the notification and message boxes
  useEffect(() => {
    closeOnClickOutside('.sideBarNotifications-Open', 'sideBar-Close');
    closeOnClickOutside('.sideBarMessages-Open', 'sideBar-Close');
    closeOnClickOutside('.userAccount-Open', 'userAccount-Close');
}, []);

/* NOTIFICATIONS */
/* Rendering Notifications */
const renderNotifications = () => {
    if (notifications.length === 0) {
        return <p>No new notifications.</p>;
    }
    
    // Sort notifications by time (assuming notification.time is a date/time string)
    const sortedNotifications = [...notifications].sort((a, b) => new Date(b.time) - new Date(a.time))
    .reverse();

    /* Handle notification click based on notification type
       Here navigation to a URL and Deletion of notification will occur*/
    const handleNotificationClick =async (notification) => {
        try{
        //Navigating to a URL
        let url = '/'; // Default URL

        switch (notification.notificationType) {
            case 'typeTask':
                url = '/admin/dashboard';
                break;
            case 'typeDeliverable':
                url = '/project overview/deliverables';
                break;
            case 'typeFile':
                url = '/downloads';
                break;
            case 'typeGallery':
                url = '/news & events/gallery';
                break;
            case 'typeNews':
                url = '/news & events/news';
                break;
            case 'typeProjectSummary':
                url = '/';
                break;
            case 'typeWorkplan':
                url = '/project overview/workplan';
                break;
            default:
                url = '/';
        }
        navigate(url);
        setShowNotifications(false);

        // Notification Deletion
        await axios.delete(`${domainName}/api/v1/notifications/${notification.id}`);
        setNotifications((prevNotifications) =>
            prevNotifications.filter((n) => n.id !== notification.id)
    );
    } catch (error) {
        console.error('Error deleting notification:', error)
    }
};

    return showNotifications && (
        <div className="notifications-dropdown">
            <ul>
            {sortedNotifications.map(notification => {
                // Parse the timestamp into a Date object
                const date = new Date(notification.timestamp);
                const formattedDate = date.toLocaleDateString(); // Format date as 'MM/DD/YYYY' (or as per your locale)
                const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Format time as 'HH:MM AM/PM'

                return (
                    <li key={notification.id} onClick={() => handleNotificationClick(notification)} className="notification-item">
                        <div className="notification-date">
                            {formattedDate}
                        </div>
                        <p className="notification-message">{notification.message}</p>
                        <span className="notification-time">
                            {formattedTime}
                        </span>
                    </li>
                );
            })}
            </ul>
        </div>
    )
};

    return(
        <header>
            {/* Navigation bar */}
            <nav className = "headerNavBar">
                <Link to = '/'></Link>

                {/* Hamburger menu */}
                <div className='menu' onClick={() => 
                    setMenuOpen(!menuOpen)
                }>
                <FontAwesomeIcon icon={faBars} />   
                </div>

                <ul className= {`headerNavBarRight ${menuOpen ? "open" : ""}`}>

                    <li><Link to = '/' onClick={handleLinkClick}>Home</Link></li>
                                  
                    <li className = "headerDropDown">
                    <Link to = '#'>Project Overview &nbsp; &nbsp; &#x25BC;</Link>
                        <div className = "dropdown-content">
                            <Link to = '/project overview/overview' onClick={handleLinkClick}>Overview</Link>
                            <Link to = '/project overview/workplan' onClick={handleLinkClick}>Cycle Workplan</Link>
                            <Link to = '/project overview/deliverables' onClick={handleLinkClick}>Deliverables</Link>
                        </div>
                        </li>
                    <li><Link to = '/team' onClick={handleLinkClick}>Team</Link></li>
                    <li className = "headerDropDown">
                    <Link to = '#'>News & Events &nbsp; &nbsp; &#x25BC;</Link>
                        <div className = "dropdown-content">
                            <Link to = '/news & events/news' onClick={handleLinkClick}>News & Events</Link>
                            <Link to = '/news & events/gallery' onClick={handleLinkClick}>Gallery</Link>
                        </div>
                    </li>
                    <li><Link to = '/downloads' onClick={handleLinkClick}>Downloads</Link></li>
                    <li><Link to = '/contact' onClick={handleLinkClick}>Contact</Link></li>
                </ul>
            </nav>

            {/* Top Navigation Bar for Administration  */}
            <div>
                <nav class="adminNavBar" > 

                {loggedInUserState && (
                    <div className='adminmenu' style={{ marginLeft: '51px' }} onClick={() => 
                        setAdminMenuOpen(!adminmenuOpen)
                        }>
                        <FontAwesomeIcon icon={faBars} />   
                    </div>
                )} 
                <ul className= {`headerNavBarLeft ${adminmenuOpen ? "open" : ""}`}>
                    {/* Display Admin Nav Bar Left List Items here only if min-width: 968px and the user has logged in*/}
                    {loggedInUserState && <li className='adminNavBarLeftListItem'><Link to = '/admin/dashboard'>DASHBOARD</Link></li>}
                    {loggedInUserState && <li className='adminNavBarLeftListItem'><Link to = '/admin/project management'>PROJECT MANAGEMENT</Link></li>}
                    {loggedInUserState && <li className='adminNavBarLeftListItem'><Link to = '/admin/repository'>REPOSITORY</Link></li>}
                </ul>             
                {isVisible && <div className='top-login-bar'><button className="Login-button" onClick={googleLogin}>LOGIN</button></div>}
                    <div >
                        <ul className={loggedInUserState ? "adminNavBarRight":"non-logged-user-panel"}>                  
                            <span id="switchLabel">{isEditMode ? "Edit Mode" : "View Mode"}</span>
                            <li><Switch 
                                        onChange={handleToggle} 
                                        checked={isEditMode} 
                                        offColor="#888"
                                        onColor="#324e94"
                                        uncheckedIcon={false}
                                        checkedIcon={false}
                                        activeBoxShadow ={null}
                                        height={18}
                                        width={30}                                    
                                />                       
                            
                            </li>                                            
                            <li onClick={toggleChat}><FontAwesomeIcon icon={faMessage}/></li>
                            <li onClick={showNotificationInterface}>
                                <FontAwesomeIcon icon={faBell}/>
                                {notifications.length > 0 && <span className="notification-count">{notifications.length}</span>}
                            </li>
                            <li onClick={showAccountInterface}>
                                {loggedInUser.profilePicture ? (
                                    <img 
                                        src={loggedInUser.profilePicture.props.src} 
                                        alt="User Profile" 
                                        style={{ 
                                        width: '30px', 
                                        height: '30px', 
                                        borderRadius: '50%', 
                                        marginRight: '10px'
                                        }} 
                                    referrerPolicy="no-referrer" 
                                    />
                                ) : (
                            <FontAwesomeIcon icon={faUserCircle} size="lg" />
                                )}
                        </li>
                        </ul>                              
                    </div>                 
                                
                </nav>

                {/* User Account Dropdown Menu */}
                <div class= {showAccount ? "userAccount-Open" : "userAccount-Close"}>
                            
                <div className="userAccountInfo">
                    {/* Display profile picture if available */}
                    {loggedInUser.profilePicture ? (
                        <img 
                            src={loggedInUser.profilePicture.props.src} 
                            alt="User Profile" 
                            style={{ 
                                width: '50px', 
                                height: '50px', 
                                borderRadius: '50%', 
                                borderColor: '#0f172a',
                                borderWidth: '1px',
                                marginRight: '10px' 
                            }} 
                            referrerPolicy="no-referrer" 
                        />
                    ) : (
                        <FontAwesomeIcon icon={faUserCircle} size="3x" style={{ marginRight: '10px' }} />
                    )}
    
                    {/* Display user name */}
                    <h3>{loggedInUser.firstName} {loggedInUser.lastName}</h3>
                </div>

                    
                    <hr></hr>
                    <Link to = '/profile' onClick={handleLinkClick} className="userAccountContent">                             
                        <FontAwesomeIcon icon={faUser} className="icon" />
                        <p>Profile</p>    
                        <span><FontAwesomeIcon icon={faAngleRight}/></span>                         
                    </Link> 
                    <Link to = '/myfiles' onClick={handleLinkClick} className="userAccountContent">    
                        <FontAwesomeIcon icon={faFile} className="icon"/>                            
                        <p>My Files</p>    
                        <span><FontAwesomeIcon icon={faAngleRight}/></span>                         
                    </Link>
                    <Link to = '/calendar' onClick={handleLinkClick} className="userAccountContent"> 
                        <FontAwesomeIcon icon={faCalendarDays} className="icon"/>                            
                        <p>Calendar</p>    
                        <span><FontAwesomeIcon icon={faAngleRight}/></span>                         
                    </Link>
                    <hr></hr>
                    <a herf="#" className="userAccountContent" id="logoutText" onClick={logOut}>                              
                        <p>Log Out</p>                        
                    </a>                           
                            
                </div>

                {/* Side Bar - Notifications */}
                <div class= {showNotifications ? "sideBarNotifications-Open" : "sideBar-Close"}>
                            
                    <div className="siderBarTitle">
                        <h3>Notifications</h3>
                    </div>
                    <hr></hr>                       
                    {/* Notifications Dropdown */}
                    <div className='notifications-container'>
                        {renderNotifications()} 
                    </div>
                </div>
            </div>

            <div className='logo-blockFull'>
                <div className='logo-block'>
                    {/* Erasmus logo */}
                    <div className='logo-block-grid-item'>
                        <a href = "https://erasmus-plus.ec.europa.eu/" target="_blank"><img src={erasmusLogo} alt="Erasmus+ Logo" className="Erasmus-plus-Logo"></img></a>
                    </div>
                    <div className='logo-block-grid-item'>
                        {/* Main heading */}
                        <h1><span style={{ color:'rgb(50, 78, 148)'}}>ERASMUS+</span> <span style={{ color:'rgba(44, 110, 11, 0.634)'}}>CYCLE</span></h1>
                    
                        {/* Sub heading */}
                        <h2><span style={{ color:'rgb(50, 78, 148)'}}>CYberseCurityLEarning: Master's degree in Cyber security</span></h2>
                    </div>
                    <div className='logo-block-grid-item'>
                        {/* Cycle logo */}
                        <img src={cylcleLogo} alt="Cycle Logo" className="Cycle-Logo"></img>
                    </div>
                </div>
            </div>
            
        </header>
    );
}

export default Header;
