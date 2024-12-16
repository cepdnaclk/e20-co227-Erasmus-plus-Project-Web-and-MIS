import React, {useEffect, useState} from "react";
import axios from "axios";
import fileDownload from '../assets/download.png';
import Button from '@mui/material/Button';
import style from "../components/ProjectManagement.module.css";
import CloseIcon from '@mui/icons-material/Close';
import { Chart } from "react-google-charts";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faDownload, faUpload, faPen, faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Dialog, DialogActions, DialogContent, Stack,Slider } from "@mui/material";
import { ClipLoader } from "react-spinners";
import {domainName} from "../DomainName"

const ProjectManagement = () => {

  const loggedInUser =JSON.parse(localStorage.getItem("loggedInUser"))

  const [users,setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [taskListNotEmpty, setTaskListNotEmpty] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  // Show interface: Either for 'Add New' or 'Edit'
  const [showInterface, setShowInterface] = useState(false);
  const [showViewInterface, setShowViewInterface] = useState(false);
  const [editRow, setEditRow] = useState(false);  
  const [addRow, setAddRow] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  

  // check whether the user is a task member
  const checkIfAssigned = (user) => {
    if (Array.isArray(task.assignedUsers) ) {
        let checkedAssignedUser=task.assignedUsers.filter(assignedUser => assignedUser.id==user.id);
    if (!Array.isArray(checkedAssignedUser) || !checkedAssignedUser.length) {
      return false
    }else{
      return true;
    }}
  };

    //to load for the first time on page visit
    useEffect(() => {

        if (loggedInUser.isAdmin) {
          setIsAdmin(true);
          getAllTaskInfo();     
        }else if(!loggedInUser.isAdmin){
          setIsAdmin(false);
          getAllTaskInfo();
        }
  }, []);

  //setting values from form
  const [progressValue,setProgressValue] = useState(0);

  const [task, setTask] = useState({  
    task_Name:"",
    start_Date:"",
    end_Date:"",
    progress:"",
    description:"",
    financialReport:"",
    assignedUsers:[]
  })

  //functions to set up above values
  function changeProgressValue(event) {
      setProgressValue(Number(event.target.value))
      setTask({...task,["progress"]:event.target.value})
  }
    
  const onInputChange=(e)=>{
    setTask({...task,[e.target.name]:e.target.value})
  };

  // Handler for selecting a file
  const handleFileChange = (e) => {
    setTask({...task,"financialReport":e.target.files[0]})
  };

  // Handles file download
  const handleDownload = async (file) => {
        const url = window.URL.createObjectURL(new Blob([file]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', "financialReport.docx");
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
  }

  const onMemberChange=(e)=>{
    let tempUserId=e.target.value;
    let user = users.filter(i=>i.id==tempUserId)[0]
    //If there are assigned users
    if (Array.isArray(task.assignedUsers) ) 
      {
        let checkedAssignedUser=task.assignedUsers.filter(assignedUser => assignedUser.id==user.id);
        if (!Array.isArray(checkedAssignedUser) || !checkedAssignedUser.length) {
            setTask(prevTask => ({
              ...prevTask,
              assignedUsers: [...prevTask.assignedUsers, user] // Add userId
            }));
        }
        else {
            setTask(prevTask => ({
              ...prevTask,
              assignedUsers: prevTask.assignedUsers.filter(assignedUser => assignedUser.id != tempUserId) // Remove the user with the selected ID
            }));
        }
      }
    else{
        setTask(prevTask => ({
          ...prevTask,
          assignedUsers: [user] // Add userId
        }));
    }
  }

  //When 'Add New' button is clicked : Only For Add New
  const onAddNewClicked=()=>{
    setShowInterface(true);
    setAddRow(true);
    setEditRow(false);

    setTask({
      task_Name:"",
      start_Date:"",
      end_Date:"",
      progress:"",
      description:"",
      financialReport:"",
      assignedUsers:[]
    });
    setProgressValue(0)
  }

  //on view
  const onViewClick = (task) => {
    setTask(task);
    setProgressValue(task.progress);
    setShowViewInterface(true);
    setAddRow(false);
    setEditRow(false);
  }

  //on Edit 
  const onEditClick = (task) => {
    setTask(task);
    setProgressValue(task.progress);
    setShowInterface(true);
    setAddRow(false);
    setEditRow(true);
  }

//When 'Add' button is clicked in the interface : Only For Add New
const onAddSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setIsLoading(true); // Show loading indicator
    const {assignedUsers, ...newtaskFormat } = task;
    const formData = new FormData();
    
    for (const key in newtaskFormat) {
        formData.append(key, newtaskFormat[key]);
    }

    formData.append("assignedUsers",JSON.stringify(assignedUsers))

try {
    // console.log("report....",task.financialReport)
    await axios.post(`${domainName}/api/v1/tasks/addWithUsers`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }});
    alert("Task added successfully!");
    //  reload the data after successful submission
    setTasks([...tasks,task])
    // Clear the form fields after successful submission if needed
    setAddRow(false);
    setShowInterface(false);
  } catch (error) {
    console.error("Error adding tasks:", error);
  } finally {
    setIsLoading(false); // Hide loading indicator
  }
};

//When 'Update' button is clicked in the interface : Only Edit
const onUpdateSubmit = async (e) => {
  e.preventDefault(); // Prevent default form submission
  setIsLoading(true); // Show loading indicator
  const confirmUpdate = window.confirm('Are you sure you want to update this task?');
  if (!confirmUpdate) return; 

  const {assignedUsers, ...newtaskFormat } = task;
  const formData = new FormData();
  for (const key in newtaskFormat) {
    formData.append(key, newtaskFormat[key]);
  }
  formData.append("assignedUsers",JSON.stringify(assignedUsers.map(({ admin, ...assignedUsersDetails }) => assignedUsersDetails)))
  try {
<<<<<<< Updated upstream
    await axios.put(`http://localhost:8080/api/v1/tasks/updateWithUsers`, formData, {
=======
    console.log("task.... ",formData)
    await axios.put(`${domainName}/api/v1/tasks/updateWithUsers`, formData, {
>>>>>>> Stashed changes
      headers: {
        'Content-Type': 'multipart/form-data'
      }});;
      // Optionally, change the tasks list after successful submission
      setTasks([...tasks,task])
      setEditRow(false);
      setShowInterface(false)
      alert("Task updated successfully!");
    } catch (error) {
    console.error("Error editing tasks:", error);
  } finally {
    setIsLoading(false); // Hide loading indicator
  }
};

//delete a task and its assigned members
const onDeleteClick = async (task_ID) => {

  const confirmDelete = window.confirm('Are you sure you want to delete this task?');
    if (!confirmDelete) return;

  try {

    await axios.delete(`${domainName}/api/v1/tasks/${task_ID}`);
    RefreshTasks();
  } catch (error) {
    console.error("Error deleting tasks:", error);
  }
}


//to refresh on admin requirement => get ALL TASKS
function getAllTaskInfo(){
  const fetchTasks = async () => {
    let response
    try {
      
        response = await axios.get(`${domainName}/api/v1/tasks`);
      //for editing purrposes and adding new tasks
      const Users = await axios.get(`${domainName}/api/v1/users`);
      setTasks(response.data);       
      setUsers(Users.data.map(({ admin, ...rest }) => rest));
      if (response.data.length!=0) {
        setTaskListNotEmpty(true);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };
  fetchTasks();
}

// refresh tasks on request
  function RefreshTasks() {
    
    setShowInterface(false);
    setShowViewInterface(false);
    getAllTaskInfo();

  }


  function closePopUp(){
    setShowInterface(false);
  }
  function closeViewPopuP(){
    setShowViewInterface(false)
  }


/**************Chart Configuration***************/
const options = {
  height: 600,
  gantt: {
    barHeight: 25,
    trackHeight: 50,
    criticalPathEnabled: false, 
    labelStyle: {
      fontName: 'Caudex',
      fontSize: 18,
      color: '#004594'//Not working?
    },

    explorer: {axis: 'horizontal', keepInBounds: false},
    
    // innerGridTrack: { fill: '#e3f2fd' },  
    // innerGridDarkTrack: { fill: '#bbdefb' }, 
    // Adjust the date format for months and years
    timeFormat: {
      timeline: {
        rowLabelFormat: 'MMM YYYY', // Month and Year on row labels
        unit: 'date', // Grouping by months
      },
    },
    palette: [
      {
        color: "#004594",
        dark: "#a6c9f1", //
        light: "#a6c9f1"
      }
    ],
    enableInteractivity: false,
    
    // shadowEnabled : true,
    // shadowColor: 'white',
    // shadowOffset: 2,
    tooltip: {
      isHtml: true, // Enable HTML tooltips for more customization
    },
  },
};

/**************Column Names***************/
const columns = [
  { type: "string", label: "Task ID" },
  { type: "string", label: "Task Name" },
  { type: 'string', label: 'Resource' }, // New column for "Details"
  { type: "date", label: "Start Date" },
  { type: "date", label: "End Date" },
  { type: "number", label: "Duration" },
  { type: "number", label: "Percent Complete" },
  { type: "string", label: "Dependencies" },
];

/************** Rows **************/
const rows = (tasks) => {
  return tasks.map(task => [
    task.task_ID,
    task.task_Name,
    task.assignedUsers.map(user => `${user.firstName} ${user.lastName}`).join(', '),
    new Date(task.start_Date),
    new Date(task.end_Date),
    null,  // Assuming duration is null since you're using start and end dates
    task.progress || 0,  // Handle if progress is undefined
    task.dependencies || null,  // Handle missing dependencies
  ]);
};

if(loggedInUser){
    return(
      
    <>
    
    <div className={style["ProjectManagementTitle"]}>
          <h3>Project Management</h3>
    </div>
    <div className={style["container"]}>
    <div>
        {/* <Button onClick={RefreshTasks} variant="outlined" startIcon={<RefreshIcon />}>
            Refresh
        </Button> */}
        <br></br>
        {isAdmin &&<div>
        {/* <Button onClick={onAddNewClicked} startIcon={<AddTaskIcon></AddTaskIcon>} className="addNewButton">Add New Task</Button> */}
        <button onClick={onAddNewClicked} className="addNewButton">Add New Task</button>
        <br></br>

   {/* // a popup to add a new task or edit */}
   <Dialog open={showInterface} onClose={closePopUp} fullWidth maxWidth="md" >
     <DialogContent >

      {/*Loading Icon*/}
     {isLoading && (
      <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.7)", 
        zIndex: 1
      }}
      >
      <div
      style={{
        padding: "20px",  
        backgroundColor: "#fff", 
        borderRadius: "8px",  
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" 
      }}
      >
      <ClipLoader size={20} color={"#123abc"} />
      </div>
    </div>
    )}

       <div className = "dataForm"> 
       <form onSubmit={editRow ? onUpdateSubmit : onAddSubmit}>  
         <div className = "formTitle">
             <h3>{editRow ? "Edit Entry" : "Add a New Entry"}</h3> 
         </div>
         <div className = "inputbox">  
           <label>Task Name: </label>
           <input type="text" placeholder="Enter Task name" name="task_Name" value={task.task_Name} required="required" className ="field" onChange={(e)=>onInputChange(e)}></input>
         </div>
         <div className = "inputbox">  
           <label>Start Date: </label>
           <input type="date" name="start_Date"value={task.start_Date} required="required" className ="field" onChange={(e)=>onInputChange(e)} ></input>
         </div>
         <div className = "inputbox">  
           <label>End Date: </label>
           <input type="date" name="end_Date" min={task.start_Date} value={task.end_Date} required="required" className ="field" onChange={(e)=>onInputChange(e)}></input>
         </div>
         <div className = "inputbox">  
         <label>Progress</label>
           <div style={{width:"62%"}}>
           <Slider 
             onChange={changeProgressValue}
               aria-label="Progress"
               value={typeof progressValue === 'number' ? progressValue : 0}
               min={0}
               max={100}
               width="30%"
               />
           </div>
           <input type="number" name="progress"value={task.progress} required="required" onChange={changeProgressValue} defaultValue={0} className = {style["integerField"]}>
           </input>  
       </div>
       <div className = "inputbox">  
           <label>Task Details: </label>

           <textarea type="text" placeholder="Enter Description" name="description" value={task.description} className ="field" onChange={(e)=>onInputChange(e)}></textarea>
       </div>

       <div className = "inputbox">  
           <label>Team Members:</label>
           <div class={style["checkBoxContainer"]}>
           <div className ="dataForm">
           {
             users.map((user) => {
               let isAssignedTaskMember = checkIfAssigned(user);             
               return(<div style={{display: "flex",gap: "10px", width:"100%",marginTop:"5%",height:"5px",verticalAlign:"middle"}}>
               <input type="checkbox" value={user.id} checked={isAssignedTaskMember} onChange={(e)=>onMemberChange(e)}></input>
               <label style={{color:"black",height:"20px", width:"60%", marginTop:"-3.5%"}}>{user.title +" "+ user.firstName+" "+user.lastName}</label>
               </div>
             )})
           }
           </div>
         </div>
       </div>
       
       { <div key={task.task_ID} className={style["fileItem"]}>
              <div className={style["fileContent"]}>
               <img src={fileDownload} alt="fileDownload" />
               <span><p>Financial Report</p></span>
               <div className={style["fileActions"]}>
              {task.financialReport && 
                  <button onClick={() => handleDownload(task.financialReport)}>
                  <FontAwesomeIcon icon={faDownload}  />
                  <span>Download</span>
                  </button>
                }
                <span>|</span>
              <span className={style["fileActions"]}>Upload File</span>
              <input type="file" placeholder="Select a file" className = "field" accept=".docx" onChange={handleFileChange}></input>
                </div>
              </div>
            </div>
        }
        <div className = "buttonsBlock">
            {addRow? <button type = "submit">Add</button> : <button type = "submit">Update</button> }
            <button type="button" onClick={closePopUp} endIcon={<CloseIcon></CloseIcon>}>Discard</button>
        </div>
       </form>
     </div>
     </DialogContent>
   </Dialog>
   </div>
    }

    {/* a popup to show task */}
     <Dialog open={showViewInterface} onClose={closeViewPopuP} fullWidth maxWidth="sm">
     
       <div key={task.task_ID} className={style["viewTask"]}>
             <h2>{task.task_Name}</h2>
             <b><p>Start Date: {task.start_Date}</p></b>
             <b><p>End Date: {task.end_Date}</p></b>
             <b><p>Progress: {task.progress}</p></b>
             <b><p>Description: {task.description}</p></b>
               
             {/* task members */}
             <div style={{textAlign:"center"}}>
             <ol style={{listStylePosition: "inside"}}>
              {task.assignedUsers.map((assignedUser) => (
               <li key={assignedUser.id}><span>{assignedUser.firstName+" "+assignedUser.lastName}</span></li>
             ))}
             </ol>
             </div>

              {/* financial report */}
             { 
             task.financialReport && (
             <div key={task.task_ID} className={style["fileItem"]}>
              <div className={style["fileContent"]}>
               <img src={fileDownload} alt="fileDownload" />
               <span><p>Financial Report</p></span>
               <div className={style["fileActions"]}>
                  <button onClick={() => handleDownload(task.financialReport)}>
                  <FontAwesomeIcon icon={faDownload} />
                  </button>
                </div>
              </div>
            </div>
            )}
         {isAdmin &&
           <div>
             <button className='actionButton' onClick={() => onEditClick(task)}><FontAwesomeIcon icon={faPen}/></button>
             <button className='actionButton' onClick={() => onDeleteClick(task.task_ID)}><FontAwesomeIcon icon={faTrash} /></button>

         </div>}
             </div>
             <DialogActions>
                  <Button onClick={closeViewPopuP} endIcon={<CloseIcon></CloseIcon>}>Close</Button>
              </DialogActions>
     </Dialog>    
     
    </div>

{/* Gann chart  */}

{taskListNotEmpty &&
<Chart
            chartType="Gantt"
            data={[columns, ...rows(tasks)]} // Pass the mapped rows from tasks
            width="100%"
            height={"600px"}
            options={options}
            chartEvents={[
              {
                eventName: "select",
                callback: ({ chartWrapper }) => {
                  const chart = chartWrapper.getChart();
                  const selection = chart.getSelection();
                  if (selection.length > 0) {
                    const row = selection[0].row;
                    if (row !== undefined && tasks[row]) {
                      const selectedTask = tasks[row];
                      onViewClick(selectedTask);
                    } else {
                      console.error("No task found for the selected row");
                    }
                  }
                },
              },
            ]}
          />
          }
    </div>
      </>
    )}
 
  }

export default ProjectManagement;