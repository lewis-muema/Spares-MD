import AsyncStorage from '@react-native-async-storage/async-storage';
import { changeTheme, changeBG } from '../reducers/Palette';

const storeData = async (key, value) => {
  await AsyncStorage.setItem(key, value);
};

export const editTheme = (index) => {
  return async (dispatch) => {
    dispatch(changeTheme(index));
    storeData('theme', JSON.stringify(index));
  };
};

export const editBG = (index) => {
  return async (dispatch) => {
    dispatch(changeBG(index));
    storeData('bg', JSON.stringify(index));
  };
};
