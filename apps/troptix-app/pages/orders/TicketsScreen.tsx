import _ from 'lodash';
import { useEffect, useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Text, View, Card, Colors, CardProps, Button, LoaderScreen } from 'react-native-ui-lib';
import { Event, getEventsFromRequest } from 'troptix-models';
import { TropTixResponse, getOrders } from 'troptix-api';

export default function TicketsScreen({ route, navigation }) {
  const { user } = route.params

  const [isFetchingOrders, setIsFetchingOrders] = useState(true);
  const [orders, setOrders] = useState([]);

  function onOrderClick(order) {
    navigation.navigate('TicketDetailsScreen', {
      order: order,
    })
  }

  const fetchOrders = async () => {
    try {
      const response: TropTixResponse = await getOrders(user.user.id);
      if (response.response !== undefined) {
        setOrders(response.response);
      }
    } catch (error) {
      console.log("Fetching Orders Error: " + error)
    }

    setIsFetchingOrders(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  function renderOrders() {
    if (orders.length === 0) {
      return;
    }

    return _.map(orders, (order, i) => {
      return (
        <Card
          borderRadius={5}
          // enableShadow={false}
          row
          height={120}
          style={{ marginBottom: 16 }}
          key={i}
          onPress={() => onOrderClick(order)}
        >
          <View style={{ height: '100%' }}>
            <Card.Section
              imageSource={{
                uri: order.event.imageUrl
              }}
              imageStyle={{
                width: 115,
                height: 120,
              }}
            />
          </View>

          <View marginL-12 marginT-8>
            <View style={{ flex: 1 }}>
              <Text text60 $textDefault>
                {order.event.name}
              </Text>

              <Text text70 $textDefault>
                {new Date(order.event.startDate).toDateString()} at 8PM
              </Text>
            </View>

            <View marginB-8>
              <Text text70 color={Colors.$textMajor}>
                {order.tickets.length} {order.tickets.length === 1 ? "Ticket" : "Tickets"}
              </Text>
            </View>
          </View>
        </Card>
      );
    });
  };

  return (
    <View style={{ backgroundColor: 'white', height: '100%', }}>
      {
        isFetchingOrders ?
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <LoaderScreen message={'Fetching tickets'} color={Colors.grey40} />
          </View> :
          <ScrollView>
            <View flex padding-20>
              {renderOrders()}
            </View>
          </ScrollView>
      }
    </View>
  )
}