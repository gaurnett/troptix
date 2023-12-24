import { useContext } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { Colors, Image, ListItem, Text, View } from 'react-native-ui-lib';
import { TropTixContext } from '../App';
import { auth } from '../firebase/config';

const styles = StyleSheet.create({
  image: {
    width: 24,
    height: 24,
    marginRight: 16
  },
  border: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey70
  }
});
enum SettingsType {
  TICKETS,
  ORDERS,
  MANAGE_ACCOUNT,
  SIGN_OUT,
  CONTACT_US,
  SUGGEST_IMPROVEMENTS,
  TERMS_OF_SERVICE,
  PRIVACY
}

export default function SettingsScreen({ navigation }) {
  const { user } = useContext(TropTixContext);

  function signOut() {
    auth.signOut();
  }

  function handleSettingsClick(type: SettingsType) {
    console.log(type);
    switch (type) {
      case SettingsType.TICKETS:
        navigation.navigate('TicketsScreen', {
          user: user
        })
        break;
      case SettingsType.ORDERS:
        // setUser(prevUser => ({ ...prevUser, ["name"]: "Hello" }));
        break;
      case SettingsType.MANAGE_ACCOUNT:
        break;
      case SettingsType.SIGN_OUT:
        // signOut();
        break;
      case SettingsType.CONTACT_US:
        navigation.navigate('WebViewScreen', {
          url: "https://www.usetroptix.com/contact"
        });
        break;
      case SettingsType.SUGGEST_IMPROVEMENTS:
        navigation.navigate('WebViewScreen', {
          url: "https://www.usetroptix.com/contact"
        });
        break;
      case SettingsType.TERMS_OF_SERVICE:
        navigation.navigate('WebViewScreen', {
          url: "https://www.usetroptix.com/terms"
        });
        break;
      case SettingsType.PRIVACY:
        navigation.navigate('WebViewScreen', {
          url: "https://www.usetroptix.com/privacypolicy"
        });
        break;
      default:
        () => Alert.alert(`pressed on order #`)
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
            resizeMode='cover'
            source={icon}
            style={styles.image}
            tintColor={color} />
        </ListItem.Part>
        <ListItem.Part containerStyle={[styles.border, { paddingRight: 17 }]}>
          <ListItem.Part>
            <Text grey10 text70 style={{ flex: 1, marginRight: 10 }} numberOfLines={1}>
              {title}
            </Text>
          </ListItem.Part>
        </ListItem.Part>
      </ListItem>
    );
  };

  return (
    <View style={{ backgroundColor: 'white' }}>
      <View>
        <ScrollView style={{ height: '100%' }}>
          <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
            <Text style={{ fontSize: 20, fontWeight: "200" }} marginL-10>{user ? user.email : ""}</Text>
          </View>

          <View marginL-16>
            {/* <View>
              <Text marginT-16 marginB-8 text40 $textDefault>
                Events
              </Text>
              <View>
                {renderSettingsRow(SettingsType.TICKETS, "My Tickets", require('../assets/icons/ticket.png'), Colors.green50)}
              </View>
              <View>
                {renderSettingsRow(SettingsType.ORDERS, "Orders", require('../assets/icons/order.png'), Colors.purple50)}
              </View>
            </View> */}

            <View>
              <Text marginT-16 marginB-8 text40 $textDefault>
                Settings
              </Text>
              <View>
                {renderSettingsRow(SettingsType.MANAGE_ACCOUNT, "Manage Account", require('../assets/icons/person.png'), Colors.blue50)}
              </View>
              <View>
                {renderSettingsRow(SettingsType.SIGN_OUT, "Sign Out", require('../assets/icons/logout.png'), Colors.red50)}
              </View>
            </View>

            <View>
              <Text marginT-16 marginB-8 text40 $textDefault>
                Support
              </Text>
              <View>
                {renderSettingsRow(SettingsType.CONTACT_US, "Contact Us", require('../assets/icons/contact.png'), Colors.orange50)}
              </View>
              <View>
                {renderSettingsRow(SettingsType.SUGGEST_IMPROVEMENTS, "Suggest Improvements", require('../assets/icons/edit.png'), Colors.violet50)}
              </View>
              <View>
                {renderSettingsRow(SettingsType.TERMS_OF_SERVICE, "Terms of Service", require('../assets/icons/verified.png'), Colors.grey50)}
              </View>
              <View>
                {renderSettingsRow(SettingsType.PRIVACY, "Privacy", require('../assets/icons/lock.png'), Colors.red50)}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}