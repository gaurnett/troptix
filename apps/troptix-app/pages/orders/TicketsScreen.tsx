import _ from 'lodash';
import { useCallback, useContext, useEffect, useState } from 'react';
import { StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, View, Card, Colors, CardProps, Button, LoaderScreen } from 'react-native-ui-lib';
import { Event, getEventsFromRequest } from 'troptix-models';
import { TropTixResponse, getOrders, GetOrdersType, GetOrdersRequest } from 'troptix-api';
import { TropTixContext } from '../../App';
import { Image } from 'expo-image';

export default function TicketsScreen({ navigation }) {
  const [user, setUser] = useContext(TropTixContext);
  const [isFetchingOrders, setIsFetchingOrders] = useState(true);
  const [orders, setOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  function onOrderClick(order) {
    navigation.navigate('TicketDetailsScreen', {
      order: order,
    })
  }

  const fetchOrders = async () => {
    try {
      const getOrdersRequest: GetOrdersRequest = {
        getOrdersType: GetOrdersType.GET_ORDERS_FOR_USER,
        userId: user.id
      }
      const response: TropTixResponse = await getOrders(getOrdersRequest);

      if (response.response !== undefined && response.response.length !== 0) {
        setOrders(response.response);
      }
    } catch (error) {
      console.log("TicketsScreen [fetchOrders] error: " + error)
    }

    setIsFetchingOrders(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
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
            <Image
              contentFit='cover'
              height={120}
              width={120}
              source={{
                uri: order.event.imageUrl
              }} />
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
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            <View flex padding-20>
              {renderOrders()}
            </View>
          </ScrollView>
      }
    </View>
  )
}