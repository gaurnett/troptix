import 'react-native-gesture-handler';

import * as React from 'react';
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

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function EventStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='EventsScreen'
        component={EventsScreen}
        options={{
          title: 'Events'
        }}
      />
    </Stack.Navigator>
  );
}

function SettingsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Settings'
        component={SettingsScreen}
        options={{
          title: 'Settings'
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
          tabBarLabel: "Events",
          tabBarIcon: ({ focused }) => {
            return (
              <View>
                <Image
                  source={require("./assets/icons/calendar.png")}
                  resizeMode="contain"
                  style={{ width: 24 }}
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
          tabBarLabel: "Settings",
          tabBarIcon: ({ focused }) => {
            return (
              <View>
                <Image
                  source={require("./assets/icons/settings.png")}
                  resizeMode="contain"
                  style={{ width: 24 }}
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

export default function App({ navigation }) {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name='SignInScreen'
            component={SignInScreen}
            options={{
              title: '',
              headerShadowVisible: false,
            }}
          />
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
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
