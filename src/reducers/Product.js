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
      unitsErr: '',
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
      variant: {
        brand: '',
        color: '',
        material: '',
        size: '',
        units: '',
        weight: '',
      },
      variants: [],
      image: '',
      imageErr: '',
      modelErr: '',
      uploadStatus: false,
      errorMessage: '',
      successMessage: '',
      loading: false,
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
      state.value.modelErr = '';
    },
    addModels: (state, action) => {
      state.value.models = action.payload;
    },
    addImage: (state, action) => {
      state.value.image = action.payload;
      state.value.imageErr = '';
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
    setUnitsErr: (state, action) => {
      state.value.unitsErr = action.payload;
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
    setVariant: (state, action) => {
      state.value.variant[action.payload.key] = action.payload.value;
    },
    setVariantObject: (state, action) => {
      state.value.variant = action.payload;
    },
    addVariant: (state, action) => {
      state.value.variants.push(action.payload);
    },
    editVariant: (state, action) => {
      state.value.variants[action.payload.index] = action.payload.object;
    },
    removeVariant: (state, action) => {
      state.value.variants.splice(action.payload, 1);
    },
    resetVariant: (state, action) => {
      state.value.variant = {
        brand: '',
        color: '',
        material: '',
        size: '',
        units: '',
        weight: '',
      };
    },
    setErrorMessage: (state, action) => {
      state.value.errorMessage = action.payload;
    },
    setSuccessMessage: (state, action) => {
      state.value.successMessage = action.payload;
    },
    setImageErr: (state, action) => {
      state.value.imageErr = action.payload;
    },
    setModelErr: (state, action) => {
      state.value.modelErr = action.payload;
    },
    setLoading: (state, action) => {
      state.value.loading = action.payload;
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
  setUnitsErr,
  setVariant,
  addVariant,
  removeVariant,
  resetVariant,
  setVariantObject,
  editVariant,
  setErrorMessage,
  setImageErr,
  setModelErr,
  setSuccessMessage,
  setLoading,
} = productSlice.actions;

export default productSlice.reducer;
