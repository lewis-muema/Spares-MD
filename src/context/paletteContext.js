import AsyncStorage from '@react-native-async-storage/async-storage';
import createDataContext from './createDataContext';

const paletteReducer = (state, action) => {
  switch (action.type) {
    case 'change_theme':
      return { ...state, palette: state.palettes[action.payload] };
    case 'change_active_palette':
      return { ...state, activePalette: action.payload };
    case 'change_bg':
      return { ...state, activeBgImage: action.payload };
    case 'change_active_bg':
      return { ...state, background: state.backgrounds[action.payload] };
    case 'fonts_loaded':
      return { ...state, fontsLoaded: action.payload };
    case 'show_info_card':
      return { ...state, infoCard: action.payload };
    default:
      return state;
  }
};

const storeData = async (key, value) => {
  await AsyncStorage.setItem(key, value);
};

const changeTheme = dispatch => (index) => {
  dispatch({ type: 'change_theme', payload: index });
  dispatch({ type: 'change_active_palette', payload: index });
  storeData('theme', JSON.stringify(index));
};

const changeBG = dispatch => (index) => {
  dispatch({ type: 'change_bg', payload: index });
  dispatch({ type: 'change_active_bg', payload: index });
  storeData('bg', JSON.stringify(index));
};

const fontsLoadedStatus = dispatch => (val) => {
  dispatch({ type: 'fonts_loaded', payload: val });
};

const showInfoCard = dispatch => (val) => {
  dispatch({ type: 'show_info_card', payload: val });
};

export const { Provider, Context } = createDataContext(
  paletteReducer,
  {
    changeTheme,
    changeBG,
    fontsLoadedStatus,
    showInfoCard,
  },
  {
    activePalette: 0,
    activeBgImage: 0,
    fontsLoaded: false,
    infoCard: false,
    palette: {
      background: '#faeed9',
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
        background: '#faeed9',
        text: '#113231',
        buttonsInactive: '#cf7033',
        metricsTop: '#b6541c',
        metricsBottom: '#5c2f16',
      },
      {
        background: '#f8f4cb',
        text: '#222e34',
        buttonsInactive: '#408384',
        metricsTop: '#ee7755',
        metricsBottom: '#ae5c4e',
      },
      {
        background: '#9af5d7',
        text: '#0c243d',
        buttonsInactive: '#0c5d7a',
        metricsTop: '#8696b8',
        metricsBottom: '#6583be',
      },
      {
        background: '#f1a4f5',
        text: '#161a2e',
        buttonsInactive: '#636379',
        metricsTop: '#316072',
        metricsBottom: '#263667',
      },
      {
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
);
