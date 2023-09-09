import _ from 'lodash';
import * as React from 'react';
import { Pressable, ScrollView, TouchableOpacity } from 'react-native';
import { Button, Colors, Icon, Image, Picker, Text, View } from 'react-native-ui-lib';
import tickets from '../../data/tickets';
import { Order } from 'troptix-models';

export default function TicketCheckoutScreen({ route, navigation }) {
  const [total, setTotal] = React.useState(0);
  const { event } = route.params;
  const [order, setOrder] = React.useState<Order>(new Order(event));
  const [ticketList, setTicketList] = React.useState(event.tickets);

  const options = [
    { label: 'JavaScript', value: 'js' },
    { label: 'Java', value: 'java' },
    { label: 'Python', value: 'python' },
    { label: 'C++', value: 'c++', disabled: true },
    { label: 'Perl', value: 'perl' }
  ];

  React.useEffect(
    () =>
      navigation.setOptions({
        headerRight: () => (
          <Pressable onPress={() => navigation.goBack()}>
            <Image
              marginR-24
              source={require("../../assets/icons/close.png")}
              resizeMode="contain"
              style={{ width: 24 }}
            />
          </Pressable>
        ),
      }),
    [navigation]
  );

  function getFormattedCurrency(price) {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    return formatter.format(price)
  }

  function reduceCost(ticket, index) {
    var currentTotal = order.totalPrice;
    const updatedTickets = order.tickets.map((item, i) => {
      if (index === i && item.quantitySelected > 0) {
        currentTotal -= ticket.price + (ticket.price * .1);
        return { ...item, quantitySelected: item.quantitySelected - 1 };
      } else {
        return item;
      }
    });

    setOrder(previousOrder => ({
      ...previousOrder,
      ["tickets"]: updatedTickets,
      ["totalPrice"]: currentTotal
    }))
  }

  function increaseCost(ticket, index) {
    var currentTotal = order.totalPrice;
    const updatedTickets = order.tickets.map((item, i) => {
      if (index === i && item.quantitySelected < item.maxPurchasePerUser) {
        currentTotal += ticket.price + (ticket.price * .1);
        return { ...item, quantitySelected: item.quantitySelected + 1 };
      } else {
        return item;
      }
    });

    setOrder(previousOrder => ({
      ...previousOrder,
      ["tickets"]: updatedTickets,
      ["totalPrice"]: currentTotal
    }))
  }

  function renderTickets() {
    return _.map(order.tickets, (ticket, i) => {
      return (
        <View key={i} marginB-16 style={{ width: '100%', borderWidth: 1, borderRadius: 10, borderColor: '#D3D3D3' }}>
          <View
            row
            margin-12
            style={{ height: 50, alignItems: 'center' }}>
            <Text>{ticket.name}</Text>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', height: '100%' }}>
                <TouchableOpacity
                  onPress={() => reduceCost(ticket, i)}
                  style={{ borderRadius: 16, backgroundColor: '#2196F3' }} >
                  <Icon
                    source={require("../../assets/icons/remove.png")}
                    resizeMode="center"
                    tintColor={Colors.white}
                    style={{ width: 32, height: 32 }}
                  />
                </TouchableOpacity>
                <Text
                  style={{ fontSize: 20 }}
                  marginL-12
                  marginR-12>{ticket.quantitySelected}</Text>
                <TouchableOpacity
                  onPress={() => increaseCost(ticket, i)}
                  style={{ borderRadius: 16, backgroundColor: '#2196F3' }}>
                  <Icon
                    source={require("../../assets/icons/add.png")}
                    resizeMode="center"
                    tintColor={Colors.white}
                    size={32}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={{ flex: 1, height: 1, backgroundColor: '#D3D3D3' }} />
          <View margin-12>
            <Text>{getFormattedCurrency(ticket.price)}</Text>
            <Text>+ {getFormattedCurrency(ticket.price * .1)} fees</Text>
            <Text marginT-8>
              {ticket.description}
            </Text>
          </View>
        </View>
      )
    })
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollView style={{ height: '100%' }}>
          <View margin-20>
            {renderTickets()}
          </View>
        </ScrollView>
      </View>
      <View
        backgroundColor="transparent"
        marginB-24
        style={{ borderTopColor: '#D3D3D3', borderTopWidth: 1, height: 160 }}>
        <View
          margin-16
          marginR-20
          style={{ alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 18 }}>{getFormattedCurrency(order.totalPrice)}</Text>
        </View>
        <View
          marginL-20
          marginR-20>
          <Button
            backgroundColor={Colors.orange30}
            borderRadius={30}
            style={{ backgroundColor: '#000', height: 45, width: '100%' }}>
            <Image source={require('../../assets/logo/apple-pay.png')} tintColor={Colors.white} width={48} height={48} />
          </Button>

          <Button
            marginT-16
            borderRadius={30}
            style={{ backgroundColor: '#2196F3', height: 45, width: '100%' }}>
            <Text style={{ fontSize: 16, color: '#fff' }} marginL-10>Pay another way</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}