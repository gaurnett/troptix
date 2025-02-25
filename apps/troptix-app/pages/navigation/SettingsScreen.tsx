import { useContext } from 'react';
import { StyleSheet, Alert, FlatList, ScrollView } from 'react-native';
import {
  View,
  Text,
  Colors,
  ListItem,
  Image,
  BorderRadiuses,
} from 'react-native-ui-lib';
import orders, { OrderType } from '../../data/orders';
import { auth } from 'troptix-firebase';
import { TropTixContext } from '../../App';

const cardImage = require('../../assets/favicon.png');
const styles = StyleSheet.create({
  image: {
    width: 24,
    height: 24,
    marginRight: 16,
  },
  border: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey70,
  },
});
enum SettingsType {
  TICKETS,
  ORDERS,
  MANAGE_ACCOUNT,
  SIGN_OUT,
  CONTACT_US,
  SUGGEST_IMPROVEMENTS,
  TERMS_OF_SERVICE,
  PRIVACY,
}

export default function SettingsScreen({ navigation }) {
  const [user, setUser] = useContext(TropTixContext);

  function signOut() {
    auth.signOut();
  }

  function handleSettingsClick(type: SettingsType) {
    switch (type) {
      case SettingsType.TICKETS:
        navigation.navigate('TicketsScreen', {
          user: user,
        });
      case SettingsType.ORDERS:
        setUser((prevUser) => ({ ...prevUser, ['name']: 'Hello' }));
        break;
      case SettingsType.MANAGE_ACCOUNT:
        break;
      case SettingsType.SIGN_OUT:
        signOut();
        break;
      case SettingsType.CONTACT_US:
      case SettingsType.SUGGEST_IMPROVEMENTS:
      case SettingsType.TERMS_OF_SERVICE:
      case SettingsType.PRIVACY:
      default:
        () => Alert.alert(`pressed on order #`);
    }
  }

  function renderSettingsRow(type: SettingsType, title: String, icon, color) {
    return (
      <ListItem
        activeBackgroundColor={Colors.white}
        activeOpacity={0.3}
        onPress={() => handleSettingsClick(type)}
      >
        <ListItem.Part left>
          <Image
            resizeMode="cover"
            source={icon}
            style={styles.image}
            tintColor={color}
          />
        </ListItem.Part>
        <ListItem.Part containerStyle={[styles.border, { paddingRight: 17 }]}>
          <ListItem.Part>
            <Text
              grey10
              text70
              style={{ flex: 1, marginRight: 10 }}
              numberOfLines={1}
            >
              {title}
            </Text>
          </ListItem.Part>
        </ListItem.Part>
      </ListItem>
    );
  }

  return (
    <View style={{ backgroundColor: 'white' }}>
      <View>
        <ScrollView style={{ height: '100%' }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'white',
            }}
          >
            <Text style={{ fontSize: 28, fontWeight: '500' }} marginL-10>
              Hi {user !== undefined ? user.name : ''}
            </Text>
            <Text style={{ fontSize: 20, fontWeight: '200' }} marginL-10>
              {user !== undefined ? user.email : ''}
            </Text>
          </View>

          <View marginL-16>
            <View>
              <Text marginT-16 marginB-8 text40 $textDefault>
                Events
              </Text>
              <View>
                {renderSettingsRow(
                  SettingsType.TICKETS,
                  'My Tickets',
                  require('../../assets/icons/ticket.png'),
                  Colors.green50
                )}
              </View>
              <View>
                {renderSettingsRow(
                  SettingsType.ORDERS,
                  'Orders',
                  require('../../assets/icons/order.png'),
                  Colors.purple50
                )}
              </View>
            </View>

            <View>
              <Text marginT-16 marginB-8 text40 $textDefault>
                Settings
              </Text>
              <View>
                {renderSettingsRow(
                  SettingsType.MANAGE_ACCOUNT,
                  'Manage Account',
                  require('../../assets/icons/person.png'),
                  Colors.blue50
                )}
              </View>
              <View>
                {renderSettingsRow(
                  SettingsType.SIGN_OUT,
                  'Sign Out',
                  require('../../assets/icons/logout.png'),
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
                  SettingsType.CONTACT_US,
                  'Contact Us',
                  require('../../assets/icons/contact.png'),
                  Colors.orange50
                )}
              </View>
              <View>
                {renderSettingsRow(
                  SettingsType.SUGGEST_IMPROVEMENTS,
                  'Suggest Improvements',
                  require('../../assets/icons/edit.png'),
                  Colors.violet50
                )}
              </View>
              <View>
                {renderSettingsRow(
                  SettingsType.TERMS_OF_SERVICE,
                  'Terms of Service',
                  require('../../assets/icons/verified.png'),
                  Colors.grey50
                )}
              </View>
              <View>
                {renderSettingsRow(
                  SettingsType.PRIVACY,
                  'Privacy',
                  require('../../assets/icons/lock.png'),
                  Colors.red50
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
