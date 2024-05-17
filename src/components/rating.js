import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const Rating = ({ rating }) => {
  const totalStars = 5;
  const gainStars = rating ? Math.floor(rating) : 0;
  return (
    <View style={styles.reviewStars}>
      {
        Array.from({ length: gainStars }, (x, i) => {
          return (
            <MaterialIcons key={i} name="star" size={20} color="#FFA000"/>
          );
        })
      }
      {
        Array.from({ length: totalStars - gainStars }, (x, i) => {
          return (
            <MaterialIcons key={i} name="star-border" size={20} color="#FFA000" />
          );
        })
      }
    </View>
  );
};

const styles = StyleSheet.create({
  reviewStars: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginVertical: 5,
  },
});

export default Rating;
