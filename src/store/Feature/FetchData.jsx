import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

const url = 'http://dummy.restapiexample.com';

export const fetchData = createAsyncThunk(
 'fetchdata/fetchList',
 async (_, { rejectWithValue }) => {
   try {
     const response = await axios.get(`http://dummy.restapiexample.com/api/v1/employees`, {
       headers: {
         'Content-Type': 'application/json',
       },
     });

     if (response.status === 200) {
       // Return the fetched data on success
       return response.data.data;
     } else {
       throw new Error('Failed to fetch employee data');
     }
   } catch (error) {
     // Handle specific error codes like 429
     if (error.response?.status === 429) {
       toast.error('Too Many Requests. Please try again later.');
     } else {
       // Handle generic error cases
       toast.error(error.response?.data?.message || 'An error occurred while fetching data');
     }

     // Reject with error to handle it in the Redux slice or reducer
     return rejectWithValue(error.response?.data || error.message);
   }
 }
);


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
   if(response.data.status === 200){
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


export const deleteData = createAsyncThunk(
 'deletedata/deletesLists',
 async (dataToSend, { rejectWithValue }) => {
   try {
     const { id } = dataToSend;
     const response = await axios.delete(`https://dummy.restapiexample.com/api/v1/delete/${id}`, {
       headers: {
         'Content-Type': 'application/json',
       },
     });

     // Correct status code check
     if (response.status === 200) {
       toast.success('Employee deleted successfully');
       return response.data.data;
     } else {
       throw new Error('Failed to delete employee');
     }
   } catch (error) {
     // Display toast for Too Many Requests (status code 429)
     if (error.response?.status === 429) {
       toast.error('Failed to delete employee (Too Many Requests)');
     } else {
       // Display generic error toast for other errors
       toast.error(error.response?.data?.message || 'An error occurred');
     }

     // Reject with the error to handle it in the reducer if needed
     return rejectWithValue(error.response?.data || error.message);
   }
 }
);

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
