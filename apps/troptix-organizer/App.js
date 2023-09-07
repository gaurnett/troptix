import 'react-native-gesture-handler';

import * as React from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SettingsScreen from './pages/SettingsScreen';
import DashboardScreen from './pages/DashboardScreen';
import ManageEventsScreen from './pages/ManageEventsScreen';
import SignInScreen from './pages/SignInScreen';
import ScanEventsScreen from './pages/ScanEventsScreen';
import AddEventScreen from './pages/AddEventScreen';
import { Button, Colors, Icon, Image } from 'react-native-ui-lib';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ScanEventScreen from './pages/ScanEventScreen';
import ManageEventScreen from './pages/ManageEventScreen';
import TicketFormScreen from './pages/TicketFormScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function ManageEventStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='ManageEventsScreen'
        component={ManageEventsScreen}
        options={{
          title: 'Manage Events',
          headerShadowVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}

function AddEventStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='AddEventScreen'
        component={AddEventScreen}
        options={{
          title: 'Add Event',
          headerShadowVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}

function ScanEventsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='ScanEventsScreen'
        component={ScanEventsScreen}
        options={{
          title: 'Scan Tickets',
          headerShadowVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}

function SettingsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='SettingsScreen'
        component={SettingsScreen}
        options={{
          title: 'Settings',
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
        name="ManageEventStack" component={ManageEventStack}
        options={{
          headerShown: false,
          tabBarLabel: "Manage Events",
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
        }}
      />
      <Tab.Screen
        name="AddEventStack" component={AddEventStack}
        options={{
          headerShown: false,
          tabBarLabel: "Add Event",
          tabBarIcon: ({ focused }) => {
            return (
              <View>
                <Image
                  source={require("./assets/icons/add.png")}
                  resizeMode="contain"
                  style={{ width: 24 }}
                  tintColor={focused ? Colors.blue30 : Colors.black}
                />
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="ScanEventsStack" component={ScanEventsStack}
        options={{
          headerShown: false,
          tabBarLabel: "Scan",
          tabBarIcon: ({ focused }) => {
            return (
              <View>
                <Image
                  source={require("./assets/icons/scan.png")}
                  resizeMode="contain"
                  style={{ width: 24 }}
                  tintColor={focused ? Colors.blue30 : Colors.black}
                />
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="SettingsStack" component={SettingsStack}
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
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen
            name='ScanEventScreen'
            component={ScanEventScreen}
            options={{
              title: '',
              headerBackTitle: 'Back',
            }}
          />
          <Stack.Screen
            name='ManageEventScreen'
            component={ManageEventScreen}
            options={{
              title: '',
              headerBackTitle: 'Back',
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name='TicketFormScreen'
            component={TicketFormScreen}
            options={{
              title: '',
              headerBackTitle: 'Back',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
