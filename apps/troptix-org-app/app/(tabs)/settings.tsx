import { prodUrl } from '@/hooks/constants';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getAuth } from '@react-native-firebase/auth';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Alert, Pressable, ScrollView, View } from 'react-native';
import { Colors, Text } from 'react-native-ui-lib';
import { useAuth } from '../_layout';

enum SettingsType {
  SIGN_OUT,
  CONTACT_US,
  SUGGEST_IMPROVEMENTS,
  TERMS_OF_SERVICE,
  PRIVACY,
}

export default function Settings() {
  const { user } = useAuth();

  async function handleSettingsClick(type: SettingsType) {
    switch (type) {
      case SettingsType.SIGN_OUT:
        await getAuth().signOut();
        router.replace('/(auth)');
        break;
      case SettingsType.CONTACT_US:
        await WebBrowser.openBrowserAsync('https://www.usetroptix.com/contact');
        break;
      case SettingsType.SUGGEST_IMPROVEMENTS:
        await WebBrowser.openBrowserAsync('https://www.usetroptix.com/contact');
        break;
      case SettingsType.TERMS_OF_SERVICE:
        await WebBrowser.openBrowserAsync('https://www.usetroptix.com/terms');
        break;
      case SettingsType.PRIVACY:
        await WebBrowser.openBrowserAsync(
          'https://www.usetroptix.com/privacypolicy'
        );
        break;
      default:
        () => Alert.alert(`pressed on order #`);
    }
  }

  function renderSettingsRow(
    type: SettingsType,
    title: String,
    icon: string,
    color: string
  ) {
    return (
      <Pressable
        onPress={() => {
          return handleSettingsClick(type);
        }}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 16,
            paddingBlock: 8,
          }}
        >
          <Ionicons
            name={icon}
            style={{ marginRight: 24 }}
            size={24}
            color={color}
          />
          <Text style={{ fontSize: 20, fontWeight: '200' }}>{title}</Text>
        </View>
        <View
          style={{
            height: 0.5,
            backgroundColor: '#ddd',
            marginTop: 12,
            marginInline: 16,
          }}
        />
      </Pressable>
    );
  }

  return (
    <View style={{ backgroundColor: 'white', paddingTop: 20 }}>
      <View>
        <ScrollView style={{ height: '100%' }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'white',
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: '200' }}>
              {user ? user.email : ''}
            </Text>
          </View>

          <View style={{ marginStart: 16 }}>
            <View>
              <Text marginT-16 marginB-8 text40 $textDefault>
                Settings
              </Text>
              <View>
                {renderSettingsRow(
                  SettingsType.SIGN_OUT,
                  'Sign Out',
                  'exit-outline',
                  Colors.red50
                )}
              </View>
            </View>

            <View>
              <Text marginT-16 marginB-8 text40 $textDefault>
                Support
              </Text>
              <View>
                {renderSettingsRow(
                  SettingsType.TERMS_OF_SERVICE,
                  'Terms of Service',
                  'shield-checkmark-outline',
                  Colors.grey50
                )}
              </View>
              <View>
                {renderSettingsRow(
                  SettingsType.PRIVACY,
                  'Privacy',
                  'lock-closed-outline',
                  Colors.red50
                )}
              </View>
            </View>
            <View>
              <Text marginT-16 marginB-8 $textDefault>
                {prodUrl}
              </Text>
              <Text marginT-16 marginB-8 $textDefault>
                {user?.uid}
              </Text>
              <Text>{__DEV__ ? 'Development Mode' : 'Production Mode'}</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
