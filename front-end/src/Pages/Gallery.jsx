import React, { useEffect, useState } from "react";
import axios from "axios";
import { loggedInUser } from '../components/Header'; // Import logged-in user details
import style from '../components/Gallery.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // FontAwesome for icons
import { faTrash } from '@fortawesome/free-solid-svg-icons'; // Import necessary icons
import { Dialog, DialogContent } from "@mui/material";
import {domainName} from "../DomainName"

/**
 * Fetch gallery items from the backend API.
 * Fetches the list of albums from the gallery API endpoint.
 * The results are sorted in descending order based on albumID.
 */
const fetchGallery = async () => {
  try {
    const response = await axios.get(`${domainName}/api/v1/gallery`);
    return response.data.sort((a, b) => b.albumID - a.albumID); // albumID not albumId
  } catch (error) {
    console.error('Error fetching gallery:', error); 
    return [];
  }
};

/**
 * Gallery component for displaying a list of albums and providing functionality for adding, viewing, editing, and deleting items.
 */
const Gallery = () => {
  const [gallery, setGallery] = useState([]); 
  const [showForm, setShowForm] = useState(false); 
  const [file, setFile] = useState(null); 

   // Fetch and load the gallery when the component is first rendered
  useEffect(() => {
    const getGallery = async () => {
      const latestGallery = await fetchGallery(); 
      setGallery(latestGallery); 
    };

    getGallery(); 
  }, []); 

  const [showDiologBox, setshowDiologBox] = useState(false);

  const onAddNewClicked=()=>{
    setshowDiologBox(true);
  }

  // Handles file input change (for album cover image)
  const handleFileChange = (event) => {
    setFile(event.target.files[0]); 
  };

   /**
   * Handles form submission to add a new gallery item.
   * Sends the form data (album name, URL, cover image) to the backend.
   */
  const handleSubmit = async (event) => {
    event.preventDefault(); 
    const form = event.target;

       // Create a new FormData object to submit the form data
    const formData = new FormData();
    formData.append('albumName', form.albumName.value);
    formData.append('albumURL', form.albumURL.value);
    formData.append('albumCoverImage', file); 
    formData.append('albumCreatedBy', loggedInUser.username); // Pass logged-in user as the creator

    try {
      const response = await axios.post(`${domainName}/api/v1/gallery`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Fetch the updated gallery list after adding the item
      const latestGallery = await fetchGallery(); 
      setGallery(latestGallery); 
      setshowDiologBox(false);
      alert('Album Successfully Added!');
    } catch (error) {
      console.error('Error adding gallery item:', error); 
    }
  };

   /**
   * Handles the deletion of a gallery item by albumID.
   * Sends a DELETE request to remove the item from the backend.
   */
  const onDeleteClick = async (albumID) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this album?');
    if (!confirmDelete) return;
    try {
      await axios.delete(`${domainName}/api/v1/gallery/${albumID}`);
      const latestGallery = await fetchGallery();
      setGallery(latestGallery);
      alert('Album deleted successfully');
    } catch (error) {
      console.error("Error deleting gallery item:", error); 
      alert("Failed to delete album!");
    }
  }
  // When 'Close' button is clicked: for Edit, and Add New
  const closeButtonClicked = () => {
    setshowDiologBox(false);
  }

  return (
    <>
    {/* Breadcrumb navigation for the page */}
      <div className="pageTitle">
        <h3>Gallery</h3>
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
              <span style={{ fontSize: 16}}> Gallery</span>
            </li>
          </ol>
        </nav>
        </div>

        {/* Form toggle button for adding a new gallery item */}
        <div className={style["container"]}>
        {loggedInUser.isLoggedIn && (
          <div>
            <button className="addNewButton" onClick={onAddNewClicked}>Add Album</button>
          </div>
        )}

        {/* Display the form when showDiologBox is true */}
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
                  <h2>Add Gallery Item</h2>
                </div>
                <div className="inputbox">
                  <label htmlFor="albumName">Name</label>
                  <input type="text" placeholder="Enter Album Name" id="albumName" name="albumName" className = "field" required />
                </div>
                <div className="inputbox">
                  <label htmlFor="albumURL">URL</label>
                  <input type="url" id="albumURL" placeholder="Enter Album URL" name="albumURL" className = "field" required />
                </div>
                <div className="inputbox">
                  <label htmlFor="albumCoverImage">Cover Image</label>
                  <input type="file" id="albumCoverImage" name="albumCoverImage" onChange={handleFileChange} className = "field" required />
                </div>
                <div className = "buttonsBlock">
                  <button type="submit">Add Gallery Item</button>
                  <button type="button" onClick={closeButtonClicked}>Close</button>
                </div>
              </form>
            </div>      
          
      </DialogContent>
      </Dialog>}
      
      {/* Display the gallery items */}
      <div className={style["gallery-container"]}>
        {gallery.map((item) => (
          <div key={item.albumID} className={style["gallery-tile"]}>
            <img 
              src={`data:image/jpeg;base64,${item.albumCoverImage}`} 
              alt={item.albumName} 
            />
            <h2>{item.albumName}</h2>
            <a href={item.albumURL} target="_blank" rel="noopener noreferrer">Click here for more images</a>
            
            {/* Show edit, view, and delete buttons for logged-in users */}
            {loggedInUser.isLoggedIn && (
              <div className={style["gallery-actions"]}>
                <button className="actionButton" onClick={() => onDeleteClick(item.albumID)}><FontAwesomeIcon icon={faTrash} /></button>
              </div>
            )}
          </div>
        ))}
      </div></div>
    </>
  );
};

export { fetchGallery };
export default Gallery;
