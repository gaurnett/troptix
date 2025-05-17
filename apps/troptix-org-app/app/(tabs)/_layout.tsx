import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: true,
          headerTitle: 'Manage Events',
          headerShadowVisible: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={24} name="event-note" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="scanner"
        options={{
          title: 'Scan Tickets',
          headerShown: true,
          headerTitle: 'Scan Tickets',
          headerShadowVisible: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={24} name="qr-code-scanner" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerShown: true,
          headerTitle: 'Settings',
          headerShadowVisible: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={24} name="settings" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
