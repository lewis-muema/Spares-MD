import { createSlice } from '@reduxjs/toolkit';

export const checkoutSlice = createSlice({
  name: 'cart',
  initialState: {
    value: {
      locationName: '',
      lastLocation: '',
      locationSuggestions: [],
      locationObject: '',
      locationCoordinates: {},
      selectedDelivery: 0,
      locationErr: '',
      showLocations: false,
      selectedPaymentMethod: 0,
      allPaymentMethods: [],
      addedPaymentMethod: {},
      addedPaymentMethodNumber: '',
      paymentMethodNumberErr: '',
      userPaymentMethods: [],
      paymentLoading: false,
      paymentTypes: ['Pay now', 'Pay on delivery'],
      paymentTypeOption: 0,
      pricing: {
        VAT: '__', VATRate: '__', currency: '', deliveryFee: '__', productTotal: '__', serviceFee: '__', serviceFeeRate: '__',
      },
      loading: false,
      successMessage: '',
      errorMessage: '',
      orderDetails: {},
    },
  },
  reducers: {
    setLocationName: (state, action) => {
      state.value.locationName = action.payload;
    },
    setLastLocation: (state, action) => {
      state.value.lastLocation = action.payload;
    },
    setLocationSuggestions: (state, action) => {
      state.value.locationSuggestions = action.payload;
    },
    setLocationObject: (state, action) => {
      state.value.locationObject = action.payload;
    },
    setLocationCoordinates: (state, action) => {
      state.value.locationCoordinates = action.payload;
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
    setSelectedPaymentMethod: (state, action) => {
      state.value.selectedPaymentMethod = action.payload;
    },
    setAddedPaymentMethod: (state, action) => {
      state.value.addedPaymentMethod = action.payload;
    },
    setAddedPaymentMethodNumber: (state, action) => {
      state.value.addedPaymentMethodNumber = action.payload;
    },
    setPaymentMethodNumberErr: (state, action) => {
      state.value.paymentMethodNumberErr = action.payload;
    },
    setAllPaymentMethods: (state, action) => {
      state.value.allPaymentMethods = action.payload;
    },
    setUserPaymentMethods: (state, action) => {
      state.value.userPaymentMethods = action.payload;
    },
    setPaymentLoading: (state, action) => {
      state.value.paymentLoading = action.payload;
    },
    setPricing: (state, action) => {
      state.value.pricing = action.payload;
    },
    setLoading: (state, action) => {
      state.value.loading = action.payload;
    },
    setSuccessMessage: (state, action) => {
      state.value.successMessage = action.payload;
    },
    setErrorMessage: (state, action) => {
      state.value.errorMessage = action.payload;
    },
    setPaymentTypeOption: (state, action) => {
      state.value.paymentTypeOption = action.payload;
      state.value.selectedPaymentMethod = 0;
    },
    setOrderDetails: (state, action) => {
      state.value.orderDetails = action.payload;
    },
    reset: (state) => {
      state.value = {
        locationName: '',
        lastLocation: '',
        locationSuggestions: [],
        locationObject: '',
        locationCoordinates: {},
        selectedDelivery: 0,
        locationErr: '',
        showLocations: false,
        selectedPaymentMethod: 0,
        allPaymentMethods: [],
        addedPaymentMethod: {},
        addedPaymentMethodNumber: '',
        paymentMethodNumberErr: '',
        userPaymentMethods: [],
        paymentLoading: false,
        paymentTypes: ['Pay now', 'Pay on delivery'],
        paymentTypeOption: 0,
        pricing: {
          VAT: '__', VATRate: '__', currency: '', deliveryFee: '__', productTotal: '__', serviceFee: '__', serviceFeeRate: '__',
        },
        loading: false,
        successMessage: '',
        errorMessage: '',
        orderDetails: {},
      };
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
  setSelectedPaymentMethod,
  setAddedPaymentMethod,
  setAddedPaymentMethodNumber,
  setPaymentMethodNumberErr,
  setAllPaymentMethods,
  setUserPaymentMethods,
  setPaymentLoading,
  setPricing,
  setLoading,
  setLastLocation,
  setPaymentTypeOption,
  setLocationCoordinates,
  setSuccessMessage,
  setErrorMessage,
  setOrderDetails,
  reset,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
