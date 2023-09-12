import 'react-native-gesture-handler';

import { useEffect, useState } from "react";
import { Text, TouchableHighlight, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SettingsScreen from './pages/navigation/SettingsScreen';
import EventsScreen from './pages/navigation/EventsScreen';
import { Button, Colors, Icon, Image } from 'react-native-ui-lib';
import EventDetailsScreen from './pages/navigation/EventDetailsScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SignInScreen from './pages/navigation/SignInScreen';
import TicketCheckoutScreen from './pages/navigation/TicketCheckoutScreen';
import { auth } from 'troptix-firebase';
import { getUser, TropTixResponse } from 'troptix-api';
import { User, setUserFromResponse } from 'troptix-models';
import SplashScreen from './pages/navigation/SplashScreen';
import SignInWithEmailScreen from './pages/auth/SignInWithEmailScreen';
import SignUpWithEmailScreen from './pages/auth/SignUpWithEmailScreen';
import TicketsScreen from './pages/orders/TicketsScreen';
import TicketDetailsScreen from './pages/orders/TicketDetailsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function EventStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='EventsScreen'
        component={EventsScreen}
        options={{
          title: 'Events',
          headerShadowVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}

function TicketsStack({ route }) {
  const { user } = route.params;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name='TicketsScreen'
        component={TicketsScreen}
        initialParams={{ user: user }}
        options={{
          title: 'Tickets',
          headerShadowVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}


function SettingsStack({ route }) {
  const { user } = route.params;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Settings'
        component={SettingsScreen}
        initialParams={{ user: user }}
        options={{
          title: '',
          headerShadowVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}

function MainAppScreen({ route }) {
  const { user } = route.params;

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="EventsStack"
        component={EventStack}
        initialParams={{ user: user.user }}
        options={{
          headerShown: false,
          tabBarLabel: "",
          tabBarIcon: ({ focused }) => {
            return (
              <View>
                <Image
                  source={require("./assets/icons/event.png")}
                  style={{ width: 26, height: 26, marginTop: 16 }}
                  tintColor={focused ? Colors.blue30 : Colors.black}
                />
              </View>
            );
          },
        }} />
      <Tab.Screen
        name="TicketsStack"
        component={TicketsStack}
        initialParams={{ user: user }}
        options={{
          headerShown: false,
          tabBarLabel: "",
          tabBarIcon: ({ focused }) => {
            return (
              <View>
                <Image
                  source={require("./assets/icons/ticket.png")}
                  style={{ width: 26, height: 26, marginTop: 16 }}
                  tintColor={focused ? Colors.blue30 : Colors.black}
                />
              </View>
            );
          },
        }} />
      <Tab.Screen
        name="SettingsStack"
        component={SettingsStack}
        initialParams={{ user: user }}
        options={{
          headerShown: false,
          tabBarLabel: "",
          tabBarIcon: ({ focused }) => {
            return (
              <View>
                <Image
                  source={require("./assets/icons/settings.png")}
                  style={{ width: 26, height: 26, marginTop: 16 }}
                  tintColor={focused ? Colors.blue30 : Colors.black}
                />
              </View>
            );
          },
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState();
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    async function fetchUser(id) {
      const response = await getUser(id);
      let user = setUserFromResponse(response.response);

      setUser(prevUser => ({ ...prevUser, user }));
      setIsLoadingUser(false);
    }

    const unsubscribeFromAuthStateChange = auth.onAuthStateChanged(user => {
      if (user) {
        fetchUser(user.uid);
      } else {
        setUser(undefined);
        setIsLoadingUser(false);
      }
    });

    return unsubscribeFromAuthStateChange;
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {
            isLoadingUser ?
              <Stack.Screen
                name='SplashScreen'
                component={SplashScreen}
                options={{
                  title: '',
                  headerShadowVisible: false,
                }}
              />
              :
              user === undefined ?
                <Stack.Group>
                  <Stack.Screen
                    name='SignInScreen'
                    component={SignInScreen}
                    options={{
                      title: '',
                      headerShadowVisible: false,
                    }}
                  />
                  <Stack.Screen
                    name="SignInWithEmailScreen"
                    component={SignInWithEmailScreen}
                    options={{
                      title: '',
                      headerShadowVisible: false,
                    }}
                  />
                  <Stack.Screen
                    name="SignUpWithEmailScreen"
                    component={SignUpWithEmailScreen}
                    options={{
                      title: '',
                      headerShadowVisible: false,
                    }}
                  />
                </Stack.Group>
                : <Stack.Group>
                  <Stack.Screen
                    name="MainAppScreen"
                    component={MainAppScreen}
                    initialParams={{ user: user }}
                    options={{
                      headerShown: false,
                      headerBackTitleVisible: false
                    }}
                  />
                  <Stack.Screen
                    name='EventDetailsScreen'
                    component={EventDetailsScreen}
                    options={{
                      title: '',
                      headerTransparent: true,
                      headerBackTitle: 'Back',
                    }}
                  />
                  <Stack.Screen
                    name='TicketCheckoutScreen'
                    component={TicketCheckoutScreen}
                    options={{
                      title: 'Ticket Checkout',
                      headerBackTitle: 'Back',
                      headerBackTitleVisible: false,
                      headerLeft: null,
                      gestureEnabled: false,
                    }}
                  />
                  <Stack.Screen
                    name='TicketsScreen'
                    component={TicketsScreen}
                    options={{
                      title: 'Tickets',
                      headerBackTitle: 'Back',
                      headerBackTitleVisible: false,
                    }}
                  />
                  <Stack.Screen
                    name='TicketDetailsScreen'
                    component={TicketDetailsScreen}
                    options={{
                      title: '',
                      headerBackTitle: 'Back',
                      headerBackTitleVisible: true,
                      headerTransparent: true
                    }}
                  />
                </Stack.Group>
          }
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
