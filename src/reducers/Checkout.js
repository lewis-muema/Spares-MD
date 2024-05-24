import { createSlice } from '@reduxjs/toolkit';

export const checkoutSlice = createSlice({
  name: 'cart',
  initialState: {
    value: {
      locationName: '',
      locationSuggestions: [],
      locationObject: '',
      selectedDelivery: 0,
      locationErr: '',
      showLocations: false,
    },
  },
  reducers: {
    setLocationName: (state, action) => {
      state.value.locationName = action.payload;
    },
    setLocationSuggestions: (state, action) => {
      state.value.locationSuggestions = action.payload;
    },
    setLocationObject: (state, action) => {
      state.value.locationObject = action.payload;
    },
    setSelectedDelivery: (state, action) => {
      state.value.selectedDelivery = action.payload;
    },
    setLocationErr: (state, action) => {
      state.value.locationErr = action.payload;
    },
    setShowLocations: (state, action) => {
      state.value.showLocations = action.payload;
    },
  },
});

export const {
  setLocationName,
  setLocationSuggestions,
  setLocationObject,
  setSelectedDelivery,
  setLocationErr,
  setShowLocations,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
