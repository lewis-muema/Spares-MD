import React, { useState, useContext, useEffect } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text, Input, Button } from 'react-native-elements';
import { Context as PaletteContext } from '../context/paletteContext';

const SignUpScreen = () => {
  const navigation = useNavigation();
  const { state: { palette } } = useContext(PaletteContext);

  const styles = paletteStyles(palette);
  return <View style={styles.container}>
    <Text>Sign up screen</Text>
    <Button
      title='Sign in'
      buttonStyle={styles.signupButton}
      titleStyle={styles.signupButtonText}
      onPress={() => navigation.navigate('Auth', { screen: 'Signin' }) }
    />
  </View>;
};

const paletteStyles = palette => StyleSheet.create({
});

export default SignUpScreen;
