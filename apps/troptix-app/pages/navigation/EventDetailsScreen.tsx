import * as React from 'react';
import {
  Text,
  View,
  ListItem,
  Colors,
  BorderRadiuses,
  Button,
} from 'react-native-ui-lib';
import { Alert, FlatList, ScrollView, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

const styles = StyleSheet.create({
  detailsIcon: {
    width: 28,
    height: 28,
  },
  border: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey70,
  },
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
    },
  ];
}

export default function EventDetailsScreen({ route, navigation }) {
  const { event, user } = route.params;

  function onGetTicketsClick() {
    navigation.navigate('TicketCheckoutScreen', {
      event: event,
      user: user,
    });
  }

  function EventDetailsItem(details, detailsIcon, color) {
    return (
      <View style={{ backgroundColor: 'white', height: 50 }}>
        <ListItem>
          <ListItem.Part left>
            <Image
              source={detailsIcon}
              style={styles.detailsIcon}
              tintColor={color}
            />
          </ListItem.Part>
          <ListItem.Part>
            <ListItem.Part containerStyle={{ marginBottom: 3 }}>
              <Text grey10 text70 style={{ marginLeft: 16 }}>
                {details}
              </Text>
            </ListItem.Part>
          </ListItem.Part>
        </ListItem>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollView style={{ height: '100%' }}>
          <View>
            <Image
              resizeMode="cover"
              height={350}
              width="100%"
              source={{
                uri: event.imageUrl,
              }}
            />
          </View>
          <View flex padding-20>
            <Text text50 $textDefault>
              {event.title}
            </Text>

            <View>
              {EventDetailsItem(
                new Date(event.startDate).toDateString(),
                require('../../assets/icons/date.png'),
                Colors.red20
              )}
              {EventDetailsItem(
                event.address,
                require('../../assets/icons/location.png'),
                Colors.blue20
              )}
              {EventDetailsItem(
                '$200',
                require('../../assets/icons/money.png'),
                Colors.green20
              )}
            </View>
            <View>
              <Text marginT-16 marginB-8 text60 $textDefault>
                About this event
              </Text>
              <Text text70 $textDefault>
                {event.description}
              </Text>
            </View>

            <View>
              <Text marginT-16 marginB-8 text60 $textDefault>
                Location
              </Text>
              <Text text70 $textDefault>
                {event.address}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
      <View
        backgroundColor="transparent"
        marginB-24
        style={{
          borderTopColor: '#D3D3D3',
          borderTopWidth: 1,
          height: 70,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Button
          style={{ width: '70%', height: '70%' }}
          label={'Get Tickets'}
          labelStyle={{ fontSize: 18 }}
          onPress={() => onGetTicketsClick()}
        />
      </View>
    </View>
  );
}
