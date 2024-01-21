import _ from 'lodash';
import { useContext, useEffect, useState, useRef } from 'react';
import { Alert, Pressable, ScrollView, TouchableOpacity } from 'react-native';
import {
  Button,
  Colors,
  Icon,
  Image,
  Picker,
  Text,
  View,
} from 'react-native-ui-lib';
import tickets from '../../data/tickets';
import { Checkout, Order, Charge } from 'troptix-models';
import {
  postOrders,
  PostOrdersType,
  PostOrdersRequest,
  GetPromotionsType,
  GetPromotionsRequest,
  getPromotions,
} from 'troptix-api';
import {
  PlatformPay,
  PlatformPayButton,
  StripeProvider,
  createPlatformPayPaymentMethod,
  initPaymentSheet,
  isPlatformPaySupported,
  presentPaymentSheet,
  useStripe,
} from '@stripe/stripe-react-native';
import { auth } from 'troptix-firebase';
import { TropTixContext } from '../../App';
import CustomTextField from '../../components/CustomTextField';

export default function TicketCheckoutScreen({ route, navigation }) {
  const [total, setTotal] = useState(0);
  const codeRef = useRef();
  const [user, setUser] = useContext(TropTixContext);
  const { event } = route.params;
  const [checkout, setCheckout] = useState<Checkout>(new Checkout(event));
  const [ticketList, setTicketList] = useState(event.ticketTypes);
  const stripe = useStripe();
  const [isApplePaySupported, setIsApplePaySupported] = useState(false);
  const [promotionCode, setPromotionCode] = useState();
  const [promotion, setPromotion] = useState(null);
  const [promotionApplied, setPromotionApplied] = useState(false);

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
              source={require('../../assets/icons/close.png')}
              resizeMode="contain"
              style={{ width: 24 }}
            />
          </Pressable>
        ),
      }),
    [navigation]
  );

  async function applyPromotion() {
    if (promotionCode === undefined) {
      Alert.alert('Promotion code is empty');
      return;
    }

    if (
      promotionApplied &&
      String(promotion.code).toUpperCase() ===
        String(promotionCode).toUpperCase()
    ) {
      Alert.alert('Promotion already applied');
      return;
    }

    const getPromotionsRequest: GetPromotionsRequest = {
      getPromotionsType: GetPromotionsType.GET_PROMOTIONS_BY_EVENT,
      eventId: event.id,
      code: String(promotionCode).toUpperCase(),
    };

    try {
      const response = await getPromotions(getPromotionsRequest);

      if (response !== null && response !== undefined) {
        setPromotion(response);
        setPromotionApplied(true);

        const updatedTickets = checkout.tickets.map((item, i) => {
          if (item.quantitySelected > 0) {
            return {
              ...item,
              subtotal: getPromotionPriceFromResponse(item.subtotal, response),
              fees: getPromotionPriceFromResponse(item.fees, response),
              total: getPromotionPriceFromResponse(item.total, response),
            };
          } else {
            return item;
          }
        });

        setCheckout((previousOrder) => ({
          ...previousOrder,
          ['promotionApplied']: true,
          ['tickets']: updatedTickets,
          ['discountedSubtotal']: getPromotionPriceFromResponse(
            checkout.subtotal,
            response
          ),
          ['discountedFees']: getPromotionPriceFromResponse(
            checkout.fees,
            response
          ),
          ['discountedTotal']: getPromotionPriceFromResponse(
            checkout.total,
            response
          ),
        }));

        Alert.alert('Promotion code applied');
      } else {
        Alert.alert('There was a problem applying promotion code.');
      }
      console.log(
        '[TicketCheckoutScreen applyPromotion] response: ' + response
      );
    } catch (error) {
      console.log('[TicketCheckoutScreen applyPromotion] error: ' + error);
    }
  }

  function updateCode(name, value) {
    setPromotionCode(value);
  }

  const fetchPaymentSheetParams = async () => {
    const charge = new Charge();
    charge.total = checkout.promotionApplied
      ? checkout.discountedTotal * 100
      : checkout.total * 100;
    charge.userId = user.id;

    const postOrdersRequest: PostOrdersRequest = {
      type: PostOrdersType.POST_ORDERS_CREATE_CHARGE,
      charge: charge,
    };

    const response = await postOrders(postOrdersRequest);
    const { paymentId, paymentIntent, ephemeralKey, customer } = await response;

    return {
      paymentId,
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    const { paymentId, paymentIntent, ephemeralKey, customer } =
      await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      merchantDisplayName: 'TropTix',
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: 'Jane Doe',
      },
    });

    if (error) {
      console.log('Error: ' + error.localizedMessage);
      // setLoading(true);
    }

    return paymentId;
  };

  async function openBillingAndPayment() {
    const finalCheckout = { ...checkout };
    finalCheckout.tickets = finalCheckout.tickets.filter(
      (ticket) => ticket.quantitySelected > 0
    );

    console.log('Ticket: ' + JSON.stringify(finalCheckout));

    navigation.navigate('TicketBillingAndPaymentScreen', {
      finalCheckout: finalCheckout,
      event: event,
    });
  }

  function getPromotionPriceFromResponse(price, response) {
    switch (response.promotionType) {
      case 'PERCENTAGE':
        return price - price * (response.value / 100);
      case 'DOLLAR_AMOUNT':
        return price - response.value;
    }

    return price;
  }

  function getPromotionPrice(price) {
    if (promotionApplied && promotion) {
      switch (promotion.promotionType) {
        case 'PERCENTAGE':
          return price - price * (promotion.value / 100);
        case 'DOLLAR_AMOUNT':
          return price - promotion.value;
      }
    }

    return price;
  }

  function getFormattedCurrency(price, includePromotion = false) {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    if (includePromotion) {
      return formatter.format(getPromotionPrice(price));
    }

    return formatter.format(price);
  }

  function getFormattedFeesCurrency(price) {
    price = price * 0.1;
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    if (promotionApplied) {
      return formatter.format(getPromotionPrice(price));
    }

    return formatter.format(price);
  }

  function reduceCost(ticket, index) {
    var checkoutTotal = checkout.total;
    var checkoutSubtotal = checkout.subtotal;
    var checkoutFees = checkout.fees;
    const updatedTickets = checkout.tickets.map((item, i) => {
      if (index === i && item.quantitySelected > 0) {
        checkoutSubtotal -= ticket.price;
        checkoutFees -= ticket.price * 0.1;
        checkoutTotal = checkoutSubtotal + checkoutFees;

        var ticketSubtotal = item.subtotal - ticket.price;
        var ticketFees = item.fees - ticket.price * 0.1;
        var ticketTotal = ticketSubtotal + ticketFees;

        console.log(ticketTotal);

        return {
          ...item,
          quantitySelected: item.quantitySelected - 1,
          subtotal: ticketSubtotal,
          fees: ticketFees,
          total: ticketTotal,
        };
      } else {
        return item;
      }
    });

    setCheckout((previousOrder) => ({
      ...previousOrder,
      ['tickets']: updatedTickets,
      ['total']: checkoutTotal,
      ['fees']: checkoutFees,
      ['subtotal']: checkoutSubtotal,
    }));

    if (checkout.promotionApplied) {
      setCheckout((previousOrder) => ({
        ...previousOrder,
        ['discountedSubtotal']: getPromotionPrice(checkoutSubtotal),
        ['discountedFees']: getPromotionPrice(checkoutFees),
        ['discountedTotal']: getPromotionPrice(checkoutTotal),
      }));
    }
  }

  function increaseCost(ticket, index) {
    var currentTotal = checkout.total;
    var subtotal = checkout.subtotal;
    var fees = checkout.fees;
    const updatedTickets = checkout.tickets.map((item, i) => {
      if (index === i && item.quantitySelected < item.maxPurchasePerUser) {
        subtotal += ticket.price;
        fees += ticket.price * 0.1;
        currentTotal = subtotal + fees;

        var ticketSubtotal = item.subtotal + ticket.price;
        var ticketFees = item.fees + ticket.price * 0.1;
        var ticketTotal = ticketSubtotal + ticketFees;

        console.log(ticketTotal);

        return {
          ...item,
          quantitySelected: item.quantitySelected + 1,
          subtotal: ticketSubtotal,
          fees: ticketFees,
          total: ticketTotal,
        };
      } else {
        return item;
      }
    });

    setCheckout((previousOrder) => ({
      ...previousOrder,
      ['tickets']: updatedTickets,
      ['total']: currentTotal,
      ['fees']: fees,
      ['subtotal']: subtotal,
    }));

    if (checkout.promotionApplied) {
      setCheckout((previousOrder) => ({
        ...previousOrder,
        ['discountedSubtotal']: getPromotionPrice(subtotal),
        ['discountedFees']: getPromotionPrice(fees),
        ['discountedTotal']: getPromotionPrice(currentTotal),
      }));
    }
  }

  function renderTickets() {
    return _.map(checkout.tickets, (ticket, i) => {
      return (
        <View
          key={i}
          marginB-16
          style={{
            width: '100%',
            borderWidth: 1,
            borderRadius: 10,
            borderColor: '#D3D3D3',
          }}
        >
          <View row margin-12 style={{ height: 50, alignItems: 'center' }}>
            <Text>{ticket.name}</Text>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  height: '100%',
                }}
              >
                <TouchableOpacity
                  onPress={() => reduceCost(ticket, i)}
                  style={{ borderRadius: 16, backgroundColor: '#2196F3' }}
                >
                  <Icon
                    source={require('../../assets/icons/remove.png')}
                    resizeMode="center"
                    tintColor={Colors.white}
                    style={{ width: 32, height: 32 }}
                  />
                </TouchableOpacity>
                <Text style={{ fontSize: 20 }} marginL-12 marginR-12>
                  {ticket.quantitySelected}
                </Text>
                <TouchableOpacity
                  onPress={() => increaseCost(ticket, i)}
                  style={{ borderRadius: 16, backgroundColor: '#2196F3' }}
                >
                  <Icon
                    source={require('../../assets/icons/add.png')}
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
            {promotionApplied ? (
              <View row>
                <Text style={{ textDecorationLine: 'line-through' }}>
                  {getFormattedCurrency(ticket.price)}
                </Text>
                <Text> </Text>
                <Text>{getFormattedCurrency(ticket.price, true)}</Text>
              </View>
            ) : (
              <Text>{getFormattedCurrency(ticket.price)}</Text>
            )}
            <Text>+ {getFormattedFeesCurrency(ticket.price)} fees</Text>
            <Text marginT-8>{ticket.description}</Text>
          </View>
        </View>
      );
    });
  }

  return (
    <StripeProvider
      publishableKey="pk_test_51Noxs0FEd6UvxBWGgUgu6JQw6VnDqC8ei9YkxAthxkjGBsAY3OKEKbkuRlnCTcHoVnQp5vvCrM0YfuhSFQZv3wR300x6wKe6oJ"
      merchantIdentifier="merchant.identifier"
    >
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <View row>
            <View marginL-20 flex>
              <CustomTextField
                name="code"
                label="Promotion Code"
                placeholder="SAVE15"
                value={promotionCode}
                reference={codeRef}
                handleChange={updateCode}
              />
            </View>

            <Pressable>
              <Button
                onPress={() => applyPromotion()}
                marginT-16
                style={{ backgroundColor: '#fff', height: 60 }}
              >
                <Text style={{ fontSize: 16, color: '#000' }}>Apply</Text>
              </Button>
            </Pressable>
          </View>
          <ScrollView keyboardDismissMode="on-drag" style={{ height: '100%' }}>
            <View margin-20>{renderTickets()}</View>
          </ScrollView>
        </View>
        <View
          backgroundColor="transparent"
          marginB-24
          style={{ borderTopColor: '#D3D3D3', borderTopWidth: 1, height: 120 }}
        >
          <View marginT-16 marginR-20 style={{ alignItems: 'flex-end' }}>
            {promotionApplied && checkout.total > 0 ? (
              <View row>
                <Text
                  style={{ fontSize: 18, textDecorationLine: 'line-through' }}
                >
                  {getFormattedCurrency(checkout.total)}
                </Text>
                <Text style={{ fontSize: 18 }}> </Text>
                <Text style={{ fontSize: 18 }}>
                  {getFormattedCurrency(checkout.total, true)}
                </Text>
              </View>
            ) : (
              <Text style={{ fontSize: 18 }}>
                {getFormattedCurrency(checkout.total)}
              </Text>
            )}
          </View>
          <View marginL-20 marginR-20>
            <Button
              onPress={() => openBillingAndPayment()}
              marginT-16
              borderRadius={30}
              style={{ backgroundColor: '#2196F3', height: 45, width: '100%' }}
            >
              <Text style={{ fontSize: 16, color: '#fff' }} marginL-10>
                Continue
              </Text>
            </Button>
          </View>
        </View>
      </View>
    </StripeProvider>
  );
}
