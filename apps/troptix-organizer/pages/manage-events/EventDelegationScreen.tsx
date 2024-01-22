import 'react-native-gesture-handler';
import _ from 'lodash';
import Animated from 'react-native-reanimated';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Pressable, ScrollView } from 'react-native';
import {
  Button,
  Colors,
  FloatingButton,
  FloatingButtonLayouts,
  Image,
  ListItem,
  LoaderScreen,
  Text,
  View,
} from 'react-native-ui-lib';
import CircularProgress from 'react-native-circular-progress-indicator';
import { getDelegatedUsers } from 'troptix-api';
import { Event, DelegatedUser, DelegatedAccess } from 'troptix-models';
import { RefreshControl } from 'react-native-gesture-handler';

export default function EventDelegationScreen({ eventObject, navigation }) {
  const [delegatedUsers, setDelegatedUsers] = useState<DelegatedUser[]>([]);
  const [isFetchingUsers, setIsFetchingUsers] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await getDelegatedUsers(eventObject.id);

      console.log('Delegated Users Response: ' + JSON.stringify(response));
      if (response !== undefined && response.length !== 0) {
        setDelegatedUsers(response);
      }
    } catch (error) {
      console.log('EventDelegationScreen [fetchUsers] error: ' + error);
    }
    setIsFetchingUsers(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUsers();
    setRefreshing(false);
  }, []);

  function deleteUser(index) {
    const deletedUser = delegatedUsers.at(index);
    Alert.alert('Delete User', 'Are you sure you want to delete this user?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => {
          setDelegatedUsers(
            delegatedUsers.filter((user) => user.email !== deletedUser.email)
          );
        },
      },
    ]);
  }

  function addUser(user) {
    setDelegatedUsers([...delegatedUsers, user]);
  }

  function editUser(index, user) {
    const updatedUsers = [
      ...delegatedUsers.slice(0, index),
      user,
      ...delegatedUsers.slice(index),
    ];
    setDelegatedUsers(updatedUsers);
  }

  function openAddUserPage(user, isEditUser = false, index = 0) {
    console.log('Pressing');
    navigation.navigate('AddDelegatorScreen', {
      isEditUser: false,
      userIndex: index,
      user: user,
      addUser: addUser,
      editUser: editUser,
    });
  }

  function getDelegatedAccess(access) {
    switch (access) {
      case DelegatedAccess.OWNER:
        return 'Owner';
      case DelegatedAccess.TICKET_SCANNER:
        return 'Ticket Scanner';
      default:
        break;
    }
  }

  function UserItem(user, index) {
    return (
      <View
        style={{
          backgroundColor: 'white',
          borderWidth: 1,
          borderRadius: 5,
          borderColor: '#D3D3D3',
        }}
      >
        <Pressable onPress={() => openAddUserPage(user, true, index)}>
          <View marginL-8 marginT-4 marginB-4>
            <Text grey10 text70 style={{ fontWeight: 'bold' }}>
              {user.email}
            </Text>
            <Text grey10 text70>
              Role: {getDelegatedAccess(user.delegatedAccess)}
            </Text>
          </View>
        </Pressable>
      </View>
    );
  }

  function renderUsers() {
    return _.map(delegatedUsers, (user, i) => {
      return (
        <View key={i} marginT-16 row>
          <View flex>{UserItem(user, i)}</View>

          <View
            style={{ justifyContent: 'center', alignItems: 'center' }}
            marginL-8
          >
            <Pressable onPress={() => deleteUser(i)}>
              <Image
                source={require('../../assets/icons/delete.png')}
                tintColor={Colors.black}
                width={24}
                height={24}
              />
            </Pressable>
          </View>
        </View>
      );
    });
  }

  return (
    <View
      paddingR-16
      paddingL-16
      style={{ height: '100%' }}
      backgroundColor="white"
    >
      {isFetchingUsers ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <LoaderScreen
            message={'Fetching Event Users'}
            color={Colors.grey40}
          />
        </View>
      ) : (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <View marginB-48 style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
              <View>
                <Text
                  style={{ fontSize: 14 }}
                  marginT-16
                  marginB-8
                  $textDefault
                >
                  Control access by adding certain delegated access to users.
                  This is best used when allowing other users to be able to scan
                  tickets.
                </Text>
              </View>
              <View>
                <Text
                  style={{ fontSize: 20 }}
                  marginT-16
                  marginB-8
                  $textDefault
                >
                  Users
                </Text>
                {renderUsers()}
              </View>
            </ScrollView>
          </View>

          <View marginB-16>
            <FloatingButton
              visible={true}
              button={{
                label: 'Add User',
                onPress: () =>
                  openAddUserPage(new DelegatedUser(eventObject.id)),
              }}
              buttonLayout={FloatingButtonLayouts.HORIZONTAL}
              bottomMargin={16}
            />
          </View>
        </View>
      )}
    </View>
  );
}
