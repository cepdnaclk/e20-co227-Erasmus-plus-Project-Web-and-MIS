import { useEffect, useState } from 'react';
import style from '../components/Deliverables.module.css'
import axios from "axios"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faEye, faTrash } from '@fortawesome/free-solid-svg-icons';
import { loggedInUser } from '../components/Header';
import { Dialog, DialogContent } from "@mui/material";

/*Deliverables Page */
function Deliverables() {

  /******************** Load information whenever the page loads ********************************* */

  const [deliverables, setDeliverables] =useState([]);    
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(()=>{
    loadData();
  },[])

  const loadData=async()=>{
    try{
      const result=await  axios.get("http://localhost:8080/deliverable/getAll");
      setDeliverables(result.data);
    }catch(error){
      console.error("Error loading deliverables:", error);
    }
  }
  
    // Function to sort activities based on Activity No
    const sortDeliverables = () => {
      const sortedDeliverables = [...deliverables].sort((a, b) => {
        if (sortOrder === 'asc') {
          return a.deliverableRelatedNo.localeCompare(b.deliverableRelatedNo);
        } else {
          return b.deliverableRelatedNo.localeCompare(a.deliverableRelatedNo);
        }
      });
      setDeliverables(sortedDeliverables);
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); // Toggle sort order
    };
  /******************** Add a new data entry and edit the exsisting entry ********************************* */
  
  // Show the interface: Either for 'Add New' or 'Edit'
  const [showDiologBox, setshowDiologBox] = useState(false);
  const [editRow, setEditRow] = useState(false);  
  const [addRow, setAddRow] = useState(false);

  const [selectedDeliverable, setSelectedDeliverable] = useState(null);
  
  //Initialize the object
  const [deliverable, setDeliverable] = useState({  
    deliverableRelatedNo: "",
    workPackageNo: "",
    deliverableNo: "",
    deliverableName: "",
    description: "",
    leadBeneficiary: "",
    type: "",
    disseminationLevel: "",
    dueDate: ""
})

//Deconstruct the object
const {deliverableRelatedNo,workPackageNo,deliverableNo,deliverableName,description,leadBeneficiary,type,disseminationLevel,dueDate}=deliverable;
  
const onInputChange=(e)=>{
  setDeliverable({...deliverable,[e.target.name]:e.target.value})
};

//When 'Add New' button is clicked : Only For Add New
  const onAddNewClicked=()=>{
    setshowDiologBox(true);
    setAddRow(true);
    setEditRow(false);
    setViewRow(false); 
    setDeliverable({
      deliverableRelatedNo: "",
      workPackageNo: "",
      deliverableNo: "",
      deliverableName: "",
      description: "",
      leadBeneficiary: "",
      type: "",
      disseminationLevel: "",
      dueDate: ""
    });
  }

  //When 'Add' button is clicked in the interface : Only For Add New
  const onAddSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      await axios.post("http://localhost:8080/deliverable/add", deliverable);
      // Reload the data after successful submission
      loadData();
      // Clear the form fields after successful submission if needed
      setshowDiologBox(false);
      setAddRow(false);
      alert("Deliverable added successfully!");
    } catch (error) {
      console.error("Error adding deliverable:", error);
      alert("Failed to add deliverable!");
    }
  };

  //When 'Edit' icon button is clicked : Only For Edit
  const onEditClick = (deliverable) => {
    setDeliverable(deliverable);
    setshowDiologBox(true);
    setAddRow(false);
    setEditRow(true);
    setViewRow(false); 
  }

  //When 'Update' button is clicked in the interface : Only Edit
  const onUpdateSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const confirmUpdate = window.confirm('Are you sure you want to update this deliverable?');
    if (!confirmUpdate) return; 
    try {
      await axios.put(`http://localhost:8080/deliverable/update/${deliverable.deliverableId}`, deliverable);
      // Optionally, reload the data after successful submission
      loadData();
      setEditRow(false);
      setshowDiologBox(false);
      alert("Deliverable updated successfully!");
    } catch (error) {
      console.error("Error editing deliverable:", error);
      alert("Failed to update deliverable!");
    }
  };

  // When 'Discard' button is clicked: for Edit, and Add New
  const discardButtonClicked = () => {
    setshowDiologBox(false);
    setAddRow(false);    
    setEditRow(false);
  }

/******************************************************************************************/

/************************** Delete a specific entry *************************************/

