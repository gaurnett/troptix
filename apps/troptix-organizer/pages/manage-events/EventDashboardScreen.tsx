import 'react-native-gesture-handler';
import _ from 'lodash';
import Animated from 'react-native-reanimated';
import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView } from 'react-native';
import { Colors, FloatingButton, FloatingButtonLayouts, Image, ListItem, LoaderScreen, Text, View } from 'react-native-ui-lib';
import CircularProgress from 'react-native-circular-progress-indicator';
import { TropTixResponse, getOrders, GetOrdersType, GetOrdersRequest } from 'troptix-api';
import { Event, OrderSummary } from "troptix-models";
import { RefreshControl } from 'react-native-gesture-handler';

export default function EventDashboardScreen({ eventObject, navigation }) {
  const [event, setEvent] = useState<Event>(eventObject);
  const [orderSummary, setOrderSummary] = useState<OrderSummary>(new OrderSummary([]));
  const [isFetchingEvents, setIsFetchingEvents] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  function openAddEvents() {
    navigation.navigate('AddEventScreen', {
      eventObject: event
    })
  }

  const fetchOrderSummary = async () => {
    try {
      const getOrdersRequest: GetOrdersRequest = {
        getOrdersType: GetOrdersType.GET_ORDERS_FOR_EVENT,
        eventId: event.id
      }
      const response = await getOrders(getOrdersRequest);

      if (response !== undefined && response.length !== 0) {
        const summary = new OrderSummary(response)
        setOrderSummary(summary);
      }
    } catch (error) {
      console.log("EventDashboardScreen [fetchOrderSummary] error: " + error)
    }

    setIsFetchingEvents(false);
  };

  useEffect(() => {
    fetchOrderSummary();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchOrderSummary();
    setRefreshing(false);
  }, []);

  function getFormattedCurrency(price) {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    return formatter.format(price)
  }

  function TicketSoldItem(ticketName, sold, total) {
    return (
      <View style={{ backgroundColor: 'white', height: 80 }}>
        <ListItem>
          <ListItem.Part left>
            <CircularProgress
              value={(sold / total) * 100}
              radius={40}
              inActiveStrokeOpacity={0.5}
              inActiveStrokeWidth={2}
              activeStrokeWidth={4}
              duration={0}
              valueSuffix='%'
            />
          </ListItem.Part>
          <ListItem.Part>
            <ListItem.Part containerStyle={{ marginBottom: 3 }}>
              <View>
                <Text grey10 text70 style={{ marginLeft: 16 }}>
                  {ticketName}
                </Text>
                <Text grey10 text70 style={{ marginLeft: 16 }}>
                  {sold}/{total}
                </Text>
              </View>
            </ListItem.Part>
          </ListItem.Part>
        </ListItem>
      </View>
    );
  }

  function renderTicketSummary() {
    return _.map(Array.from(orderSummary.ticketsSummary.keys()), (key, i) => {
      const ticket = orderSummary.ticketsSummary.get(key);
      return (
        <View key={key} marginT-16>
          {TicketSoldItem(ticket.name, ticket.quantitySold, ticket.quantity)}
        </View>
      )
    })
  }

  return (
    <View paddingR-16 paddingL-16 style={{ height: "100%" }} backgroundColor='white'>
      {
        isFetchingEvents ?
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <LoaderScreen message={'Fetching Order Summary'} color={Colors.grey40} />
          </View>
          :
          <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ flex: 1, backgroundColor: 'white' }}>
              <ScrollView
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>
                <View>
                  <Text style={{ fontSize: 20 }} marginT-16 marginB-8 $textDefault>
                    Gross Sales
                  </Text>
                  <Text style={{ fontSize: 42, fontWeight: '600' }} $textDefault>
                    {getFormattedCurrency(orderSummary.gross)}
                  </Text>
                </View>
                <View>
                  <Text style={{ fontSize: 20 }} marginT-16 marginB-8 $textDefault>
                    Ticket Summary
                  </Text>
                  {renderTicketSummary()}
                </View>
              </ScrollView>
            </View>

            <View marginB-16>
              <FloatingButton
                visible={true}
                button={{
                  label: 'Edit Event',
                  onPress: openAddEvents
                }}
                buttonLayout={FloatingButtonLayouts.HORIZONTAL}
                bottomMargin={16}
              />
            </View>
          </View>
      }

    </View>
  );
}