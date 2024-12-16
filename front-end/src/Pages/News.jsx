import React, { useEffect, useState } from "react";
import axios from "axios";
import { loggedInUser } from '../components/Header'; // Import logged-in user details
import style from '../components/News.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // FontAwesome for icons
import { faTrash } from '@fortawesome/free-solid-svg-icons'; // Import necessary icons
import { Dialog, DialogContent } from "@mui/material";
import {domainName} from "../DomainName"

var today = new Date().toISOString().split('T')[0]
// Function to fetch news from the API, sorted by newsID in descending order
const fetchNews = async () => {
  try {
    const response = await axios.get(`${domainName}/api/v1/news`); // Fetch news from backend
    return response.data.sort((a, b) => b.newsID - a.newsID); // Sort news by most recent (highest ID first)
  } catch (error) {
    console.error('Error fetching news:', error); 
    return []; // Return empty array if there's an error
  }
};

const News = () => {
  const [news, setNews] = useState([]); // State to hold the list of news
  const [showDiologBox, setshowDiologBox] = useState(false); // Dialog Box
  const [file, setFile] = useState(null); // State to hold the selected image file

  // useEffect to fetch news when the component mounts
  useEffect(() => {
    const getNews = async () => {
      const latestNews = await fetchNews(); // Fetch latest news
      setNews(latestNews); // Set the fetched news in the state
    };

    getNews(); // Call the function to fetch news
  }, []); // Empty dependency array means this runs only on the initial render

  const onAddNewClicked=()=>{
    setshowDiologBox(true);
  }

  // Function to handle file selection
  const handleFileChange = (event) => {
    setFile(event.target.files[0]); // Set the selected file in state
  };

  // Function to handle the form submission for adding news
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    const form = event.target;

    // Create FormData to send the image file and other data
    const formData = new FormData();
    formData.append('newsTitle', form.newsTitle.value);
    formData.append('newsDescription', form.newsDescription.value);
    formData.append('newsUrl', form.newsUrl.value);
    formData.append('newsAuthor', form.newsAuthor.value);
    formData.append('newsDate', form.newsDate.value);
    formData.append('newsCoverImage', file); // Append the image file

    // Send POST request to backend to add news
    try {
      const response = await axios.post(`${domainName}/api/v1/news`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setshowDiologBox(false);
      const latestNews = await fetchNews(); // Fetch the latest news
      setNews(latestNews); // Update the news list with the new entry
      alert('News Successfully Added!');
    } catch (error) {
      console.error('Error adding news:', error); // Log any errors
    }
  };

  // Function to handle news deletion
  const onDeleteClick = async (newsID) => {
    console.log("Delete button clicked");
    console.log(newsID); // Log the newsID for debugging
    const confirmDelete = window.confirm('Are you sure you want to delete this news?');
    if (!confirmDelete) return;
    try {
<<<<<<< Updated upstream
      await axios.delete(`http://localhost:8080/api/v1/news/${newsID}`); // Send DELETE request
=======
      await axios.delete(`${domainName}/api/v1/news/${newsID}`); // Send DELETE request
      
>>>>>>> Stashed changes
      // Fetch the updated list of news and update the state
      const latestNews = await fetchNews();
      setNews(latestNews);
      alert('News deleted successfully');
    } catch (error) {
      console.error("Error deleting news:", error); // Log any errors
      alert("Failed to delete news!");
    }
  }
    // When 'Close' button is clicked: for Edit, and Add New
    const closeButtonClicked = () => {
      setshowDiologBox(false);
    }
  

  return (
    <>
      <div className="pageTitle">
        <h3>News</h3>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="http://localhost:5173/"> 
                <span style={{ fontSize: 16}}>Home</span>
              </a>
            </li>
            <li className="breadcrumb-item active">
              <span style={{ fontSize: 16}}> News & Events</span>
            </li>
            <li className="breadcrumb-item active">
              <span style={{ fontSize: 16}}> News</span>
            </li>
          </ol>
        </nav>
      </div>

      <div className={style["NewsAdd"]}>
        {/* Show Add News button only if the user is logged in */}
        {loggedInUser.isLoggedIn && (
          <div>
            <button className="addNewButton" onClick={onAddNewClicked}>Add News</button>
          </div>
        )}
        
        {/* Display the form when showForm is true */}
        {showDiologBox && 
          <Dialog
            open={showDiologBox}
            onClose={closeButtonClicked}
            fullWidth
            maxWidth="md"
          >
          <DialogContent>
          <div className = "dataForm"> 
              <form onSubmit={handleSubmit}>
                <div className="formTitle">
                  <h2>Add News</h2>
                </div>
                <div className="inputbox">
                  <label htmlFor="newsTitle">Title</label>
                  <input type="text" placeholder="Enter News Title" id="newsTitle" name="newsTitle" className="field" required />
                </div>
                <div className="inputbox">
                  <label htmlFor="newsDescription">Description</label>
                  <textarea id="newsDescription" placeholder="Enter News Description" name="newsDescription" className="field" required></textarea>
                </div>
                <div className="inputbox">
                  <label htmlFor="newsUrl">URL</label>
                  <input type="url" id="newsUrl" placeholder="Enter News URL" name="newsUrl" className="field" required />
                </div>
                <div className="inputbox">
                  <label htmlFor="newsAuthor">Author</label>
                  <input type="text" id="newsAuthor" placeholder="Enter Author's name" name="newsAuthor" className="field" required />
                </div>
                <div className="inputbox">
                  <label htmlFor="newsDate">Date</label>
                  <input type="date" max={today} id="newsDate" name="newsDate" className="field" required />
                </div>
                <div className="inputbox">
                  <label htmlFor="newsCoverImage">Cover Image</label>
                  <input type="file" id="newsCoverImage" name="newsCoverImage" onChange={handleFileChange} className="field" required />
                </div>
                <div className = "buttonsBlock">
                  <button type="submit">Add News</button>
                  <button type="button" onClick={closeButtonClicked}>Close</button>
                </div>
              </form>
          </div>
          </DialogContent>
          </Dialog>}
      

      
      {/* Display news items */}
      <div className={style["news-container"]}>
        {news.map((item) => (
          <div key={item.newsID} className={style["news-tile"]}>
            <img src={`data:image/jpeg;base64,${item.newsCoverImage}`} alt={item.newsTitle} />
            <h2>{item.newsTitle}</h2> {/* News title */}
            <p>{item.newsDescription}</p> {/* News description */}
            <div className={style["date-and-author"]}>
              <b><p>Date: {item.newsDate}</p></b> {/* News date */}
              <b><p>Author: {item.newsAuthor}</p></b> {/* News author */}
              <a href={item.newsUrl} target="_blank" rel="noopener noreferrer">More...</a> {/* Link to full news */}
            </div>
            {/* Show edit and delete buttons only if user is logged in */}
            {loggedInUser.isLoggedIn && (
              <div className={style["news-actions"]}>
                <button className="actionButton" onClick={() => onDeleteClick(item.newsID)}><FontAwesomeIcon icon={faTrash} /></button>
              </div>
            )}
          </div>
        ))}
      </div>
      </div>
    </>
  );
};

export { fetchNews };
export default News;
