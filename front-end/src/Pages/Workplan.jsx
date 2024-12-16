import { useEffect , useState} from 'react';
import style from '../components/Workplan.module.css'
import axios from 'axios';
import { loggedInUser } from '../components/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Dialog, DialogContent } from "@mui/material";
import {domainName} from "../DomainName"

function Workplan() {

  /******************** Load information whenever the page loads ********************************* */

  const[workplanActivities, setWorkplanActivities]=useState([])
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect (()=>{
    loadData();
  },[]);

  const loadData=async()=>{
      try {
        const result = await axios.get(`${domainName}/api/v1/workplan/getAll`);
        setWorkplanActivities(result.data);
      } catch (error) {
        console.error("Error loading workplan activities:", error);
      }
  }
  // Function to sort activities based on Activity No
  const sortActivities = () => {
    const sortedActivities = [...workplanActivities].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.activityNo.localeCompare(b.activityNo);
      } else {
        return b.activityNo.localeCompare(a.activityNo);
      }
    });
    setWorkplanActivities(sortedActivities);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); // Toggle sort order
  };
  /******************** Add a new data entry and edit the exsisting entry ********************************* */
    
    // Show the dialog: Either for 'Add New' or 'Edit'
    const [showDiologBox, setshowDiologBox] = useState(false);
    const [editRow, setEditRow] = useState(false);  
    const [addRow, setAddRow] = useState(false);

    //Initialize the object
    const [activity, setActivity] = useState({
      activityNo:"",
      activityName:"",
      y1_q1: false,
      y1_q2: false,
      y1_q3: false,
      y1_q4: false,
      y2_q1: false,
      y2_q2: false,
      y2_q3: false,
      y2_q4: false,
      y3_q1: false,
      y3_q2: false,
      y3_q3: false,
      y3_q4: false,
      y4_q1: false,
      y4_q2: false,
      y4_q3: false,
      y4_q4: false
    })

    //Deconstruct the object and assign them to 'values' in the form 
    const{activityNo,activityName,y1_q1, y1_q2, y1_q3, y1_q4, y2_q1, y2_q2, y2_q3, y2_q4, y3_q1, y3_q2, y3_q3, y3_q4, y4_q1, y4_q2, y4_q3, y4_q4} = activity;

    //Function saves the information taken from the form 
    //Event 'e' is passed to the function 
    const onInputChange = (e) => {
      //Deconstruct from event target
      const { name, value, type, checked } = e.target;
      setActivity({
        ...activity,
        [name]: type === "checkbox" ? checked : value,
      });
    };
    
    //When 'Add New' button is clicked : Only For Add New
    const onAddNewClicked=()=>{
      setshowDiologBox(true);
      setAddRow(true);
      setEditRow(false);
      setActivity({
        activityNo: "",
        activityName: "",
        y1_q1: false,
        y1_q2: false,
        y1_q3: false,
        y1_q4: false,
        y2_q1: false,
        y2_q2: false,
        y2_q3: false,
        y2_q4: false,
        y3_q1: false,
        y3_q2: false,
        y3_q3: false,
        y3_q4: false,
        y4_q1: false,
        y4_q2: false,
        y4_q3: false,
        y4_q4: false
      });
    }

    //When 'Add' button is clicked in the dialog : Only For Add New
    const onAddSubmit = async (e) => {
      e.preventDefault(); // Prevent default form submission
      try {
        await axios.post(`${domainName}/api/v1/workplan/add`, activity);
        // Reload the data after successful submission
        loadData();       
        // Clear the form fields after successful submission if needed
        setshowDiologBox(false);
        setAddRow(false);
        alert("Activity added successfully!");
      } catch (error) {
        console.error("Error adding workplan activity:", error);
        alert("Failed to add activity!");
      }
    }

    //When 'Edit' icon button is clicked : Only For Edit
    const onEditClick = (activity) => {
      setActivity(activity);  //Set the activity for editing 
      setshowDiologBox(true);
      setAddRow(false);
      setEditRow(true);
      setViewRow(false); 
    }

    //When 'Update' button is clicked in the dialog : Only Edit
    const onUpdateSubmit = async (e) => {
      e.preventDefault(); 
      const confirmUpdate = window.confirm('Are you sure you want to update this activity?');
      if (!confirmUpdate) return; 
      try {
        await axios.put(`${domainName}/api/v1/workplan/update/${activity.activityId}`, activity);
        // Optionally, reload the data after successful submission
        loadData();
        setEditRow(false);
        setshowDiologBox(true);
        alert("Activity updated successfully!");
      } catch (error) {
        console.error("Error editing workplan activity:", error);
        alert("Failed to update activity!");
      }
    }

    // When 'Discard' button is clicked: for Edit, and Add New
    const discardButtonClicked = () => {
      setshowDiologBox(false);
      setAddRow(false);    
      setEditRow(false);
    }

  /************************** Delete a specific entry *************************************/

  const onDeleteClick = async (activityId) => {
    console.log("Delete button clicked");
    console.log(activityId);
    const confirmDelete = window.confirm('Are you sure you want to delete this activity?');
    if (!confirmDelete) return; 
    try {
      await axios.delete(`${domainName}/api/v1/workplan/delete/${activityId}`);
      loadData();
      if (response.status === 200) {
        alert('Activity deleted successfully');
        loadData();
      } else {
        alert('Failed to delete Activity');
      }
    } catch (error) {
      console.error("Error deleting workplan activity:", error);
    }
  }

  return(
    <>
      <div className="pageTitle">
          <h3>Workplan</h3>
          <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="http://localhost:5173/"> 
                <span style={{ fontSize: 16}}>Home</span>
              </a>
            </li>
            <li className="breadcrumb-item active">
              <span style={{ fontSize: 16}}> Project Overview</span>
            </li>
            <li className="breadcrumb-item active">
              <span style={{ fontSize: 16}}> Cycle Workplan</span>
            </li>
          </ol>
        </nav>
      </div>
    <div className={style["container"]}>
      {!addRow && loggedInUser.isLoggedIn && <div>
        <button className="addNewButton" onClick={onAddNewClicked}>Add Activity</button>
      </div>}
      <div className={style["tableContainer"]}>
          <table className={style["table"]}>
            <thead>
              <tr>
                <th scope="col" rowspan={2} onClick={sortActivities} style={{ cursor: 'pointer' }}>Activity No {sortOrder === 'asc' ? '▲' : '▼'}</th>
                <th scope="col"rowspan={2}>Activity Name</th>
                <th scope="col" colSpan={4}>Year 1</th>
                <th scope="col" colSpan={4}>Year 2</th>
                <th scope="col" colSpan={4}>Year 3</th>
                <th scope="col" colSpan={4}>Year 4</th>
                {loggedInUser.isLoggedIn && <th rowspan={2}>Action</th>}
              </tr>
              <tr>
                <th>Q1</th>
                <th>Q2</th>
                <th>Q3</th>
                <th>Q4</th>
                <th>Q1</th>
                <th>Q2</th>
                <th>Q3</th>
                <th>Q4</th>
                <th>Q1</th>
                <th>Q2</th>
                <th>Q3</th>
                <th>Q4</th>
                <th>Q1</th>
                <th>Q2</th>
                <th>Q3</th>
                <th>Q4</th>
              </tr>
            </thead>
            <tbody>
                    {workplanActivities.map((workplanActivity,index)=>(
                        <tr  key={workplanActivity.activityId}>
                          <td>{workplanActivity.activityNo}</td>
                          <td>{workplanActivity.activityName}</td>
                          <td style={{ backgroundColor: workplanActivity.y1_q1 ? '#72a1e685' : 'white',border:"solid #72a1e685 2px" }}></td>
                          <td style={{ backgroundColor: workplanActivity.y1_q2 ? '#72a1e685' : 'white' ,border:"solid #72a1e685 2px"}}></td>
                          <td style={{ backgroundColor: workplanActivity.y1_q3 ? '#72a1e685' : 'white',border:"solid #72a1e685 2px" }}></td>
                          <td style={{ backgroundColor: workplanActivity.y1_q4 ? '#72a1e685' : 'white',border:"solid #72a1e685 2px" }}></td>
                          <td style={{ backgroundColor: workplanActivity.y2_q1 ? '#72a1e685' : 'white' ,border:"solid #72a1e685 2px"}}></td>
                          <td style={{ backgroundColor: workplanActivity.y2_q2 ? '#72a1e685' : 'white' ,border:"solid #72a1e685 2px"}}></td>
                          <td style={{ backgroundColor: workplanActivity.y2_q3 ? '#72a1e685' : 'white' ,border:"solid #72a1e685 2px"}}></td>
                          <td style={{ backgroundColor: workplanActivity.y2_q4 ? '#72a1e685' : 'white' ,border:"solid #72a1e685 2px"}}></td>
                          <td style={{ backgroundColor: workplanActivity.y3_q1 ? '#72a1e685' : 'white' ,border:"solid #72a1e685 2px"}}></td>
                          <td style={{ backgroundColor: workplanActivity.y3_q2 ? '#72a1e685' : 'white' ,border:"solid #72a1e685 2px"}}></td>
                          <td style={{ backgroundColor: workplanActivity.y3_q3 ? '#72a1e685' : 'white' ,border:"solid #72a1e685 2px"}}></td>
                          <td style={{ backgroundColor: workplanActivity.y3_q4 ? '#72a1e685' : 'white' ,border:"solid #72a1e685 2px"}}></td>
                          <td style={{ backgroundColor: workplanActivity.y4_q1 ? '#72a1e685' : 'white' ,border:"solid #72a1e685 2px"}}></td>
                          <td style={{ backgroundColor: workplanActivity.y4_q2 ? '#72a1e685' : 'white' ,border:"solid #72a1e685 2px"}}></td>
                          <td style={{ backgroundColor: workplanActivity.y4_q3 ? '#72a1e685' : 'white' ,border:"solid #72a1e685 2px"}}></td>
                          <td style={{ backgroundColor: workplanActivity.y4_q4 ? '#72a1e685' : 'white' ,border:"solid #72a1e685 2px"}}></td>
        
                          {loggedInUser.isLoggedIn && <td>
                            <div className='actionButtonsBlock'>
                              <button className='actionButton' onClick={() => onEditClick(workplanActivity)}><FontAwesomeIcon icon={faPen}/></button>
                              <button className='actionButton' onClick={() => onDeleteClick(workplanActivity.activityId)}><FontAwesomeIcon icon={faTrash} /></button>
                            </div>         
                          </td>}
                        </tr>
                      ))
                    }
            </tbody>
            {/* <tfoot>
                <tr>
                    <td colSpan="12"><span>Last Modified: </span></td>
                </tr>
            </tfoot> */}
          </table>
      </div>
      </div>
      {/* Dialog- Add New Row/Edit Row */}
      { (addRow || editRow) &&  <Dialog
          open={showDiologBox}
          onClose={discardButtonClicked}
          fullWidth
          maxWidth="md"
        >  <DialogContent>
               <div className ="dataForm">
                <form onSubmit={editRow ? (e)=>onUpdateSubmit(e) : (e)=>onAddSubmit(e)}>
                     <div className = "formTitle">
                      <h2>{editRow ? "Edit Activity" : "Add a New Activity"}</h2> 
                    </div>
                    <div className = "inputbox">
                      <label>Activity No</label>
                      <input 
                        type = "text" 
                        className = "field"
                        placeholder = "Enter Activity No" 
                        name = "activityNo"
                        value={activityNo} 
                        onChange={(e)=>onInputChange(e)} 
                        required/>
                     </div>
                     <div className ="inputbox">
                       <label>Activity Name</label>
                       <input 
                        type = "text" 
                        className = "field" 
                        placeholder = "Enter Activity Name" 
                        name = "activityName"
                        value={activityName} 
                        onChange={(e)=>onInputChange(e)} 
                        required/>
                     </div>
                    
                     <table className={style["tableInDialogBox"]}>
                      <thead>
                        <tr>
                          <th scope="col" colSpan={4}>Year 1</th>
                          <th scope="col" colSpan={4}>Year 2</th>
                          <th scope="col" colSpan={4}>Year 3</th>
                          <th scope="col" colSpan={4}>Year 4</th>
                        </tr>
                        <tr>
                          <th>Q1</th><th>Q2</th><th>Q3</th><th>Q4</th>
                          <th>Q1</th><th>Q2</th><th>Q3</th><th>Q4</th>
                          <th>Q1</th><th>Q2</th><th>Q3</th><th>Q4</th>
                          <th>Q1</th><th>Q2</th><th>Q3</th><th>Q4</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><input type="checkbox" name="y1_q1" checked={y1_q1} onChange={onInputChange} /></td>
                          <td><input type="checkbox" name="y1_q2" checked={y1_q2} onChange={onInputChange} /></td>
                          <td><input type="checkbox" name="y1_q3" checked={y1_q3} onChange={onInputChange} /></td>
                          <td><input type="checkbox" name="y1_q4" checked={y1_q4} onChange={onInputChange} /></td>

                          <td><input type="checkbox" name="y2_q1" checked={y2_q1} onChange={onInputChange} /></td>
                          <td><input type="checkbox" name="y2_q2" checked={y2_q2} onChange={onInputChange} /></td>
                          <td><input type="checkbox" name="y2_q3" checked={y2_q3} onChange={onInputChange} /></td>
                          <td><input type="checkbox" name="y2_q4" checked={y2_q4} onChange={onInputChange} /></td>
                          
                          <td><input type="checkbox" name="y3_q1" checked={y3_q1} onChange={onInputChange} /></td>
                          <td><input type="checkbox" name="y3_q2" checked={y3_q2} onChange={onInputChange} /></td>
                          <td><input type="checkbox" name="y3_q3" checked={y3_q3} onChange={onInputChange} /></td>
                          <td><input type="checkbox" name="y3_q4" checked={y3_q4} onChange={onInputChange} /></td>

                          <td><input type="checkbox" name="y4_q1" checked={y4_q1} onChange={onInputChange} /></td>
                          <td><input type="checkbox" name="y4_q2" checked={y4_q2} onChange={onInputChange} /></td>
                          <td><input type="checkbox" name="y4_q3" checked={y4_q3} onChange={onInputChange} /></td>
                          <td><input type="checkbox" name="y4_q4" checked={y4_q4} onChange={onInputChange} /></td>
                        </tr>                                   
                      </tbody>
                      </table>
                     <div className = "buttonsBlock">
                        {addRow? <button type = "submit">Add</button> : <button type = "submit">Update</button> }
                        <button type="button" onClick={discardButtonClicked}>Discard</button>
                     </div>
                   </form>
                 </div>    
                 </DialogContent>
                 </Dialog>}
      </>
  );
}
  
export default Workplan;
