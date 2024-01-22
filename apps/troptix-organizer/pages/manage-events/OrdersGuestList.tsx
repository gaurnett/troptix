import { useContext, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
  Button,
  Colors,
  Text,
  TextField,
  Toast,
  View,
} from 'react-native-ui-lib';
import { TropTixContext } from '../../App';
import { Ticket, TicketStatus } from '../../hooks/types/Ticket';
import {
  PostTicketRequest,
  PostTicketType,
  useCreateTicket,
} from '../../hooks/useTicket';

type GuestListRow = {
  orderId: string;
  ticketId: string;
  name: string;
  email: string;
};

type ToastSettings = {
  toastDismiss?: number;
  toastMessage?: string;
  toastIcon?: any;
  showLoader?: boolean;
};

export default function OrdersGuestList({ orders }) {
  const [guests, setGuests] = useState<Ticket[]>([]);
  const { user } = useContext(TropTixContext);
  const [originalGuestList, setOriginalGuestList] = useState<Ticket[]>([]);
  const [toastSettings, setToastSettings] = useState<ToastSettings>({});
  const [showToast, setShowToast] = useState(false);
  const createTicket = useCreateTicket();
  const [searchValue, setSearchValue] = useState('');
  const searchValueRef = useRef();

  useEffect(() => {
    let guestList: Ticket[] = [];
    let data: GuestListRow[] = [];

    orders.forEach((order) => {
      const tickets = order.tickets;

      tickets.forEach((ticket) => {
        guestList.push(ticket);

        const row: GuestListRow = {
          orderId: ticket.orderId as string,
          ticketId: ticket.id as string,
          name: ticket.firstName + ' ' + ticket.lastName,
          email: ticket.email as string,
        };
        data.push(row);
      });
    });

    setGuests(guestList);
    setOriginalGuestList(guestList);
  }, [orders]);

  function checkIn(ticket: Ticket, index: number) {
    let title = 'Check in guest';
    let description = `Are you sure you want to check in ${ticket?.firstName} ${ticket?.lastName}?`;
    let buttonText = 'Check In';

    if (ticket.status === TicketStatus.NOT_AVAILABLE) {
      title = 'Activate Ticket';
      description = 'Are you sure you want to activate this ticket?';
      buttonText = 'Activate Ticket';
    }

    Alert.alert(title, description, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: buttonText,
        onPress: () => {
          processCheckIn(ticket, index);
        },
      },
    ]);
  }

  function processCheckIn(guest: Ticket, index: number) {
    const updatedTicket = {
      ...guest,
      ['status']:
        !guest?.status || guest?.status === TicketStatus.NOT_AVAILABLE
          ? TicketStatus.AVAILABLE
          : TicketStatus.NOT_AVAILABLE,
    };

    setShowToast(true);
    setToastSettings({
      toastMessage: 'Updating Ticket...',
      toastDismiss: 0,
      showLoader: true,
    });

    const request: PostTicketRequest = {
      type: PostTicketType.UPDATE_STATUS,
      ticket: updatedTicket,
      jwtToken: user?.jwtToken,
    };

    createTicket.mutate(request, {
      onSuccess: (data) => {
        let oldData = guests[index];
        oldData = {
          ...guests[index],
          ...data,
        };

        const updatedGuests = guests.map((guest, i) => {
          if (guest.id === oldData.id) {
            return oldData;
          } else {
            return guest;
          }
        });

        setGuests(updatedGuests);

        setShowToast(false);
        setShowToast(true);
        setToastSettings({
          toastMessage: 'Successfully updated ticket.',
          toastDismiss: 2000,
          showLoader: false,
          toastIcon: require('../../assets/icons/done.png'),
        });
      },
      onError: (error) => {
        setShowToast(false);
        setShowToast(true);
        setToastSettings({
          toastMessage: 'Failed to update ticket, please try again.',
          toastDismiss: 2000,
          showLoader: false,
          toastIcon: require('../../assets/icons/close.png'),
        });
        return;
      },
    });
  }

  function updateToastVisibility() {
    setShowToast(!showToast);
  }

  function handleChange(value) {
    setSearchValue(value);
    filterList(value);
  }

  function doesStringInclude(string1: string, string2: string) {
    if (!string1 || !string2) {
      return false;
    }

    return string1.toLowerCase().includes(string2.toLowerCase());
  }

  function filterList(value: string) {
    if (value === '' || value === undefined) {
      setGuests(originalGuestList);
    } else {
      setGuests(
        originalGuestList.filter(
          (guest) =>
            doesStringInclude(guest.id as string, value) ||
            doesStringInclude(guest?.firstName as string, value) ||
            doesStringInclude(guest?.lastName as string, value)
        )
      );
    }
  }

  return (
    <View height={'100%'}>
      <Toast
        position={'bottom'}
        swipeable={true}
        visible={showToast}
        message={toastSettings.toastMessage}
        showLoader={toastSettings.showLoader}
        autoDismiss={toastSettings.toastDismiss}
        icon={toastSettings.toastIcon}
        onDismiss={updateToastVisibility}
      />
      <View
        height={'100%'}
        bg-$backgroundDefault
        marginV-8
        marginH-16
        marginB-90
      >
        <View>
          <TextField
            placeholder={'Search order number, email, or name'}
            value={searchValue}
            ref={searchValueRef}
            onChangeText={(txt) => handleChange(txt)}
            marginV-8
            style={{
              fontSize: 16,
              height: 50,
              width: '100%',
              borderWidth: 0.5,
              borderColor: '#D3D3D3',
              borderRadius: 4,
              padding: 8,
            }}
          />
        </View>
        <ScrollView keyboardDismissMode="on-drag">
          {guests.map((guest, index: any) => {
            let buttonText = 'Check In';

            if (guest.status === TicketStatus.NOT_AVAILABLE) {
              buttonText = 'Activate Ticket';
            }

            return (
              <View key={index}>
                <View marginT-16 row>
                  <View flex>
                    <View>
                      <Text>
                        Order ID: {String(guest.orderId).toUpperCase()}
                      </Text>
                      <Text>Ticket ID: {String(guest.id).toUpperCase()}</Text>
                      <Text
                        style={{
                          textDecorationLine:
                            guest.status === TicketStatus.NOT_AVAILABLE
                              ? 'line-through'
                              : 'none',
                        }}
                      >
                        {guest.firstName} {guest.lastName}
                      </Text>
                      <Text
                        style={{
                          textDecorationLine:
                            guest.status === TicketStatus.NOT_AVAILABLE
                              ? 'line-through'
                              : 'none',
                        }}
                      >
                        {guest.email}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{ justifyContent: 'center', alignItems: 'center' }}
                    marginL-8
                  >
                    <Button
                      onPress={() => checkIn(guest, index)}
                      label={buttonText}
                      labelStyle={{ fontSize: 14 }}
                      outline
                      borderRadius={10}
                    />
                  </View>
                </View>
                <View
                  marginT-16
                  style={{ height: 1 }}
                  backgroundColor={Colors.grey60}
                />
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}
