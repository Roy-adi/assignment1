import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { deleteData, editData, fetchData } from '../store/Feature/FetchData';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Card, Container, IconButton, Typography } from '@mui/material';
import { Edit, Delete, Save,Close } from '@mui/icons-material';
import toast from 'react-hot-toast';

const Home = () => {
 const dispatch = useDispatch();
 const { dataValue, status, error } = useSelector((state) => state.fetchData);
 const [editRowId, setEditRowId] = useState(null); // To track which row is being edited
 const [editableRow, setEditableRow] = useState(null); // Store editable row data

 useEffect(() => {
   dispatch(fetchData());
 }, [dispatch]);

 // Handle Edit Click
 const handleEditClick = (employee) => {
   setEditRowId(employee.id);
   setEditableRow({ ...employee });
 };

 // Handle Save Click (Update API Call)
 const handleSaveClick =  (id) => {
   try {
    const dataToSend = { 
     name: editableRow.employee_name,
     salary: editableRow.employee_salary,
     age: editableRow.employee_age,
     id: id
    }
     const response = dispatch(editData(dataToSend))
     console.log('Update successful:', response.data);
     setEditRowId(null); // Exit edit mode after successful update
     dispatch(fetchData()); // Refresh data after save
   } catch (error) {
     console.error('Error updating employee:', error);
     toast.error('Failed to update employee');
   }
 };

 // Handle Delete Click (Delete API Call)
 const handleDeleteClick = async (id) => {
   try {
    const dataToSend = { id: id };
    const response = dispatch(deleteData(dataToSend))
     console.log('Delete successful:', response.data);
     dispatch(fetchData()); // Refresh data after delete
   } catch (error) {
     console.error('Error deleting employee:', error);
     toast.error('Failed to delete employee');
   }
 };

 // Handle input change in editable row
 const handleInputChange = (e) => {
   const { name, value } = e.target;
   setEditableRow((prev) => ({
     ...prev,
     [name]: value,
   }));
 };

 const handleCancelEdit = () => {
  setEditRowId(null);
};

 return (
   <Container maxWidth="xd" >
     <Card style={{marginTop:'40px', }}>
       <Typography variant="h5" align="center" sx={{ padding: 2 }}>
       {editRowId
        ? `Edit Employee of ${editableRow.employee_name}`
        : 'All Employee Data'}
       </Typography>
       <TableContainer component={Paper} sx={{ maxHeight: 600 }}> {/* Set fixed height */}
         <Table stickyHeader>
           <TableHead>
             <TableRow>
               <TableCell>ID</TableCell>
               <TableCell>Employee Name</TableCell>
               <TableCell>Employee Age</TableCell>
               <TableCell>Employee Salary</TableCell>
               <TableCell align="center">Actions</TableCell>
             </TableRow>
           </TableHead>
           <TableBody>
             {status === 'loading' ? (
               <TableRow>
                 <TableCell colSpan={5} align="center">
                   Loading...
                 </TableCell>
               </TableRow>
             ) : dataValue.length > 0 ? (
               dataValue.map((employee) => (
                 <TableRow key={employee.id}>
                   <TableCell>{employee.id}</TableCell>
                   <TableCell>
                     {editRowId === employee.id ? (
                       <input
                         name="employee_name"
                         value={editableRow.employee_name}
                         onChange={handleInputChange}
                       />
                     ) : (
                       employee.employee_name
                     )}
                   </TableCell>
                   <TableCell>
                     {editRowId === employee.id ? (
                       <input
                         name="employee_age"
                         value={editableRow.employee_age}
                         onChange={handleInputChange}
                       />
                     ) : (
                       employee.employee_age
                     )}
                   </TableCell>
                   <TableCell>
                     {editRowId === employee.id ? (
                       <input
                         name="employee_salary"
                         value={editableRow.employee_salary}
                         onChange={handleInputChange}
                       />
                     ) : (
                       employee.employee_salary
                     )}
                   </TableCell>
                   <TableCell align="center">
                   {editRowId === employee.id ? (
                     <>
                       <IconButton onClick={() => handleSaveClick(employee.id)}>
                         <Save />
                       </IconButton>
                       <IconButton onClick={handleCancelEdit}>
                         <Close />
                       </IconButton>
                     </>
                   ) : (
                     <>
                       <IconButton onClick={() => handleEditClick(employee)}>
                         <Edit />
                       </IconButton>
                       <IconButton onClick={() => handleDeleteClick(employee.id)}>
                         <Delete />
                       </IconButton>
                     </>
                   )}
                 </TableCell>
                 </TableRow>
               ))
             ) : (
               <TableRow>
                 <TableCell colSpan={5} align="center">
                   <Typography variant="h6">No data found</Typography>
                 </TableCell>
               </TableRow>
             )}
           </TableBody>
         </Table>
       </TableContainer>
     </Card>
   </Container>
 );
};

export default Home