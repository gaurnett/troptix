import 'react-native-gesture-handler';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useContext } from 'react';
import { View } from 'react-native';
import { Colors, Image } from 'react-native-ui-lib';
import { TropTixContext } from '../../App';
import ScanEventScreen from '../ScanEventScreen';
import ScanEventsScreen from '../ScanEventsScreen';
import SettingsScreen from '../SettingsScreen';
import SignInScreen from '../SignInScreen';
import WebViewScreen from '../WebViewScreen';
import SignInWithEmailScreen from '../auth/SignInWithEmailScreen';
import AddEventScreen from '../event/AddEventScreen';
import GooglePlacesScreen from '../event/GooglePlacesScreen';
import TicketFormScreen from '../event/TicketFormScreen';
import AddDelegatorScreen from '../manage-events/AddDelegatorScreen';
import AddPromotionScreen from '../manage-events/AddPromotionScreen';
import ManageEventScreen from '../manage-events/ManageEventScreen';
import ManageEventsScreen from '../manage-events/ManageEventsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function ManageEventStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ManageEventsScreen"
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
        name="ScanEventsScreen"
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
        name="SettingsScreen"
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
        name="ManageEventStack"
        component={ManageEventStack}
        options={{
          headerShown: false,
          tabBarLabel: '',
          tabBarIcon: ({ focused }) => {
            return (
              <View>
                <Image
                  marginT-16
                  source={require('../../assets/icons/calendar_64.png')}
                  resizeMode="contain"
                  style={{ width: 24, height: 24 }}
                  tintColor={focused ? Colors.blue30 : Colors.black}
                />
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="ScanEventsStack"
        component={ScanEventsStack}
        options={{
          headerShown: false,
          tabBarLabel: '',
          tabBarIcon: ({ focused }) => {
            return (
              <View>
                <Image
                  marginT-16
                  source={require('../../assets/icons/qr-code-scan_64.png')}
                  resizeMode="contain"
                  style={{ width: 24, height: 24 }}
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
          tabBarLabel: '',
          tabBarIcon: ({ focused }) => {
            return (
              <View>
                <Image
                  marginT-16
                  source={require('../../assets/icons/settings_64.png')}
                  resizeMode="contain"
                  style={{ width: 24, height: 24 }}
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

export default function AppNavigator() {
  const { user } = useContext(TropTixContext);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <Stack.Group>
            <Stack.Screen
              name="SignInScreen"
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
          </Stack.Group>
        ) : (
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
              name="AddEventScreen"
              component={AddEventScreen}
              options={{
                title: 'Add Event',
                headerBackTitle: 'Back',
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="GooglePlacesScreen"
              component={GooglePlacesScreen}
              options={{
                title: 'Location',
                headerBackTitle: 'Back',
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="ScanEventScreen"
              component={ScanEventScreen}
              options={{
                title: '',
                headerBackTitle: 'Back',
              }}
            />
            <Stack.Screen
              name="ManageEventScreen"
              component={ManageEventScreen}
              options={{
                title: '',
                headerBackTitle: 'Back',
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="AddDelegatorScreen"
              component={AddDelegatorScreen}
              options={{
                title: 'Add Delegator',
                headerBackTitle: 'Back',
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="AddPromotionScreen"
              component={AddPromotionScreen}
              options={{
                title: 'Add Promotion',
                headerBackTitle: 'Back',
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="TicketFormScreen"
              component={TicketFormScreen}
              options={{
                title: '',
                headerBackTitle: 'Back',
              }}
            />
            <Stack.Screen
              name="WebViewScreen"
              component={WebViewScreen}
              options={{
                title: '',
                headerBackTitle: 'Back',
              }}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
