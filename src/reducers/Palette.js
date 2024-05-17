import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const paletteSlice = createSlice({
  name: 'palette',
  initialState: {
    value: {
      activePalette: 0,
      activeBgImage: 0,
      fontsLoaded: false,
      infoCard: false,
      palette: {
        outline: '#ffffff',
        background: '#ffffff',
        text: '#113231',
        buttonsInactive: '#cf7033',
        metricsTop: '#b6541c',
        metricsBottom: '#5c2f16',
      },
      background: {
        image: require('../../assets/bg4.png'),
      },
      palettes: [
        {
          outline: '#ffffff',
          background: '#faeed9',
          text: '#113231',
          buttonsInactive: '#cf7033',
          metricsTop: '#b6541c',
          metricsBottom: '#5c2f16',
        },
        {
          outline: '#ffffff',
          background: '#f8f4cb',
          text: '#222e34',
          buttonsInactive: '#408384',
          metricsTop: '#ee7755',
          metricsBottom: '#ae5c4e',
        },
        {
          outline: '#ffffff',
          background: '#9af5d7',
          text: '#0c243d',
          buttonsInactive: '#0c5d7a',
          metricsTop: '#8696b8',
          metricsBottom: '#6583be',
        },
        {
          outline: '#ffffff',
          background: '#f1a4f5',
          text: '#161a2e',
          buttonsInactive: '#636379',
          metricsTop: '#316072',
          metricsBottom: '#263667',
        },
        {
          outline: '#ffffff',
          background: '#fa508b',
          text: '#161a2e',
          buttonsInactive: '#636379',
          metricsTop: '#316072',
          metricsBottom: '#263667',
        },
      ],
      backgrounds: [
        {
          image: require('../../assets/bg4.png'),
        },
      ],
    },
  },
  reducers: {
    changeTheme: (state, action) => {
      state.value.palette = state.value.palettes[action.payload];
      state.value.activePalette = action.payload;
    },
    changeBG: (state, action) => {
      state.value.background = state.value.backgrounds[action.payload];
      state.value.activeBgImage = action.payload;
    },
    fontsLoadedStatus: (state, action) => {
      state.value.fontsLoaded = action.payload;
    },
    showInfoCard: (state, action) => {
      state.value.infoCard = action.payload;
    },
  },
});

export const {
  changeTheme, changeBG, fontsLoadedStatus, showInfoCard,
} = paletteSlice.actions;

export default paletteSlice.reducer;
