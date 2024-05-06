import React, { useState, useContext, useEffect } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView,
} from 'react-native';
import { Text, Input, Button } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import { signout } from '../actions/Auth';

const AccountScreen = () => {
  const dispatch = useDispatch();

  const styles = paletteStyles();
  return <View style={styles.container}>
    <Text>Account screen</Text>
    <Button
      title='Sign out'
      buttonStyle={styles.signupButton}
      titleStyle={styles.signupButtonText}
      onPress={() => dispatch(signout()) }
    />
  </View>;
};

const paletteStyles = palette => StyleSheet.create({
});

export default AccountScreen;
