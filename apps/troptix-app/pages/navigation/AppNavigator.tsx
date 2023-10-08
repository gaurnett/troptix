import 'react-native-gesture-handler';

import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SettingsScreen from './SettingsScreen';
import EventsScreen from './EventsScreen';
import { Colors, Image } from 'react-native-ui-lib';
import EventDetailsScreen from './EventDetailsScreen';
import SignInScreen from './SignInScreen';
import TicketCheckoutScreen from './TicketCheckoutScreen';
import SplashScreen from './SplashScreen';
import SignInWithEmailScreen from '../auth/SignInWithEmailScreen';
import SignUpWithEmailScreen from '../auth/SignUpWithEmailScreen';
import TicketsScreen from '../orders/TicketsScreen';
import TicketDetailsScreen from '../orders/TicketDetailsScreen';

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
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='TicketsScreen'
        component={TicketsScreen}
        options={{
          title: 'Tickets',
          headerShadowVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}


function SettingsStack({ route }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Settings'
        component={SettingsScreen}
        options={{
          title: '',
          headerShadowVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}

function MainAppScreen() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="EventsStack"
        component={EventStack}
        options={{
          headerShown: false,
          tabBarLabel: "",
          tabBarIcon: ({ focused }) => {
            return (
              <View>
                <Image
                  source={require("../../assets/icons/event.png")}
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
        options={{
          headerShown: false,
          tabBarLabel: "",
          tabBarIcon: ({ focused }) => {
            return (
              <View>
                <Image
                  source={require("../../assets/icons/ticket.png")}
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
        options={{
          headerShown: false,
          tabBarLabel: "",
          tabBarIcon: ({ focused }) => {
            return (
              <View>
                <Image
                  source={require("../../assets/icons/settings.png")}
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

export default function AppNavigator({ isLoadingUser, user }) {
  return (
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
  );
}
