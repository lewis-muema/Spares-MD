import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import { storeConfig } from '../reducers/Config';
import * as RootNavigation from '../RootNavigation';
import {
  addImage, addModels, setUploadStatus,
  setSuccessMessage, setErrorMessage, setPhotoId,
  setLoading, setProducts, setSearchLoading,
} from '../reducers/Product';
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
      albumId: 'APeD70KFUe38TRSyq9BETOW-Pz30CRzbZ5EFE_sbpkAGwqK18_krC05Bx39-ZOeiDMH6ap61EsCs',
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
      dispatch(setPhotoId(photoId));
      dispatch(setUploadStatus(false));
    }).catch((err) => {
      dispatch(setUploadStatus(false));
    });
  };
};

export const createProduct = (payload) => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    spares.post('/products', payload).then((res) => {
      dispatch(setSuccessMessage(res?.data?.message));
      dispatch(setLoading(false));
      setTimeout(() => {
        dispatch(setSuccessMessage(''));
        RootNavigation.navigate('Products');
      }, 3000);
    }).catch((err) => {
      dispatch(setErrorMessage(`Failed to create product: ${err?.response?.data?.error}`));
      dispatch(setLoading(false));
    });
  };
};

export const fetchProducts = () => {
  return async (dispatch) => {
    dispatch(setLoading(true));
    spares.get('/products').then((res) => {
      dispatch(setProducts(res?.data?.products));
      dispatch(setSuccessMessage(res?.data?.message));
      dispatch(setLoading(false));
      setTimeout(() => {
        dispatch(setSuccessMessage(''));
      }, 3000);
    }).catch((err) => {
      dispatch(setProducts([]));
      dispatch(setLoading(false));
    });
  };
};

export const searchProduct = (name, sendID) => {
  return async (dispatch) => {
    dispatch(setSearchLoading(true));
    let userId;
    if (sendID) {
      userId = await AsyncStorage.getItem('userId');
    }
    spares.post('/products-search', { name, userId }).then((res) => {
      dispatch(setProducts(res?.data?.products));
      dispatch(setSearchLoading(false));
    }).catch((err) => {
      dispatch(setProducts([]));
      dispatch(setSearchLoading(false));
    });
  };
};
