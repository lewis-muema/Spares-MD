import { createSlice } from '@reduxjs/toolkit';

export const productSlice = createSlice({
  name: 'config',
  initialState: {
    value: {
      name: '',
      nameErr: '',
      description: '',
      price: '',
      brand: '',
      brandErr: '',
      units: '',
      priceErr: '',
      color: '',
      material: '',
      size: '',
      weight: '',
      serialNo: '',
      serialNoErr: '',
      model: null,
      modelObj: {},
      models: [],
      image: '',
      uploadStatus: false,
    },
  },
  reducers: {
    addName: (state, action) => {
      state.value.name = action.payload;
    },
    addNameErr: (state, action) => {
      state.value.nameErr = action.payload;
    },
    addDescription: (state, action) => {
      state.value.description = action.payload;
    },
    addPrice: (state, action) => {
      state.value.price = action.payload;
    },
    addPriceErr: (state, action) => {
      state.value.priceErr = action.payload;
    },
    addSerialNo: (state, action) => {
      state.value.serialNo = action.payload;
    },
    addSerialNoErr: (state, action) => {
      state.value.serialNoErr = action.payload;
    },
    addModel: (state, action) => {
      state.value.model = action.payload.value;
      state.value.modelObj = action.payload;
    },
    addModels: (state, action) => {
      state.value.models = action.payload;
    },
    addImage: (state, action) => {
      state.value.image = action.payload;
    },
    setUploadStatus: (state, action) => {
      state.value.uploadStatus = action.payload;
    },
    setBrand: (state, action) => {
      state.value.brand = action.payload;
    },
    setBrandErr: (state, action) => {
      state.value.brandErr = action.payload;
    },
    setUnits: (state, action) => {
      state.value.units = action.payload;
    },
    setColor: (state, action) => {
      state.value.color = action.payload;
    },
    setMaterial: (state, action) => {
      state.value.material = action.payload;
    },
    setSize: (state, action) => {
      state.value.size = action.payload;
    },
    setWeight: (state, action) => {
      state.value.weight = action.payload;
    },
  },
});

export const {
  addName,
  addDescription,
  addPrice,
  addSerialNo,
  addModel,
  addNameErr,
  addPriceErr,
  addSerialNoErr,
  addModels,
  addImage,
  setUploadStatus,
  setBrand,
  setBrandErr,
  setUnits,
  setColor,
  setMaterial,
  setSize,
  setWeight,
} = productSlice.actions;

export default productSlice.reducer;
