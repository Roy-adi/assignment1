import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

const url = 'http://dummy.restapiexample.com';

export const fetchData = createAsyncThunk('fetchdata/fetchList', async () => {
  try {
    const response = await axios.get(`http://dummy.restapiexample.com/api/v1/employees`,{
     headers: {
     'Content-Type': 'application/json',
    }
    });  
    return response.data.data;
  } catch (error) {
    throw Error(error.response?.data?.message || error.message);
  }
});


export const editData = createAsyncThunk('editdata/editLists', async (dataToSend) => {
 try {
  const {id } = dataToSend;
   const response = await axios.put(`https://dummy.restapiexample.com/api/v1/update/${id}`,{
   ...dataToSend
   } ,{
    headers: {
    'Content-Type': 'application/json',
   }
   }); 
   if(response.statusCode === 200){
    toast.success('Employee updated successfully');
   } else{
    toast.error('Failed to update employee (Too Many Requests)');
   }
   return response.data.data;
 } catch (error) {
  toast.error('Failed to update employee');
   throw Error(error.response?.data?.message || error.message);
 }
});


export const deleteData = createAsyncThunk('deletedata/deletesLists', async (dataToSend) => {
 try {
  const {id } = dataToSend;
   const response = await axios.delete(`https://dummy.restapiexample.com/api/v1/delete/${id}`,{
    headers: {
    'Content-Type': 'application/json',
   }
   });  
   if(response.status === 'success'){
    toast.success('Employee delete successfully');
   } else{
    toast.error('Failed to Delete employee (Too Many Requests)');
   }
   return response.data.data;
 } catch (error) {
   throw Error(error.response?.data?.message || error.message);
 }
});

const fetchDataSlice = createSlice({
  name: 'AllDataList',
  initialState: {
    dataValue: [],
    status: 'idle',
    error: '',
  },
  
  reducers: {},
  
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.dataValue = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'An error occurred';
      })


      .addCase(editData.pending, (state) => {
       state.status = 'loading';
     })
     .addCase(editData.fulfilled, (state, action) => {
       state.status = 'succeeded';
       state.dataValue = action.payload;
     })
     .addCase(editData.rejected, (state, action) => {
       state.status = 'failed';
       state.error = action.error.message || 'An error occurred';
     })


     .addCase(deleteData.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(deleteData.fulfilled, (state, action) => {
      state.status = 'succeeded';
      // state.dataValue = action.payload;
    })
    .addCase(deleteData.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message || 'An error occurred';
    })
  },
});

export default fetchDataSlice.reducer;