const onDeleteClick = async (deliverableId) => {
  console.log("Delete button clicked");
  console.log(deliverableId);
  const confirmDelete = window.confirm('Are you sure you want to delete this deliverable?');
    if (!confirmDelete) return;  
    try {
      await axios.delete(`http://localhost:8080/deliverable/delete/${deliverableId}`);
      loadData();
      alert('Deliverable deleted successfully');
    } catch (error) {
      console.error("Error deleting deliverable:", error);
      alert("Failed to delete deliverable!");
    }
}

/************************** View a specific entry *************************************/

const [viewRow, setViewRow] = useState(false);

const onViewClick = (deliverable) => {
  setSelectedDeliverable(deliverable);
  setViewRow(true);
  setEditRow(false);
  setAddRow(false);
  setshowDiologBox(true);
}

  // When 'Close' button is clicked: for view
  const closeButtonClicked = () => {
    setshowDiologBox(false);
    setSelectedDeliverable(null);
    setAddRow(false);    
    setEditRow(false);
    setViewRow(false);
  }

  return(
  <>
    <div className="pageTitle">
          <h3>Deliverables</h3>
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
              <span style={{ fontSize: 16}}> Deliverables</span>
            </li>
          </ol>
        </nav>
    </div>
    <div className={style["container"]}>
      {!addRow && loggedInUser.isLoggedIn && <div>
        {/* JSON.parse(localStorage.getItem('isEditMode')).isEditMode &&  */}
        <button className="addNewButton" onClick={onAddNewClicked}>Add New</button>
      </div>}
      <div className={style["tableContainer"]}>
          <table className={style["table"]}>
            <thead>
              <tr>
                <th scope="col">Work Package No</th>
                <th scope="col" onClick={sortDeliverables} style={{ cursor:'pointer'}} width="60px">Deliverable Related No {sortOrder === 'asc' ? '▲' : '▼'}</th>
                <th scope="col">Deliverable No</th>
                <th scope="col">Deliverable Name</th>
                {/* <th scope="col">Description</th> */}
                <th scope="col">Lead Beneficiary</th>
                <th scope="col">Type</th>
                <th scope="col">Dissemination Level</th>
                <th scope="col">Due Date</th>
                {loggedInUser.isLoggedIn && <th width="120px">Action</th>}
              </tr>
            </thead>
            <tbody>
                    {deliverables.map((deliverable,index)=>(
                        <tr  key={deliverable.deliverableId}>
                          <td>{deliverable.workPackageNo}</td>
                          <td>{deliverable.deliverableRelatedNo}</td>
                          <td>{deliverable.deliverableNo}</td>
                          <td>{deliverable.deliverableName}</td>
                          <td>{deliverable.leadBeneficiary}</td>
                          <td>{deliverable.type}</td>
                          <td>{deliverable.disseminationLevel}</td>
                          <td>{deliverable.dueDate}</td>
                          {loggedInUser.isLoggedIn && <td>
                            <div className='actionButtonsBloack'>
                              <button className='actionButton' onClick={() => onEditClick(deliverable)}><FontAwesomeIcon icon={faPen}/></button>
                              <button className='actionButton' onClick={() => onViewClick(deliverable)}><FontAwesomeIcon icon={faEye}/></button>
                              <button className='actionButton' onClick={() => onDeleteClick(deliverable.deliverableId)}><FontAwesomeIcon icon={faTrash} /></button>
                            </div>         
                          </td>}
                        </tr>
                      ))
                    }
            </tbody>
            {/* <tfoot>
                <tr>
                    <td colSpan="9"><span>Last Modified: </span></td>
                </tr>
            </tfoot> */}
          </table>
      </div>
    </div>
    { (addRow || editRow) &&  <Dialog
          open={showDiologBox}
          onClose={discardButtonClicked}
          fullWidth
          maxWidth="md"
        >
      {/* Dialog- Add New/Edit/View */}
      <DialogContent>
        <div className = "dataForm">          
          <form onSubmit={editRow ? (e)=>onUpdateSubmit(e) : (e)=>onAddSubmit(e)}>
              <div className = "formTitle">
                <h2>{editRow ? "Edit Deliverable" : "Add a New Deliverable"}</h2> 
              </div>
              <div className = "inputbox">
                <label>Work Package No</label>
                <input 
                    type = "text" 
                    className = "field" 
                    placeholder = "Enter Work Package No" 
                    name = "workPackageNo" 
                    value={workPackageNo} 
                    onChange={(e)=>onInputChange(e)}  
                    required/>
              </div>
              <div className = "inputbox">
                <label>Deliverable Related No</label>
                <input 
                    type = "text" 
                    className = "field"
                    placeholder = "Enter Deliverable Related No" 
                    name = "deliverableRelatedNo"  
                    value={deliverableRelatedNo} 
                    onChange={(e)=>onInputChange(e)} 
                    required/>
              </div>
              <div className = "inputbox">
                <label>Deliverable No</label>
                <input 
                    type = "text" 
                    className = "field" 
                    placeholder = "Enter Deliverable No" 
                    name = "deliverableNo" 
                    value={deliverableNo} 
                    onChange={(e)=>onInputChange(e)} 
                    required/>
              </div>
              <div className = "inputbox">
                <label>Deliverable Name</label>
                <input 
                    type = "text" 
                    className = "field" 
                    placeholder = "Enter Deliverable Name" 
                    name = "deliverableName" 
                    value={deliverableName} 
                    onChange={(e)=>onInputChange(e)} 
                    required/>
              </div>
              <div className = "inputbox">
                <label>Description</label>
                <textarea 
                    type = "text" 
                    className = "field" 
                    placeholder = "Enter Description" 
                    name = "description" 
                    value={description} 
                    onChange={(e)=>onInputChange(e)} 
                    required/>
              </div>
              <div className = "inputbox">
                <label>Lead Beneficiary</label>
                <input 
                    type = "text" 
                    className = "field" 
                    placeholder = "Enter Lead Beneficiary" 
                    name = "leadBeneficiary"  value={leadBeneficiary} 
                    onChange={(e)=>onInputChange(e)} 
                    required/>
              </div>
              <div className = "inputbox">
                <label>Type</label>
                <input 
                    type = "text" 
                    className = "field"
                    placeholder = "Enter Type" 
                    name = "type"  
                    value={type} 
                    onChange={(e)=>onInputChange(e)} 
                    required/>
              </div>
              <div className = "inputbox">
                <label>Dissemination Level</label>
                <input 
                    type = "text" 
                    className = "field" 
                    placeholder = "Enter Dissemination Level" 
                    name = "disseminationLevel"  
                    value={disseminationLevel} 
                    onChange={(e)=>onInputChange(e)} 
                    required/>
              </div>
              <div className = "inputbox">
                <label>Due Date</label>
                <input 
                    type = "date" 
                    className = "field" 
                    placeholder = "Select a Date" 
                    name = "dueDate"  
                    value={dueDate} 
                    onChange={(e)=>onInputChange(e)} 
                    required/>
              </div>
              <div className = "buttonsBlock">
                  {addRow? <button type = "submit">Add</button> : <button type = "submit">Update</button> }
                  <button type="button" onClick={discardButtonClicked}>Discard</button>
              </div>
            </form>
        </div>       
        </DialogContent> 
        </Dialog>}
                {/* Dialog- View*/}
        {viewRow && <Dialog
          open={showDiologBox}
          onClose={closeButtonClicked}
          fullWidth
          maxWidth="md"
        >
        <DialogContent>
              <div>                
                    <table className={style["viewDetails"]}>
                        <tbody>
                            <tr>
                                <th>Work Package No</th>
                                <td>{selectedDeliverable.workPackageNo}</td>
                            </tr>
                            <tr>
                                <th>Deliverable Related No</th>
                                <td>{selectedDeliverable.deliverableRelatedNo}</td>
                            </tr>
                            <tr>
                                <th>Deliverable No</th>
                                <td>{selectedDeliverable.deliverableNo}</td>
                            </tr>
                            <tr>
                                <th>Deliverable Name</th>
                                <td>{selectedDeliverable.deliverableName}</td>
                            </tr>
                            <tr>
                                <th>Description</th>
                                <td>{selectedDeliverable.description}</td>
                            </tr>
                            <tr>
                                <th>Lead Beneficiary</th>
                                <td>{selectedDeliverable.leadBeneficiary}</td>
                            </tr>
                            <tr>
                                <th>Type</th>
                                <td>{selectedDeliverable.type}</td>
                            </tr>
                            <tr>
                                <th>Dissemination Level</th>
                                <td>{selectedDeliverable.disseminationLevel}</td>
                            </tr>
                            <tr>
                                <th>Due Date</th>
                                <td>{selectedDeliverable.dueDate}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className = "buttonsBlock"><button onClick={closeButtonClicked}>Close</button></div>
                </div>
      </DialogContent> 
    </Dialog>}
  </>
  );
}
  
export default Deliverables;