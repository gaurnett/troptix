import _ from 'lodash';
import { useContext, useEffect, useState, useRef } from 'react';
import {
  Alert,
  Keyboard,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
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
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

export default function TicketBillingAndPaymentScreen({ route, navigation }) {
  const [user, setUser] = useContext(TropTixContext);
  const { finalCheckout, event } = route.params;
  const [checkout, setCheckout] = useState<Checkout>(finalCheckout);
  const stripe = useStripe();
  const [isApplePaySupported, setIsApplePaySupported] = useState(false);
  const billingAddress1Ref = useRef();
  const billingAddress2Ref = useRef();
  const billingCityRef = useRef();
  const billingZipRef = useRef();
  const billingStateRef = useRef();
  const billingCountryRef = useRef();

  // useEffect(() => {
  //   (async function () {
  //     setIsApplePaySupported(await isPlatformPaySupported());
  //   })();
  // }, [isPlatformPaySupported]);

  // useEffect(
  //   () =>
  //     navigation.setOptions({
  //       headerRight: () => (
  //         <Pressable onPress={() => navigation.goBack()}>
  //           <Image
  //             marginR-24
  //             source={require("../../assets/icons/close.png")}
  //             resizeMode="contain"
  //             style={{ width: 24 }}
  //           />
  //         </Pressable>
  //       ),
  //     }),
  //   [navigation]
  // );

  function updateCheckout(name, value) {
    setCheckout((previousCheckout) => ({ ...previousCheckout, [name]: value }));
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
        name: user.name,
        email: user.email,
        address: {
          line1: checkout.billingAddress1,
          line2: checkout.billingAddress2,
          city: checkout.billingCity,
          state: checkout.billingState,
          postalCode: checkout.billingZip,
          country: checkout.billingCountry,
        },
      },
    });

    console.log(error);

    if (error) {
      console.log('Error: ' + error.localizedMessage);
      // setLoading(true);
    }

    return paymentId;
  };

  async function openStripePayment() {
    console.log(JSON.stringify(checkout));

    let paymentId = undefined;

    try {
      paymentId = await initializePaymentSheet();
    } catch (error) {
      console.log('[openStripePayment] initializePaymentSheet error: ' + error);
    }

    if (paymentId === undefined) {
      Alert.alert('Cannot create payment order, please try again later');
      return;
    }

    const order = new Order(checkout, paymentId, event.id, user.id);
    console.log(order);
    // return;

    try {
      const postOrdersRequest: PostOrdersRequest = {
        type: PostOrdersType.POST_ORDERS_CREATE_ORDER,
        order: order,
      };
      await postOrders(postOrdersRequest);
    } catch (error) {
      console.log('[openStripePayment] create order error: ' + error);
      return;
    }

    const { error, paymentOption } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error`, error.message);
    } else {
      console.log(paymentOption);
      Alert.alert('Success', 'Your order is confirmed!');
    }
  }

  function getFormattedCurrency(price) {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    return formatter.format(price);
  }

  return (
    <StripeProvider
      publishableKey="pk_test_51Noxs0FEd6UvxBWGgUgu6JQw6VnDqC8ei9YkxAthxkjGBsAY3OKEKbkuRlnCTcHoVnQp5vvCrM0YfuhSFQZv3wR300x6wKe6oJ"
      merchantIdentifier="merchant.identifier"
    >
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollView
          // contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between', flexDirection: 'column' }}
          automaticallyAdjustKeyboardInsets
        >
          <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View row>
              <View marginL-20 marginR-20 flex>
                <Text
                  style={{ fontSize: 20, fontWeight: 'bold' }}
                  marginT-16
                  marginB-8
                  $textDefault
                >
                  Billing Address
                </Text>

                <CustomTextField
                  name="billingAddress1"
                  label="Address *"
                  placeholder="150 Kings Street"
                  value={checkout.billingAddress1}
                  reference={billingAddress1Ref}
                  handleChange={updateCheckout}
                />
                <CustomTextField
                  name="billingAddress2"
                  label="Address 2"
                  placeholder="150 Kings Street"
                  value={checkout.billingAddress2}
                  reference={billingAddress2Ref}
                  handleChange={updateCheckout}
                />
                <View row>
                  <View marginR-8 flex>
                    <CustomTextField
                      name="billingCity"
                      label="City *"
                      placeholder="Kingston"
                      value={checkout.billingCity}
                      reference={billingCityRef}
                      handleChange={updateCheckout}
                    />
                  </View>
                  <View marginL-8 flex>
                    <CustomTextField
                      name="billingZip"
                      label="Zip/Postal Code"
                      placeholder="12345"
                      value={checkout.billingZip}
                      reference={billingZipRef}
                      handleChange={updateCheckout}
                    />
                  </View>
                </View>
                <View row>
                  <View marginR-8 flex>
                    <CustomTextField
                      name="billingState"
                      label="State/Parish *"
                      placeholder="Kingston"
                      value={checkout.billingState}
                      reference={billingStateRef}
                      handleChange={updateCheckout}
                    />
                  </View>
                  <View marginL-8 flex>
                    <CustomTextField
                      name="billingCountry"
                      label="Country *"
                      placeholder="Jamaica"
                      value={checkout.billingCountry}
                      reference={billingCountryRef}
                      handleChange={updateCheckout}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        <View
          backgroundColor="transparent"
          marginB-24
          style={{ borderTopColor: '#D3D3D3', borderTopWidth: 1, height: 120 }}
        >
          <View marginT-16 marginR-20 style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 18 }}>
              Total: {getFormattedCurrency(checkout.total)}
            </Text>
          </View>
          <View marginL-20 marginR-20>
            {/* <Button
              backgroundColor={Colors.orange30}
              borderRadius={30}
              style={{ backgroundColor: '#000', height: 45, width: '100%' }}>
              <Image source={require('../../assets/logo/apple-pay.png')} tintColor={Colors.white} width={48} height={48} />
            </Button> */}

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
              style={{ backgroundColor: '#2196F3', height: 45, width: '100%' }}
            >
              <Text style={{ fontSize: 16, color: '#fff' }} marginL-10>
                Pay
              </Text>
            </Button>
          </View>
        </View>
      </View>
    </StripeProvider>
  );
}
