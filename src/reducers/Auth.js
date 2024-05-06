import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    value: {
      email: '',
      emailErr: '',
      confirm: '',
      password: '',
      passErr: '',
      securePass: true,
      secureConfirm: true,
      loading: false,
      token: null,
      errorMessage: '',
      successMessage: '',
      userId: '',
      offline: '',
      signupStage: 0,
      firstName: '',
      lastName: '',
      userType: 0,
      userTypes: ['Buyer', 'Seller'],
      locations: [],
      showLocations: false,
      firstNameErr: '',
      lastNameErr: '',
      storeName: '',
      storeAddressName: '',
      storeAddress: {},
      deliveryOptions: {},
      deliveryOption: 0,
      deliveryOptionsGroup: ['Pickup', 'Delivery'],
      storeNameErr: '',
      storeAddressErr: '',
      deliveryOptionsErr: '',
    },
  },
  reducers: {
    addToken: (state, action) => {
      state.value.errorMessage = '';
      state.value.token = action.payload;
    },
    addError: (state, action) => {
      state.value.errorMessage = action.payload;
    },
    addSuccess: (state, action) => {
      state.value.successMessage = action.payload;
    },
    storeUser: (state, action) => {
      state.value.userId = action.payload;
    },
    changeStage: (state, action) => {
      state.value.signupStage = action.payload;
    },
    setEmail: (state, action) => {
      state.value.email = action.payload;
    },
    setConfirm: (state, action) => {
      state.value.confirm = action.payload;
    },
    setPassword: (state, action) => {
      state.value.password = action.payload;
    },
    setSecurePass: (state, action) => {
      state.value.securePass = action.payload;
    },
    setSecureConfirm: (state, action) => {
      state.value.secureConfirm = action.payload;
    },
    setEmailErr: (state, action) => {
      state.value.emailErr = action.payload;
    },
    setPassErr: (state, action) => {
      state.value.passErr = action.payload;
    },
    setLoading: (state, action) => {
      state.value.loading = action.payload;
    },
    setFirstName: (state, action) => {
      state.value.firstName = action.payload;
    },
    setLastName: (state, action) => {
      state.value.lastName = action.payload;
    },
    setUserType: (state, action) => {
      state.value.userType = action.payload;
    },
    setFirstNameErr: (state, action) => {
      state.value.firstNameErr = action.payload;
    },
    setLastNameErr: (state, action) => {
      state.value.lastNameErr = action.payload;
    },
    setStoreAddress: (state, action) => {
      state.value.storeAddressName = action.payload;
    },
    setDeliveryOptions: (state, action) => {
      state.value.deliveryOption = action.payload;
      state.value.deliveryOptions = {
        deliveryType: state.value.deliveryOptionsGroup[action.payload],
      };
    },
    setStoreName: (state, action) => {
      state.value.storeName = action.payload;
    },
    setStoreAddressObject: (state, action) => {
      state.value.storeAddress = action.payload;
      state.value.storeAddressName = action.payload.description;
      state.value.showLocations = false;
    },
    setStoreAddressErr: (state, action) => {
      state.value.storeAddressErr = action.payload;
    },
    setDeliveryOptionsErr: (state, action) => {
      state.value.deliveryOptions = action.payload;
    },
    setStoreNameErr: (state, action) => {
      state.value.storeNameErr = action.payload;
    },
    setLocations: (state, action) => {
      state.value.locations = action.payload;
    },
    setShowLocations: (state, action) => {
      state.value.showLocations = action.payload;
    },
    reset: (state) => {
      state.value = {
        email: '',
        emailErr: '',
        confirm: '',
        password: '',
        passErr: '',
        securePass: true,
        secureConfirm: true,
        loading: false,
        token: null,
        errorMessage: '',
        successMessage: '',
        userId: '',
        offline: '',
        signupStage: 0,
        firstName: '',
        lastName: '',
        userType: 0,
        userTypes: ['Buyer', 'Seller'],
        locations: [],
        showLocations: false,
        firstNameErr: '',
        lastNameErr: '',
        storeName: '',
        storeAddressName: '',
        storeAddress: {},
        deliveryOptions: {},
        deliveryOption: 0,
        deliveryOptionsGroup: ['Pickup', 'Delivery'],
        storeNameErr: '',
        storeAddressErr: '',
        deliveryOptionsErr: '',
      };
    },
  },
});

export const {
  addToken,
  addError,
  addSuccess,
  storeUser,
  changeStage,
  setEmail,
  setConfirm,
  setPassword,
  setSecurePass,
  setSecureConfirm,
  setEmailErr,
  setPassErr,
  setLoading,
  setFirstName,
  setLastName,
  setUserType,
  setFirstNameErr,
  setLastNameErr,
  setStoreAddress,
  setDeliveryOptions,
  setStoreName,
  setStoreAddressErr,
  setDeliveryOptionsErr,
  setStoreNameErr,
  setLocations,
  setStoreAddressObject,
  setShowLocations,
  reset,
} = authSlice.actions;

export default authSlice.reducer;
