
import React, { useState, useContext, useEffect } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Image,
  KeyboardAvoidingView, FlatList, ScrollView, RefreshControl,
} from 'react-native';
import {
  Entypo, MaterialCommunityIcons, Ionicons, MaterialIcons, AntDesign,
} from '@expo/vector-icons';
import {
  Text, Input, Button, Dialog,
} from 'react-native-elements';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { cancelOrder } from '../actions/Orders';
import { signout } from '../actions/Auth';

const TrackScreen = () => {
  const dispatch = useDispatch();
  const [visibleDialog, setVisibleDialog] = useState(false);
  const track = useSelector(state => state.track.value);
  const orders = useSelector(state => state.orders.value);
  const palettes = useSelector(state => state.palette.value);

  const styles = paletteStyles(palettes.palette, palettes.fontsLoaded);

  const cancel = () => {
    setVisibleDialog(false);
    dispatch(cancelOrder(track?.order?._id));
  };

  return <View style={styles.container}>
    <View style={styles.scrollContainer}>
    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled' refreshControl={
        <RefreshControl refreshing={orders.loading} />
      }>
    <View style={styles.timeline}>
      <Text numberOfLines={1} style={styles.productDetailsName}>
        Timeline
      </Text>
      <FlatList
        horizontal={false}
        numColumns={1}
        scrollEnabled={false}
        keyboardShouldPersistTaps='handled'
        showsHorizontalScrollIndicator={false}
        data={track?.order?.timeline}
        style={styles.timelineGroup}
        renderItem={({ item, index }) => <View style={styles.timelineRows}>
          <MaterialCommunityIcons name={item.event === 'future' ? 'timeline-check-outline' : 'timeline-check'} size={24} color={palettes.palette.text} />
          <View style={styles.timelineTextRow}>
            <Text style={styles.timelineTextTop}>{ item.time ? moment(item.time).format('hh:mm:ss a DD/MM/yyyy') : 'Next' }</Text>
            <Text style={styles.timelineTextBottom}>{ item.activity }</Text>
          </View>
        </View>} />
    </View>
    <View style={styles.expandedView}>
      <Text numberOfLines={1} style={styles.productDetailsName}>
        Products
      </Text>
    </View>
    <FlatList
      horizontal={false}
      numColumns={1}
      scrollEnabled={false}
      keyboardShouldPersistTaps='handled'
      showsHorizontalScrollIndicator={false}
      data={track?.order?.products}
      style={styles.variantGroup}
      keyExtractor={() => Math.random().toString(36).substr(2, 9) }
      renderItem={({ item, index }) => <View style={styles.productDetails}>
        <View style={styles.productDescription}>
          <Image style={styles.productDetailsImage} source={{ uri: item.image }}/>
          <Text numberOfLines={3} style={styles.productDetailsName}>
            {item.name}
          </Text>
        </View>
        <View style={styles.expandedProductView}>
        <View style={styles.expandedProductCol}>
        <View style={styles.productsRow}>
          <MaterialIcons name="numbers" size={18} color={palettes.palette.text} style={styles.productIcon} />
          <Text numberOfLines={1} style={styles.productDetailRow}>{item.units} units(s)</Text>
        </View>
        <View style={styles.productsRow}>
          <Entypo name="price-tag" size={18} color={palettes.palette.text} style={styles.productIcon} />
          <Text numberOfLines={1} style={styles.productDetailRow}>
            {item.currency} {item.price}
          </Text>
        </View>
        <View style={styles.productsRow}>
          <AntDesign name="barcode" size={18} color={palettes.palette.text} style={styles.productIcon} />
          <Text numberOfLines={1} style={styles.productDetailRow}>{item.serialNo}</Text>
        </View>
        <View style={styles.productsRow}>
          <Ionicons name="color-palette-outline" size={18} color={palettes.palette.text} style={styles.productIcon} />
          <Text numberOfLines={1} style={styles.productDetailRow}>{item.color}</Text>
        </View>
        </View>
        <View style={styles.expandedProductCol}>
        <View style={styles.productsRow}>
        <MaterialCommunityIcons name="gold" size={18} color={palettes.palette.text} style={styles.productIcon} />
        <Text numberOfLines={1} style={styles.productDetailRow}>{item.material}</Text>
        </View>
        <View style={styles.productsRow}>
          <MaterialCommunityIcons name="resize" size={18} color={palettes.palette.text} style={styles.productIcon} />
          <Text numberOfLines={1} style={styles.productDetailRow}>{item.size}</Text>
        </View>
        <View style={styles.productsRow}>
          <MaterialCommunityIcons name="weight-kilogram" size={18} color={palettes.palette.text} style={styles.productIcon} />
          <Text numberOfLines={1} style={styles.productDetailRow}>{item.weight}</Text>
        </View>
        </View>
        </View>
      </View>}/>
      </ScrollView>
    </View>
    <View style={{ flexGrow: 1 }}></View>
    <View style={styles.buttonContainer}>
      <Button
        title='Cancel order'
        buttonStyle={styles.cancelButton}
        titleStyle={styles.cancelButtonText}
        disabled={orders.loading}
        onPress={() => setVisibleDialog(true)}
      />
      <Button
        title='Edit order'
        buttonStyle={styles.editButton}
        titleStyle={styles.cancelButtonText}
        disabled={orders.loading}
        onPress={() => {}}
      />
    </View>
    <Dialog
      isVisible={visibleDialog}
      onBackdropPress={() => setVisibleDialog(false)}
      overlayStyle={{ color: palettes.palette.text }}
    >
      <Dialog.Title title="Cancel Order"/>
      <Text>Are you sure you want to cancel this order</Text>
      <Dialog.Actions>
        <Dialog.Button titleStyle={{ color: '#c91f1f' }} title="CANCEL" onPress={() => cancel()}/>
        <Dialog.Button titleStyle={{ color: palettes.palette.text }} title="BACK" onPress={() => setVisibleDialog(false)}/>
      </Dialog.Actions>
    </Dialog>
  </View>;
};

