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
import { Box, Card, Container, IconButton, Typography } from '@mui/material';
import { Edit, Delete, Save,Close } from '@mui/icons-material';
import toast from 'react-hot-toast';
import CircularProgress from '@mui/material/CircularProgress';
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
  <Container maxWidth="xd" sx={{ marginTop: 5 }}>
  <Card sx={{ padding: 3, boxShadow: 3 }}>
    <Typography
      variant="h5"
      align="center"
      sx={{
        padding: 2,
        fontWeight: 'bold',
        color: 'primary.main',
      }}
    >
      {editRowId
        ? `Edit Employee of ${editableRow.employee_name}`
        : 'All Employee Data'}
    </Typography>
    <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Employee Name</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Employee Age</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Employee Salary</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }} align="center">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {status === 'loading' ? (
            <TableRow>
              <TableCell colSpan={5} align="center">
                <Typography variant="body1" color="text.secondary">
                <CircularProgress />
                </Typography>
              </TableCell>
            </TableRow>
          ) : dataValue.length > 0 ? (
            dataValue.map((employee) => (
              <TableRow
                key={employee.id}
                sx={{
                  '&:nth-of-type(odd)': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <TableCell>{employee.id}</TableCell>
                <TableCell>
                  {editRowId === employee.id ? (
                    <input
                      name="employee_name"
                      value={editableRow.employee_name}
                      onChange={handleInputChange}
                      style={{
                        borderRadius: '4px',
                        padding: '4px',
                        width: '100%',
                      }}
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
                      style={{
                        borderRadius: '4px',
                        padding: '4px',
                        width: '100%',
                      }}
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
                      style={{
                        borderRadius: '4px',
                        padding: '4px',
                        width: '100%',
                      }}
                    />
                  ) : (
                    employee.employee_salary
                  )}
                </TableCell>
                <TableCell align="center">
                  {editRowId === employee.id ? (
                    <Box>
                      <IconButton
                        onClick={() => handleSaveClick(employee.id)}
                        sx={{ color: 'success.main' }}
                      >
                        <Save />
                      </IconButton>
                      <IconButton onClick={handleCancelEdit} sx={{ color: 'error.main' }}>
                        <Close />
                      </IconButton>
                    </Box>
                  ) : (
                    <Box>
                      <IconButton
                        onClick={() => handleEditClick(employee)}
                        sx={{ color: 'primary.main' }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteClick(employee.id)}
                        sx={{ color: 'error.main' }}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center">
                <Typography variant="h6" color="text.secondary">
                  No data found
                </Typography>
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