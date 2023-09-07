import * as React from 'react';
import { StyleSheet, Alert, FlatList } from 'react-native';
import {View, Text, Colors, ListItem, Image, BorderRadiuses } from 'react-native-ui-lib';
import orders, { OrderType } from '../../data/orders';

const cardImage = require('../../assets/favicon.png');
const styles = StyleSheet.create({
  image: {
    width: 54,
    height: 54,
    borderRadius: BorderRadiuses.br20,
    marginHorizontal: 14
  },
  border: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey70
  }
});

export default function SettingsScreen() {
  function renderSelectableCards(row: OrderType, id: number) {
    const statusColor = row.inventory.status === 'Paid' ? Colors.green30 : Colors.red30;

    return (
      <View style={{backgroundColor: 'white'}}>
        <ListItem
          activeBackgroundColor={Colors.white}
          activeOpacity={0.3}
          height={77.5}
          onPress={() => Alert.alert(`pressed on order #${id + 1}`)}
        >
          <ListItem.Part left>
            <Image source={{uri: row.mediaUrl}} style={styles.image}/>
          </ListItem.Part>
          <ListItem.Part middle column containerStyle={[styles.border, {paddingRight: 17}]}>
            <ListItem.Part containerStyle={{marginBottom: 3}}>
              <Text grey10 text70 style={{flex: 1, marginRight: 10}} numberOfLines={1}>
                {row.name}
              </Text>
              <Text grey10 text70 style={{marginTop: 2}}>
                {row.formattedPrice}
              </Text>
            </ListItem.Part>
            <ListItem.Part>
              <Text
                style={{flex: 1, marginRight: 10}}
                text90
                grey40
                numberOfLines={1}
              >{`${row.inventory.quantity} item`}</Text>
              <Text text90 color={statusColor} numberOfLines={1}>
                {row.inventory.status}
              </Text>
            </ListItem.Part>
          </ListItem.Part>
        </ListItem>
      </View>
    );
  };

	return (
    <FlatList
        data={orders}
        renderItem={({item, index}) => renderSelectableCards(item, index)}
        keyExtractor={this.keyExtractor}
      />
    // <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
    //   {/* <ScrollView> */}
    //     <View>
    //       <Text h1 marginB-s4 $textDefault>Cards</Text>
    //       <Text h3 $textDefault>Selectable Cards</Text>
    //       {renderSelectableCards()}
    //       {/* <Text>Home Hello!</Text> */}
    //     </View>
    //   {/* </ScrollView> */}
    // </View>
	);
}