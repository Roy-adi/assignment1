import { configureStore } from "@reduxjs/toolkit";
import fetchDataReducer from './Feature/FetchData'

export const store = configureStore({
  reducer: {
    // Define your reducers here
    fetchData: fetchDataReducer,
  },
  // Add middleware here for logging, throttling, etc.
})