const paletteStyles = palette => StyleSheet.create({
  expandedView: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 5,
  },
  expandedColumn: {
    width: '50%',
  },
  container: {
    height: '100%',
  },
  expandedText: {
    fontSize: 15,
    fontWeight: '700',
    color: 'white',
  },
  expandedRows: {
    paddingBottom: 20,
    width: '100%',
  },
  expandedProductView: {
    flexDirection: 'row',
    paddingBottom: 5,
    width: '100%',
  },
  productDetailsImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginRight: 20,
  },
  productDetails: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  expandedProductCol: {
    width: '50%',
  },
  productDescription: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productDetailsName: {
    textTransform: 'capitalize',
    fontWeight: '700',
    fontSize: 17,
    marginBottom: 5,
    width: 250,
  },
  expandedBG: {
    backgroundColor: palette.text,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  trackOrderButton: {
    marginHorizontal: 20,
    marginVertical: 5,
    backgroundColor: palette.background,
  },
  trackOrderText: {
    color: palette.text,
    fontWeight: '700',
  },
  productDetailRow: {
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 5,
  },
  productIcon: {
    fontSize: 22,
    marginRight: 10,
  },
  productsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  timelineRows: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  timeline: {
    marginHorizontal: 20,
  },
  timelineTextRow: {
    marginLeft: 10,
  },
  timelineTextTop: {
    fontSize: 14,
    fontWeight: '700',
  },
  timelineTextBottom: {
    fontSize: 16,
  },
  timelineGroup: {
    marginVertical: 15,
  },
  scrollContainer: {
    flexShrink: 1,
  },
  buttonContainer: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  cancelButton: {
    backgroundColor: '#c91f1f',
    borderRadius: 10,
    width: 180,
    fontSize: 14,
    marginBottom: 10,
    marginTop: 10,
  },
  editButton: {
    backgroundColor: palette.text,
    borderRadius: 10,
    width: 180,
    fontSize: 14,
    marginBottom: 10,
    marginTop: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TrackScreen;
