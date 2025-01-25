import React, { useState, useEffect } from 'react';
import style from "../components/MyFiles.module.css";
import axios from 'axios';
import fileDownload from '../assets/download.png';
import { loggedInUser } from '../components/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload ,faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import {domainName} from "../DomainName"


const FileUploadDownload = () => {
  // State management
  const [selectedFile, setSelectedFile] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const user =JSON.parse(localStorage.getItem("loggedInUser"))

// Fetch the uploaded files from the backend when the component mounts
  useEffect(() => {
    if (loggedInUser && user.isLoggedIn) {
      fetchUploadedFiles(user.email); 
    }
  }, []);

  // Fetches uploaded files from the backend API
  const fetchUploadedFiles = async () => {
    try {
      const response = await axios.get(`${domainName}/api/v1/myFiles?email=${user.email}`);
      setUploadedFiles(response.data);
    } catch (error) {
      console.error('Error fetching files:', error);
      setErrorMessage('Error fetching files. Please try again.');
    }
  };

    // Handler for selecting a file
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

   // Handler for setting the display name of the file
  const handleDisplayNameChange = (event) => {
    setDisplayName(event.target.value);
  };

  // Handler for inputting YouTube link instead of a file
  const handleYoutubeLinkChange = (event) => {
    setYoutubeLink(event.target.value);
  };

  // Handles file upload or YouTube link submission
  const handleUpload = async () => {

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
      formData.append('file', selectedFile);
      formData.append('displayName', displayName);
    } else if (youtubeLink) {
      formData.append('youtubeLink', youtubeLink);
      formData.append('displayName', displayName);
    }

    formData.append('email', user.email);

    // Upload file or link to the backend
    try {
      const response = await axios.post(`${domainName}/api/v1/myFiles/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        alert('Content uploaded successfully');
        setSelectedFile(null);
        setYoutubeLink('');
        setDisplayName('');
        setShowUploadForm(false);
        fetchUploadedFiles(user.email);
      } else {
        alert('Failed to upload content');
      }
    } catch (error) {
      console.error('There was an error uploading the content!', error);
      alert('Upload failed. Please try again.');
    }
  };

  // Handles file download
  const handleDownload = async (myFileId, fileName) => {
    try {
      const response = await axios.get(`${domainName}/api/v1/myFiles/${myFileId}`, {
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
  const handleDelete = async (myFileId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this file?');
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`${domainName}/api/v1/myFiles/${myFileId}`);
      if (response.status === 200) {
        alert('File deleted successfully');
        fetchUploadedFiles(user.email);
      } else {
        alert('Failed to delete file');
      }
    } catch (error) {
      console.error('There was an error deleting the file!', error);
      setErrorMessage('File deletion failed. Please try again.');
    }
  };

  return (
    <div>
      <div className="pageTitle">
        <h3>My Files</h3>
      </div>

      {loggedInUser.isLoggedIn && (
        <div className={style["upload-section"]}>
          <button className={style["addcancelbutton"]} onClick={() => setShowUploadForm(!showUploadForm)}>
            {showUploadForm ? 'Cancel' : 'Add File'}
          </button>
          {showUploadForm && (
            <div className={style["upload-form"]} >
              <h4>Add a New File</h4>
              <input type="file" onChange={handleFileChange} />
              <input
                type="text"
                placeholder="Enter a Display Name"
                value={displayName}
                onChange={handleDisplayNameChange}
              />
              <input
                type="url"
                placeholder="Enter the URL"
                value={youtubeLink}
                onChange={handleYoutubeLinkChange}
              />
              <button onClick={handleUpload}>Upload Content</button>
            </div>
          )}
        </div>
      )}

      {errorMessage && <p className="error">{errorMessage}</p>}

      <div className={style["downloadSection"]}>
  {/* Ensure uploadedFiles is properly mapped */}
  {uploadedFiles.map(file => (
    <div key={file.myFileId} className={style["fileItem"]}>
      {file.youtubeLink ? (
        <div className={style["fileContent"]}>
          <img src={fileDownload} alt="fileDownload" />
          <p>{file.displayName}</p>
          <div className="fileActions">
            <a href={file.youtubeLink} target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faEye} />
            </a>
            {loggedInUser.isLoggedIn && (
              <button onClick={() => handleDelete(file.myFileId)}>
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
            <button onClick={() => handleDownload(file.myFileId, file.fileName)}>
              <FontAwesomeIcon icon={faDownload} />
            </button>
            {loggedInUser.isLoggedIn && (
              <button onClick={() => handleDelete(file.myFileId)}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  ))}
</div>

    </div>
  );
};

export default FileUploadDownload;
