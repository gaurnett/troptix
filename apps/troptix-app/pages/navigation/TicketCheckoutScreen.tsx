import _ from 'lodash';
import { useContext, useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, TouchableOpacity } from 'react-native';
import { Button, Colors, Icon, Image, Picker, Text, View } from 'react-native-ui-lib';
import tickets from '../../data/tickets';
import { Checkout, Order, Charge } from 'troptix-models';
import { postOrders, PostOrdersType, PostOrdersRequest } from 'troptix-api';
import { PlatformPay, PlatformPayButton, StripeProvider, createPlatformPayPaymentMethod, initPaymentSheet, isPlatformPaySupported, presentPaymentSheet, useStripe } from "@stripe/stripe-react-native";
import { auth } from 'troptix-firebase';
import { TropTixContext } from '../../App';

export default function TicketCheckoutScreen({ route, navigation }) {
  const [total, setTotal] = useState(0);
  const [user, setUser] = useContext(TropTixContext);
  const { event } = route.params;
  const [checkout, setCheckout] = useState<Checkout>(new Checkout(event));
  const [ticketList, setTicketList] = useState(event.ticketTypes);
  const stripe = useStripe();
  const [isApplePaySupported, setIsApplePaySupported] = useState(false);

  useEffect(() => {
    (async function () {
      setIsApplePaySupported(await isPlatformPaySupported());
    })();
  }, [isPlatformPaySupported]);

  useEffect(
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

  const fetchPaymentSheetParams = async () => {
    const charge = new Charge();
    charge.total = checkout.total * 100;
    charge.userId = user.id;

    const postOrdersRequest: PostOrdersRequest = {
      type: PostOrdersType.POST_ORDERS_CREATE_CHARGE,
      charge: charge
    }

    const response = await postOrders(postOrdersRequest);
    const { paymentId, paymentIntent, ephemeralKey, customer } = await response.response;

    return {
      paymentId,
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    const {
      paymentId,
      paymentIntent,
      ephemeralKey,
      customer,
    } = await fetchPaymentSheetParams();

    console.log("fetchPaymentSheetParams: " + paymentId + " " + paymentIntent + " " + ephemeralKey + " " + customer);

    const { error } = await initPaymentSheet({
      merchantDisplayName: "TropTix",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: 'Jane Doe',
      }
    });

    if (error) {
      console.log("Error: " + error.localizedMessage);
      // setLoading(true);
    }

    return paymentId;
  };

  async function openStripePayment() {
    const paymentId = await initializePaymentSheet();

    if (paymentId === undefined) {
      Alert.alert("Cannot create payment order, please try again later");
      return;
    }

    const order = new Order(checkout, paymentId, event.id, user.id);
    try {
      const postOrdersRequest: PostOrdersRequest = {
        type: PostOrdersType.POST_ORDERS_CREATE_ORDER,
        order: order
      }
      await postOrders(postOrdersRequest);
    } catch (error) {
      console.log("[openStripePayment] create order error: " + error);
      return;
    }

    const { error, paymentOption } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      console.log(paymentOption);
      Alert.alert('Success', 'Your order is confirmed!');
    }
  }

  const createPaymentMethod = async () => {
  };

  function getFormattedCurrency(price) {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    return formatter.format(price)
  }

  function reduceCost(ticket, index) {
    var currentTotal = checkout.total;
    var subtotal = checkout.subtotal;
    var fees = checkout.fees;
    const updatedTickets = checkout.tickets.map((item, i) => {
      if (index === i && item.quantitySelected > 0) {
        subtotal -= ticket.price;
        fees -= ticket.price * .1
        currentTotal = subtotal + fees;
        return { ...item, quantitySelected: item.quantitySelected - 1 };
      } else {
        return item;
      }
    });

    setCheckout(previousOrder => ({
      ...previousOrder,
      ["tickets"]: updatedTickets,
      ["total"]: currentTotal,
      ["fees"]: fees,
      ["subtotal"]: subtotal
    }))
  }

  function increaseCost(ticket, index) {
    var currentTotal = checkout.total;
    var subtotal = checkout.subtotal;
    var fees = checkout.fees;
    const updatedTickets = checkout.tickets.map((item, i) => {
      if (index === i && item.quantitySelected < item.maxPurchasePerUser) {
        subtotal += ticket.price;
        fees += ticket.price * .1
        currentTotal = subtotal + fees;
        return { ...item, quantitySelected: item.quantitySelected + 1 };
      } else {
        return item;
      }
    });

    setCheckout(previousOrder => ({
      ...previousOrder,
      ["tickets"]: updatedTickets,
      ["total"]: currentTotal,
      ["fees"]: fees,
      ["subtotal"]: subtotal
    }))
  }

  function renderTickets() {
    return _.map(checkout.tickets, (ticket, i) => {
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
    <StripeProvider
      publishableKey='pk_test_51Noxs0FEd6UvxBWGgUgu6JQw6VnDqC8ei9YkxAthxkjGBsAY3OKEKbkuRlnCTcHoVnQp5vvCrM0YfuhSFQZv3wR300x6wKe6oJ'
      merchantIdentifier="merchant.identifier" >
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
            <Text style={{ fontSize: 18 }}>{getFormattedCurrency(checkout.total)}</Text>
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

            {/* <View >
              {isApplePaySupported && (
                <PlatformPayButton
                  onPress={createPaymentMethod}
                  type={PlatformPay.ButtonType.SetUp}
                  appearance={PlatformPay.ButtonStyle.WhiteOutline}
                  style={{
                    width: '65%',
                    height: 50,
                  }}
                />
              )}
            </View> */}

            <Button
              onPress={() => openStripePayment()}
              marginT-16
              borderRadius={30}
              style={{ backgroundColor: '#2196F3', height: 45, width: '100%' }}>
              <Text style={{ fontSize: 16, color: '#fff' }} marginL-10>Pay another way</Text>
            </Button>
          </View>
        </View>
      </View>
    </StripeProvider>

  );
}