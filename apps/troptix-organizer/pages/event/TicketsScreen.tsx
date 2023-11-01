import _ from "lodash";
import { useRef, useState } from "react";
import {
  Text,
  View,
  TextField,
  Colors,
  DateTimePicker,
  DateTimePickerProps,
  DateTimePickerMode,
  Switch,
  Icon,
  Image,
  Button,
  FloatingButton,
  FloatingButtonLayouts,
} from "react-native-ui-lib";
import {
  Alert,
  Keyboard,
  Pressable,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Event } from "troptix-models";
import * as LightDate from 'light-date';
import { TicketType } from "troptix-models";
import { format } from 'date-fns';
import uuid from 'react-native-uuid';
import { TropTixResponse, getEvents, saveEvent, } from 'troptix-api';
import * as ImagePicker from 'expo-image-picker';

export default function TicketsScreen({ event, setEvent, navigation }) {
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const eventNameRef = useRef();
  const eventDescriptionRef = useRef();
  const eventLocationRef = useRef();
  const eventDateRef = useRef();
  const eventDatePickerRef = useRef();
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  function showDateTime(ref) {
    if (ref === undefined || ref.current === undefined)
      return;

    setShow(true);
    ref.current.focus();
  }

  function setTextFieldFocused(ref) {
    if (ref === undefined || ref.current === undefined)
      return;

    ref.current.focus();
  }

  function onTicketClick(ticket, isEditTicket, index = 0) {
    navigation.navigate("TicketFormScreen", {
      ticketObject: ticket,
      isEditTicket: isEditTicket,
      ticketIndex: index,
      addTicket: addTicket,
      editTicket: editTicket,
    });
  }

  function handleChange(name, value) {
    setEvent(previousEvent => ({ ...previousEvent, [name]: value }))
  }

  function getDateFormatter(): DateTimePickerProps['dateTimeFormatter'] {
    return (value: Date, mode: DateTimePickerMode) =>
      format(value, mode === 'date' ? 'MMM dd, yyyy' : 'hh:mm a');
  };

  function addTicket(ticket: TicketType) {
    let tempTickets = event.ticketTypes;
    tempTickets.push(ticket);
    setEvent(previousEvent => ({ ...previousEvent, ["ticketTypes"]: tempTickets }))
  }

  function editTicket(index, ticket: TicketType) {
    let tempTickets = event.ticketTypes;
    tempTickets[index] = ticket;
    setEvent(previousEvent => ({ ...previousEvent, ["ticketTypes"]: tempTickets }))
  }

  function deleteTicket(index) {
    Alert.alert('Delete Ticket', 'Are you sure you want to delete this ticket?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Delete', onPress: () => {
          let tempTickets = event.ticketTypes;
          tempTickets.splice(index, 1);
          setEvent(previousEvent => ({ ...previousEvent, ["tickets"]: tempTickets }));
        }
      },
    ]);
  }

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  function getFormattedCurrency(price) {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });

    return formatter.format(price);
  }

  function getDatePlaceholder(date, time) {
    if (time) {
      return date == undefined
        ? new Date().toLocaleTimeString()
        : new Date(event.startDate).toLocaleTimeString();
    } else {
      return date == undefined
        ? new Date().toDateString()
        : new Date(event.startTime).toDateString();
    }
  }

  function renderTickets() {
    return _.map(event.ticketTypes, (ticket, i) => {
      return (
        <View key={i} row>
          <View flex>
            <Pressable onPress={() => onTicketClick(ticket, true, i)}>
              <View
                marginB-16
                style={{
                  width: "100%",
                  borderWidth: 1,
                  borderRadius: 10,
                  borderColor: "#D3D3D3",
                }}
              >
                <View
                  row
                  margin-12
                  style={{ height: 50, alignItems: "center" }}
                >
                  <Text>{ticket.name}</Text>
                  <View style={{ flex: 1, alignItems: "flex-end" }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      <Text>{ticket.quantity} available</Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: "#D3D3D3",
                  }}
                />
                <View margin-12>
                  <Text>{getFormattedCurrency(ticket.price)}</Text>
                  <Text>
                    + {getFormattedCurrency(ticket.price * 0.1)}{" "}
                    fees
                  </Text>
                  <Text marginT-8>{ticket.description}</Text>
                </View>
              </View>
            </Pressable>
          </View>

          <View style={{ justifyContent: 'center', alignItems: 'center' }} marginL-8>
            <Pressable onPress={() => deleteTicket(i)}>
              <Image source={require('../../assets/icons/delete.png')} tintColor={Colors.black} width={24} height={24} />
            </Pressable>
          </View>
        </View>
      );
    });
  }

  return (
    <View style={{ height: "100%", flex: 1, backgroundColor: "white" }}>
      <View
        paddingR-16
        paddingL-16
        style={{ flex: 1, backgroundColor: "white" }}
      >
        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss}
          accessible={false}
        >
          <View>
            <View style={{ height: "100%" }}>
              <ScrollView>
                <View>
                  <Text
                    style={{ fontSize: 24, fontWeight: "bold" }}
                    marginT-16
                    marginB-8
                    $textDefault
                  >
                    Ticket Details
                  </Text>
                  <View marginT-16>{renderTickets()}</View>
                </View>
              </ScrollView>
            </View>
            <View>
              <FloatingButton
                visible={true}
                button={{
                  label: 'Add Ticket',
                  onPress: () => onTicketClick(new TicketType(event.id), false, 0)
                }}
                buttonLayout={FloatingButtonLayouts.HORIZONTAL}
                bottomMargin={16}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}
