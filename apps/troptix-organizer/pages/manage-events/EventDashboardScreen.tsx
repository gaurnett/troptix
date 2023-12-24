import { useCallback, useEffect, useState } from "react";
import { ScrollView } from 'react-native';
import CircularProgress from "react-native-circular-progress-indicator";
import 'react-native-gesture-handler';
import { RefreshControl } from 'react-native-gesture-handler';
import { FloatingButton, FloatingButtonLayouts, ListItem, Text, View } from 'react-native-ui-lib';
import { Event } from "troptix-models";
import { OrderSummary, TicketSummary, generateOrderSummary } from "../../hooks/types/Order";

export default function EventDashboardScreen({ eventObject, navigation, orders }) {
  const [event, setEvent] = useState<Event>(eventObject);
  const [refreshing, setRefreshing] = useState(false);
  const [orderSummary, setOrderSummary] = useState<OrderSummary>({
    gross: 0,
    fees: 0,
    ticketsSummary: new Map<string, TicketSummary>(),
    summary: []
  });

  useEffect(() => {
    const summary = generateOrderSummary(orders);
    setOrderSummary(summary);
  }, []);

  function openAddEvents() {
    navigation.navigate('AddEventScreen', {
      eventObject: event
    })
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
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
    if (!total) {
      total = sold
    }

    return (
      <View style={{ backgroundColor: 'white', height: 80 }}>
        <ListItem>
          <ListItem.Part left>
            {
              ticketName === "Complementary" ?
                <CircularProgress
                  value={100}
                  radius={40}
                  inActiveStrokeOpacity={0.5}
                  activeStrokeColor={'#2465FD'}
                  activeStrokeSecondaryColor={'#C25AFF'}
                  inActiveStrokeWidth={2}
                  activeStrokeWidth={4}
                  duration={0}
                  title={sold}
                  subtitle="sent"
                  titleFontSize={16}
                  subtitleFontSize={16}
                  showProgressValue={false}
                />
                :
                <CircularProgress
                  value={(sold / total) * 100}
                  radius={40}
                  inActiveStrokeOpacity={0.5}
                  inActiveStrokeWidth={2}
                  activeStrokeWidth={4}
                  duration={0}
                  valueSuffix={`%`}
                />
            }
          </ListItem.Part>
          <ListItem.Part>
            <ListItem.Part containerStyle={{ marginBottom: 3 }}>
              <View>
                <Text grey10 text70 style={{ marginLeft: 16 }}>
                  {ticketName}
                </Text>
                {
                  ticketName === "Complementary" ?
                    <Text grey10 text70 style={{ marginLeft: 16 }}>
                      {sold} sent
                    </Text>
                    :
                    <Text grey10 text70 style={{ marginLeft: 16 }}>
                      {sold}/{total} sold
                    </Text>
                }
              </View>
            </ListItem.Part>
          </ListItem.Part>
        </ListItem>
      </View>
    );
  }

  function renderTicketSummary() {
    console.log(orderSummary.summary);
    return (
      <></>
    )

    return
    // return _.map(Array.from(orderSummary.ticketsSummary.keys()), (key, i) => {
    //   const ticket = orderSummary.ticketsSummary.get(key);
    // return (
    // <View key={key} marginT-16>
    //   {TicketSoldItem(ticket.name, ticket.quantitySold, ticket.quantity)}
    // </View>
    // )
    // })
  }

  return (
    <View paddingR-16 paddingL-16 style={{ height: "100%" }} backgroundColor='white'>
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
              {
                orderSummary.summary.map((value: TicketSummary, index: number) => {
                  return (
                    <View key={value.ticketId} marginT-16>
                      {TicketSoldItem(value.name, value.quantitySold, value.quantity)}
                    </View>
                  )
                })
              }
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
    </View>
  );
}