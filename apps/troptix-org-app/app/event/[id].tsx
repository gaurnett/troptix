import { useFetchEventById } from '@/hooks/useFetchEvents';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import CheckInPage from './checkin';
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

interface ScannerProps {
  initialData: any; // Replace 'any' with your object's type
}

export default function EventDetails() {
  const { id } = useLocalSearchParams();
  const { isPending, isError, data, error } = useFetchEventById(id as string);

  return (
    <View style={{ height: '100%', backgroundColor: 'white' }}>
      {isPending ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text>Loading...</Text>
        </View>
      ) : (
        <Tab.Navigator>
          <Tab.Screen name="Scan Tickets">
            {() => <Scanner event={data} />}
          </Tab.Screen>
          <Tab.Screen name="Check In">
            {() => <CheckInPage event={data} />}
          </Tab.Screen>
        </Tab.Navigator>
      )}
    </View>
  );
}
