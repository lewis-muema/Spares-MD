import React, { useState, useContext, useEffect } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text, Input, Button } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import { validateAuth } from '../actions/Auth';

const ProductsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(validateAuth());
    navigation.addListener('focus', () => {
    });
  }, []);

  const styles = paletteStyles();
  return <View style={styles.container}>
    <Text>Products screen</Text>
    <Button
      title='Add a product'
      buttonStyle={styles.signupButton}
      titleStyle={styles.signupButtonText}
      onPress={() => navigation.navigate('AddProduct') }
    />
  </View>;
};

const paletteStyles = palette => StyleSheet.create({
});

export default ProductsScreen;
