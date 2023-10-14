import 'react-native-gesture-handler';

import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Colors, Image } from 'react-native-ui-lib';
import SignInWithEmailScreen from '../auth/SignInWithEmailScreen';
import SignUpWithEmailScreen from '../auth/SignUpWithEmailScreen';
import ManageEventsScreen from '../manage-events/ManageEventsScreen';
import ScanEventsScreen from '../ScanEventsScreen';
import SettingsScreen from '../SettingsScreen';
import SplashScreen from '../SplashScreen';
import AddEventScreen from '../event/AddEventScreen';
import GooglePlacesScreen from '../event/GooglePlacesScreen';
import ScanEventScreen from '../ScanEventScreen';
import ManageEventScreen from '../manage-events/ManageEventScreen';
import TicketFormScreen from '../event/TicketFormScreen';
import SignInScreen from '../SignInScreen';
import AddDelegatorScreen from '../manage-events/AddDelegatorScreen';

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
                  source={require("../../assets/icons/calendar.png")}
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
                  source={require("../../assets/icons/scan.png")}
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
                  source={require("../../assets/icons/settings.png")}
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
                  name='AddEventScreen'
                  component={AddEventScreen}
                  options={{
                    title: 'Add Event',
                    headerBackTitle: 'Back',
                    headerShadowVisible: false,
                  }}
                />
                <Stack.Screen
                  name='GooglePlacesScreen'
                  component={GooglePlacesScreen}
                  options={{
                    title: 'Location',
                    headerBackTitle: 'Back',
                    headerShadowVisible: false,
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
                  name='AddDelegatorScreen'
                  component={AddDelegatorScreen}
                  options={{
                    title: 'Add Delegator',
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
  );
}
