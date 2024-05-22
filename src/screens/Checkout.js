import React, { useState, useContext, useEffect } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Image, ScrollView,
} from 'react-native';
import { Text, Input, Button } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import { signout } from '../actions/Auth';

const CheckoutScreen = () => {
  const dispatch = useDispatch();
  const palettes = useSelector(state => state.palette.value);
  const styles = paletteStyles(palettes.palette, palettes.fontsLoaded);

  return <View style={styles.container}>
    <View style={styles.scrollContainer}>
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.productSection}>
        <View style={styles.rows}>
          <Text>Total cost:</Text>
          <Text style={styles.amounts}>10000</Text>
        </View>
        <View style={styles.rows}>
          <Text>Delivery fee:</Text>
          <Text style={styles.amounts}>10000</Text>
        </View>
        <View style={styles.rows}>
          <Text>Amount to pay:</Text>
          <Text style={styles.amounts}>10000</Text>
        </View>
      </View>
    </ScrollView>
    </View>
    <View style={styles.buttonContainer}>
      <Button
        title='Confirm Order'
        buttonStyle={styles.confirmButton}
        titleStyle={styles.confirmText}
        onPress={() => {}}
      />
    </View>
  </View>;
};

const paletteStyles = palette => StyleSheet.create({
  container: {
    height: '100%',
  },
  scrollContainer: {
    flexShrink: 1,
  },
  buttonContainer: {
    padding: 10,
  },
  confirmText: {
    fontSize: 20,
  },
  productSection: {
    borderRadius: 10,
    marginBottom: 20,
    margin: 10,
    padding: 20,
    backgroundColor: palette.background,
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
  },
  confirmButton: {
    backgroundColor: palette.text,
    paddingHorizontal: 15,
    marginTop: 10,
    justifyContent: 'center',
    marginBottom: 10,
  },
  rows: {
    flexDirection: 'row',
  },
  amounts: {
    marginLeft: 'auto',
  },
});

export default CheckoutScreen;
