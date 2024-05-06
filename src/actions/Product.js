import AsyncStorage from '@react-native-async-storage/async-storage';
import { storeConfig } from '../reducers/Config';
import { addImage, addModels, setUploadStatus } from '../reducers/Product';
import spares from '../api/spares';
import photos from '../api/googlephotos';

const storeData = async (key, value) => {
  await AsyncStorage.setItem(key, value);
};

export const removeData = (key) => {
  return async () => {
    await AsyncStorage.removeItem(key);
  };
};

export const fetchConfig = () => {
  return async (dispatch) => {
    spares.get('/get-photo-configs').then((res) => {
      storeData('photos', res?.data?.access_token);
      dispatch(storeConfig(res?.data?.access_token));
    }).catch((err) => {});
  };
};

export const fetchModels = () => {
  return async (dispatch) => {
    spares.get('/car-models').then((res) => {
      const models = [];
      res.data.models.forEach((model) => {
        model.label = model.name;
        model.value = model._id;
        models.push(model);
      });
      dispatch(addModels(models));
    }).catch((err) => {});
  };
};

export const uploadPhoto = (photoData, data) => {
  return async (dispatch) => {
    dispatch(setUploadStatus(true));
    photos.post('/v1/uploads', photoData, { 'Content-Type': 'application/octet-stream' }).then((res) => {
      dispatch(batchUpload(res.data, data));
    }).catch((err) => {
      dispatch(setUploadStatus(false));
    });
  };
};

export const batchUpload = (uploadToken, data) => {
  return async (dispatch) => {
    photos.post('/v1/mediaItems:batchCreate', {
      newMediaItems: [
        {
          description: data.name,
          simpleMediaItem: {
            uploadToken,
          },
        },
      ],
    }, { 'Content-Type': 'application/json' }).then((res) => {
      if (res?.data?.newMediaItemResults[0]?.status?.message === 'Success') {
        dispatch(getPhotoURL(res?.data?.newMediaItemResults[0]?.mediaItem?.id));
      }
    }).catch((err) => {
      dispatch(setUploadStatus(false));
    });
  };
};

export const getPhotoURL = (photoId) => {
  return async (dispatch) => {
    photos.get(`/v1/mediaItems/${photoId}`, { 'Content-Type': 'application/json' }).then((res) => {
      dispatch(addImage(res.data.baseUrl));
      dispatch(setUploadStatus(false));
    }).catch((err) => {
      dispatch(setUploadStatus(false));
    });
  };
};

export const createProduct = () => {
  return async (dispatch) => {
    spares.get('/car-models').then((res) => {
      const models = [];
      res.data.models.forEach((model) => {
        model.label = model.name;
        model.value = model._id;
        models.push(model);
      });
      dispatch(addModels(models));
    }).catch((err) => {});
  };
};
