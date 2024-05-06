import React, { useEffect } from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity, Image, ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Feather } from '@expo/vector-icons';
import { Buffer } from 'buffer';
import { useSelector, useDispatch } from 'react-redux';
import { uploadPhoto, fetchConfig } from '../actions/Product';
import { addImage } from '../reducers/Product';

const ImagePicker = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const palettes = useSelector(state => state.palette.value);
  const product = useSelector(state => state.product.value);
  const styles = paletteStyles(palettes.palette, palettes.fontsLoaded);

  useEffect(() => {
    navigation.addListener('focus', () => {
      dispatch(fetchConfig());
      dispatch(addImage());
    });
  }, []);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
        copyToCacheDirectory: true,
      });
      if (result?.assets[0]?.uri) {
        const binaryIMG = await FileSystem.readAsStringAsync(
          result?.assets[0]?.uri,
          { encoding: FileSystem?.EncodingType?.Base64 },
        );
        const photo = Buffer.from(binaryIMG, 'base64');
        dispatch(uploadPhoto(photo, result?.assets[0]));
      }
    } catch (error) { /* empty */ }
  };
  return <View style={styles.spacer}>
    <TouchableOpacity onPress={pickDocument}>
      <View style={styles.outerBorder}>
        {
          product.image
            ? <Image
          style={styles.productImage}
          source={{
            uri: product.image,
          }}
        />
            : <View style={styles.innerAdd}>{ product.uploadStatus
              ? <ActivityIndicator size="large" color={palettes.palette.text} />
              : <Feather name="upload-cloud" size={24} color={palettes.palette.text} /> }</View>
        }
      </View>
    </TouchableOpacity>
  </View>;
};

const paletteStyles = palette => StyleSheet.create({
  spacer: {
    marginVertical: 10,
    marginHorizontal: 20,
  },
  outerBorder: {
    borderWidth: 1,
    borderColor: palette.text,
    borderStyle: 'dashed',
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  innerAdd: {
    fontSize: 50,
  },
  productImage: {
    width: '90%',
    height: '90%',
    resizeMode: 'contain',
  },
});

export default ImagePicker;
