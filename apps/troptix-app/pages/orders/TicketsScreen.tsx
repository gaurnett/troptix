import _ from 'lodash';
import { useCallback, useContext, useEffect, useState } from 'react';
import { StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, View, Card, Colors, CardProps, Button, LoaderScreen } from 'react-native-ui-lib';
import { Event, getEventsFromRequest } from 'troptix-models';
import { TicketSummary, TicketsSummary, getOrders, Ticket, getTicketsForUser, GetOrdersType, GetOrdersRequest } from 'troptix-api';
import { TropTixContext } from '../../App';
import { Image } from 'expo-image';

export default function TicketsScreen({ navigation }) {
  const [user, setUser] = useContext(TropTixContext);
  const [isFetchingOrders, setIsFetchingOrders] = useState(true);
  const [orders, setOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  function onOrderClick(summary) {
    navigation.navigate('TicketDetailsScreen', {
      summary: summary,
    })
  }

  function groupOrders(response) {
    let ticketsMap = new Map<string, TicketsSummary>();

    for (const order of response) {
      const eventId = order.eventId;

      if (ticketsMap.has(eventId)) {
        let ticketsSummary = ticketsMap.get(eventId);

        for (const ticket of order.tickets) {
          let ticketSummary: TicketSummary = {
            id: ticket.id,
            status: ticket.status,
            orderId: ticket.orderId,
            ticketType: ticket.ticketType
          }
          ticketsSummary.tickets.push(ticketSummary);
        }

        ticketsMap.set(eventId, ticketsSummary);
      } else {
        let tickets: TicketSummary[] = [];

        for (const ticket of order.tickets) {
          console.log(ticket.id);
          let ticketSummary: TicketSummary = {
            id: ticket.id,
            status: ticket.status,
            orderId: ticket.orderId,
            ticketType: ticket.ticketType
          }
          tickets.push(ticketSummary);
        }

        let ticketsSummary: TicketsSummary = {
          event: order.event,
          tickets: tickets
        }
        ticketsMap.set(eventId, ticketsSummary);
      }
    }

    return Array.from(ticketsMap.values());
  }

  function groupTickets(response) {
    let ticketsMap = new Map<string, TicketsSummary>();

    for (const ticket of response) {
      const eventId = ticket.eventId;
      let ticketSummary: TicketSummary = {
        id: ticket.id,
        status: ticket.status,
        orderId: ticket.orderId,
        ticketType: ticket.ticketType
      }

      if (ticketsMap.has(eventId)) {
        let ticketsSummary = ticketsMap.get(eventId);
        ticketsSummary.tickets.push(ticketSummary);
        ticketsMap.set(eventId, ticketsSummary);
      } else {
        let tickets: TicketSummary[] = [];
        tickets.push(ticketSummary);
        let ticketsSummary: TicketsSummary = {
          event: ticket.event,
          tickets: tickets
        }
        ticketsMap.set(eventId, ticketsSummary);
      }
    }

    return Array.from(ticketsMap.values());
  }

  const fetchOrders = async () => {
    try {
      const getOrdersRequest: GetOrdersRequest = {
        getOrdersType: GetOrdersType.GET_ORDERS_FOR_USER,
        userId: user.id
      }
      const response = await getOrders(getOrdersRequest);

      if (response !== undefined && response.length !== 0) {
        setOrders(groupOrders(response));
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
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ flex: 1, flexWrap: 'wrap', fontWeight: 'bold' }} text70 $textDefault>
                  {order.event.name}
                </Text>
              </View>

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
          <View>
            {
              orders.length === 0 ?
                <View style={{ alignItems: 'center', justifyContent: 'center', height: "100%", width: "100%" }}>
                  <Image source={require('../../assets/icons/empty-tickets.png')} width={120} height={120} />
                  <Text marginT-24 style={{ fontSize: 24 }}>No tickets purchased</Text>
                </View>
                :
                <View style={{ height: "100%" }}>
                  <ScrollView
                    refreshControl={
                      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }>
                    <View flex padding-20>
                      {renderOrders()}
                    </View>
                  </ScrollView>
                </View>
            }

          </View>

      }
    </View>
  )
}