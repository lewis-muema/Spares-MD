import React, { useState, useContext, useEffect } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text, Input, Button } from 'react-native-elements';
import { Context as PaletteContext } from '../context/paletteContext';

const ProductsScreen = () => {
  const navigation = useNavigation();
  const { state: { palette } } = useContext(PaletteContext);

  const styles = paletteStyles(palette);
  return <View style={styles.container}>
    <Text>Products screen</Text>
    <Button
      title='Orders'
      buttonStyle={styles.signupButton}
      titleStyle={styles.signupButtonText}
      onPress={() => navigation.navigate('Home', { screen: 'Orders' }) }
    />
  </View>;
};

const paletteStyles = palette => StyleSheet.create({
});

export default ProductsScreen;
