import * as React from 'react';
import { Text, View, Image, ListItem, Colors, BorderRadiuses, Button } from 'react-native-ui-lib';
import { Alert, FlatList, ScrollView, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  detailsIcon: {
    width: 28,
    height: 28,
  },
  border: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey70
  }
});

function getDetailItemList(event) {
  return [
    {
      detail: event.timestamp,
      icon: require('../../assets/icons/date.png'),
      color: Colors.red20,
    },
    {
      detail: event.location,
      icon: require('../../assets/icons/location.png'),
      color: Colors.blue20,
    },
    {
      detail: event.price,
      icon: require('../../assets/icons/money.png'),
      color: Colors.blue20,
    }
  ];
}

export default function EventDetailsScreen({ route, navigation }) {
  const { event } = route.params;

  function onGetTicketsClick() {
    navigation.navigate('TicketCheckoutScreen', {
      event: event
    })
  }

  function EventDetailsItem(details, detailsIcon, color) {
    return (
      <View style={{backgroundColor: 'white', height: 50}}>
        <ListItem>
          <ListItem.Part left>
            <Image 
              source={detailsIcon} 
              style={styles.detailsIcon}
              tintColor={color}
            />
          </ListItem.Part>
          <ListItem.Part>
            <ListItem.Part containerStyle={{marginBottom: 3}}>
              <Text grey10 text70 style={{marginLeft: 16}}>
                {details}
              </Text>
            </ListItem.Part>
          </ListItem.Part>
        </ListItem>
      </View>
    );
  }

  return (
    <View style={{flex: 1, backgroundColor: 'white' }}>
      <View style={{flex: 1, backgroundColor: 'white' }}>
        <ScrollView style={{height: '100%' }}>
          <View>
            <Image
              resizeMode='cover'
              height={350}
              width='100%'
              source={event.coverImage} />
          </View>
          <View flex padding-20>
            <Text text50 $textDefault>
              {event.title}
            </Text>

            <View>
              {EventDetailsItem(event.timestamp, require('../../assets/icons/date.png'), Colors.red20)}
              {EventDetailsItem(event.location, require('../../assets/icons/location.png'), Colors.blue20)}
              {EventDetailsItem(event.price, require('../../assets/icons/money.png'), Colors.green20)}
            </View>
            <View>
              <Text marginT-16 marginB-8 text60 $textDefault>
                About this event
              </Text>
              <Text text70 $textDefault>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure 
                dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat 
                non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </Text>
            </View>
            
            <View>
              <Text marginT-16 marginB-8 text60 $textDefault>
                Location
              </Text>
              <Text text70 $textDefault>
                There will be a map herre
              </Text>
            </View>
            
          </View>
        </ScrollView>
      </View>
      <View 
        backgroundColor="transparent" 
        marginB-24
        style={{ borderTopColor: '#D3D3D3', borderTopWidth: 1, height: 70, justifyContent: 'center', alignItems: 'center' }}>
        <Button 
          style={{width: '70%', height: '70%'}} 
          label={"Get Tickets"} 
          labelStyle={{fontSize: 18}} 
          onPress={() => onGetTicketsClick()} />
      </View>
    </View>
  );
}