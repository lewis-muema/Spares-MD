import React, { useState, useContext, useEffect } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text, Input, Button } from 'react-native-elements';

const OrdersScreen = () => {
  const navigation = useNavigation();

  const styles = paletteStyles();
  return <View style={styles.container}>
    <Text>Orders screen</Text>
    <Button
      title='Account'
      buttonStyle={styles.signupButton}
      titleStyle={styles.signupButtonText}
      onPress={() => navigation.navigate('Home', { screen: 'Account' }) }
    />
  </View>;
};

const paletteStyles = palette => StyleSheet.create({
});

export default OrdersScreen;
