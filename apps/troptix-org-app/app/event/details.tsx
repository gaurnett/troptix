import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import Scanner from './scanner';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      {/* <Button onPress={() => navigation.navigate('Profile')}>
        Go to Profile
      </Button> */}
    </View>
  );
}

function ProfileScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>
      {/* <Button onPress={() => navigation.navigate('Home')}>Go to Home</Button> */}
    </View>
  );
}

const Tab = createMaterialTopTabNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});

export default function EventDetails() {
  const { event } = useLocalSearchParams();
  return (
    <Tab.Navigator>
      <Tab.Screen name="Scan Tickets" component={Scanner} />
      <Tab.Screen name="Check In" component={ProfileScreen} />
      <Tab.Screen name="Analytics" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
