import React, { useState, useEffect } from 'react';
import axios from 'axios';
import fileDownload from '../assets/download.png';
import { loggedInUser } from '../components/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload ,faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import { Dialog, DialogContent } from "@mui/material";
import style from '../components/Download.module.css';
import {domainName} from "../DomainName"

const FileUploadDownload = () => {
  // State management
  const [selectedFile, setSelectedFile] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [visibleToAll, setVisibleToAll] = useState(false);
  const [youtubeLink, setYoutubeLink] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [showDiologBox, setshowDiologBox] = useState(false);

// Fetch the uploaded files from the backend when the component mounts
  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  // Fetches uploaded files from the backend API
  const fetchUploadedFiles = async () => {
    try {
      const response = await axios.get(`${domainName}/api/v1/files`);
      setUploadedFiles(response.data);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const onAddNewClicked=()=>{
    setshowDiologBox(true);
  }
  
    // Handler for selecting a file
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

   // Handler for setting the display name of the file
  const handleDisplayNameChange = (event) => {
    setDisplayName(event.target.value);
  };

  // Handler for changing the visibility setting (public/private)
  const handleVisibilityChange = (event) => {
    setVisibleToAll(event.target.checked);
  };

  // Handler for inputting YouTube link instead of a file
  const handleYoutubeLinkChange = (event) => {
    setYoutubeLink(event.target.value);
  };

  // Handles file upload or YouTube link submission
  const handleUpload = async () => {
    event.preventDefault();
    console.log("handleUpload function executed");
    // Ensure either a file or a YouTube link is provided
    if (!selectedFile && !youtubeLink) {
      alert('Please select a file or enter a URL for the file!');
      return;
    }

    // If a file is uploaded, a display name is required
    if (selectedFile && !displayName) {
      alert('Please enter a display name!');
      return;
    }

    // Prepare the form data for file or YouTube link
    const formData = new FormData();
    if (selectedFile) {
      console.log("File Selected");
      formData.append('file', selectedFile);
      formData.append('displayName', displayName);
      formData.append('visibleToAll', visibleToAll);
    } else if (youtubeLink) {
      console.log("Link Entered");
      formData.append('youtubeLink', youtubeLink);
      formData.append('displayName', displayName);
      formData.append('visibleToAll', visibleToAll);
    }

    // Upload file or link to the backend
    try {
      const response = await axios.post(`${domainName}/api/v1/files/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        console.log("HTTP Status 200 OK");
        alert('Content uploaded successfully');
        setSelectedFile(null);
        setYoutubeLink('');
        setDisplayName('');
        setVisibleToAll(false);
        setshowDiologBox(false);
        fetchUploadedFiles();
      } else {
        console.log("FAILED HTTP Status 200 OK");
        alert('Failed to upload content');
      }
    } catch (error) {
      console.error('There was an error uploading the content!', error);
      alert('Upload failed. Please try again.');
    }
  };

  // Handles file download
  const handleDownload = async (fileId, fileName) => {
    try {
      const response = await axios.get(`${domainName}/api/v1/files/${fileId}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('There was an error downloading the file!', error);
      setErrorMessage('File download failed. Please try again.');
    }
  };

  // Handles file deletion
  const handleDelete = async (fileId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this file?');
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`${domainName}/api/v1/files/${fileId}`);
      if (response.status === 200) {
        alert('File deleted successfully');
        fetchUploadedFiles();
      } else {
        alert('Failed to delete file');
      }
    } catch (error) {
      console.error('There was an error deleting the file!', error);
      setErrorMessage('File deletion failed. Please try again.');
    }
  };

  // When 'Close' button is clicked: for Edit, and Add New
  const closeButtonClicked = () => {
    setshowDiologBox(false);
  }
  // Filter files into two groups: visible to all and visible to logged-in users only
  const visibleToAllFiles = uploadedFiles.filter(file => file.visibleToAll);
  const visibleToLoggedInFiles = uploadedFiles.filter(file => !file.visibleToAll && loggedInUser.isLoggedIn);

  return (
    <div>
      <div className="pageTitle">
        <h3>Downloads</h3>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="http://localhost:5173/">
                <span style={{ fontSize: 16 }}>Home</span>
              </a>
            </li>
            <li className="breadcrumb-item active">
              <span style={{ fontSize: 16 }}>Downloads</span>
            </li>
          </ol>
        </nav>
      </div>

      {loggedInUser.isLoggedIn && (
        <div className={style["upload-section"]}>
          <button className="addNewButton" onClick={onAddNewClicked}>Add File</button>      
          
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
                <form onSubmit={handleUpload}>
                    <div className="formTitle">
                        <h2>Add a New File</h2>
                    </div>
                    <div className="inputbox">
                      <label>Name</label>
                      <input type="text" placeholder="Enter a Display Name" value={displayName} onChange={handleDisplayNameChange} className = "field" required/>
                    </div>
                    <div className="inputbox">
                      <label>File</label>
                      <input type="file" placeholder="Select a file"  className = "field" onChange={handleFileChange}/>
                    </div>
                    <div className="inputbox">
                      <label htmlFor="albumName">URL</label>
                      <input type="url" placeholder="Enter the URL" value={youtubeLink} onChange={handleYoutubeLinkChange} className = "field" />
                    </div>
                    <div className="inputbox">
                      <label>Set Visible to Public</label>
                      <div className={style["chechboxContainer"]}>
                        <input type="checkbox" checked={visibleToAll} onChange={handleVisibilityChange}/>
                      </div>
                    </div>
                    <div className = "buttonsBlock">
                        <button type="submit">Upload Content</button>
                        <button type="button" onClick={closeButtonClicked}>Close</button>
                    </div>
                </form>
              </div>
              
            </DialogContent>
          </Dialog>}
          </div>)}
      
      {errorMessage && <p className={style["error"]}>{errorMessage}</p>}

      <div className={style["downloadSection"]}>
  {/* <h4>Download Files here</h4> */}
  {visibleToAllFiles.length > 0 ? (
    visibleToAllFiles.map(file => (
      <div key={file.fileId} className={style["fileItem"]}>
        {file.youtubeLink ? (
          <div className={style["fileContent"]}>
            <img src={fileDownload} alt="fileDownload" />
            <p>{file.displayName}</p>
            <div className={style["fileActions"]}>
              <a href={file.youtubeLink} target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faEye}/>
              </a>
              {loggedInUser.isLoggedIn && (
                <button onClick={() => handleDelete(file.fileId)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className={style["fileContent"]}>
            <img src={fileDownload} alt="fileDownload" />
            <span><p>{file.displayName}</p></span>
            <div className={style["fileActions"]}>
              <button onClick={() => handleDownload(file.fileId, file.fileName)}>
                <FontAwesomeIcon icon={faDownload} />
              </button>
              {loggedInUser.isLoggedIn && (
                <button onClick={() => handleDelete(file.fileId)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    ))
  ) : (
    <p>No files visible to Public</p>
  )}

  {loggedInUser.isLoggedIn && (
    <>
      <h4>Files Only for the CYCLE Team</h4>
      {visibleToLoggedInFiles.length > 0 ? (
        visibleToLoggedInFiles.map(file => (
          <div key={file.fileId} className={style["fileItem"]}>
            {file.youtubeLink ? (
              <div className={style["fileContent"]}>
                <img src={fileDownload} alt="fileDownload" />
                <p>{file.displayName}</p>
                <div className={style["fileActions"]}>
                  <a href={file.youtubeLink} target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faEye}/>
                  </a>
                  <button onClick={() => handleDelete(file.fileId)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ) : (
              <div className={style["fileContent"]}>
                <img src={fileDownload} alt="fileDownload" />
                <span><p>{file.displayName}</p></span>
                <div className={style["fileActions"]}>
                  <button onClick={() => handleDownload(file.fileId, file.fileName)}>
                    <FontAwesomeIcon icon={faDownload} />
                  </button>
                  <button onClick={() => handleDelete(file.fileId)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
          ) : (
        <p>No files visible to logged-in users</p>
      )}
    </>)}
 
 </div>

    </div>
  );
};

export default FileUploadDownload;