import 'react-native-gesture-handler';

import { useState, useEffect } from 'react';
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
import { auth } from 'troptix-firebase';
import SplashScreen from './pages/SplashScreen';
import SignInWithEmailScreen from './pages/auth/SignInWithEmailScreen';
import SignUpWithEmailScreen from './pages/auth/SignUpWithEmailScreen';

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

function SettingsStack({ route }) {
  const { user } = route.params;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name='SettingsScreen'
        component={SettingsScreen}
        initialParams={{ user: user }}
        options={{
          title: 'Settings',
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
        name="SettingsStack"
        component={SettingsStack}
        initialParams={{ user: user }}
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

export default function App() {
  const [user, setUser] = useState();
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const unsubscribeFromAuthStateChange = auth.onAuthStateChanged(user => {
      if (user) {
        setUser(user);
      } else {
        setUser(undefined);
      }
      setIsLoadingUser(false);
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
              /> :
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
                :
                <Stack.Group>
                  <Stack.Screen
                    name="MainAppScreen"
                    component={MainAppScreen}
                    initialParams={{ user: user }}
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
                </Stack.Group>
          }
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
