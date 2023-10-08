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
import tickets from "../data/tickets";
import { Event } from "troptix-models";
import * as LightDate from 'light-date';
import { TicketType } from "troptix-models";
import { format } from 'date-fns';
import uuid from 'react-native-uuid';
import { TropTixResponse, getEvents, saveEvent, } from 'troptix-api';
import * as ImagePicker from 'expo-image-picker';
import CustomTextField from "./CustomTextField";

export default function EventForm({ eventObject, editEvent, navigation }) {
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [event, setEvent] = useState<Event>(eventObject);
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

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  function showDateTime(ref) {
    setShow(true);
    ref.current.focus();
  }

  function setTextFieldFocused(ref) {
    ref.current.focus();
  }

  function onTicketClick(ticket, isEditTicket, index) {
    navigation.navigate("TicketFormScreen", {
      ticketObject: ticket,
      isEditTicket: isEditTicket,
      ticketIndex: index,
      addTicket: addTicket,
      editTicket: editTicket,
    });
  }

  function handleChange(name, value) {
    setEvent(previousEvent => ({ ...previousEvent, [name]: value }));
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

  function fetchTextField(
    name,
    textLabel,
    placeholder,
    textFieldValue,
    textFieldReference
  ) {
    return (
      <Pressable
        onPress={() => setTextFieldFocused(textFieldReference)}
        style={{
          flex: 1,
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <View
          marginT-16
          paddingT-6
          paddingL-8
          style={{
            height: 60,
            width: "100%",
            borderWidth: 0.5,
            borderColor: "#D3D3D3",
          }}
        >
          <TextField
            label={textLabel}
            placeholder={placeholder}
            value={textFieldValue}
            ref={textFieldReference}
            labelColor={Colors.black}
            labelStyle={{
              marginBottom: 4,
            }}
            enableErrors
            style={{ fontSize: 16 }}
            onChangeText={(txt) => handleChange(name, txt)}
          />
        </View>
      </Pressable>
    );
  }

  function fetchTextArea(
    name,
    textLabel,
    placeholder,
    textFieldValue,
    textFieldReference
  ) {
    return (
      <Pressable
        onPress={() => setTextFieldFocused(textFieldReference)}
        style={{
          flex: 1,
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <View
          marginT-16
          paddingT-6
          paddingL-8
          style={{
            height: 150,
            width: "100%",
            borderWidth: 0.5,
            borderColor: "#D3D3D3",
          }}
        >
          <TextField
            label={textLabel}
            placeholder={placeholder}
            multiline={true}
            scrollEnabled={true}
            value={textFieldValue}
            ref={textFieldReference}
            labelColor={Colors.black}
            labelStyle={{
              marginBottom: 4,
            }}
            enableErrors
            style={{ fontSize: 16 }}
            onChangeText={(txt) => handleChange(name, txt)}
          />
        </View>
      </Pressable>
    );
  }

  function fetchDateTimeField(
    name,
    textLabel,
    textFieldDate,
    textFieldPlaceholder,
    textFieldReference,
    mode
  ) {
    var value = new Date(textFieldDate);
    return (
      <Pressable
        onPress={() => showDateTime(textFieldReference)}
        style={{
          flex: 1,
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <View
          marginT-16
          paddingT-6
          paddingL-8
          style={{
            height: 60,
            width: "100%",
            borderWidth: 0.5,
            borderColor: "#D3D3D3",
          }}
        >
          <DateTimePicker
            migrateTextField
            label={textLabel}
            placeholder={textFieldPlaceholder}
            onChange={(date) => handleChange(name, date)}
            ref={textFieldReference}
            labelStyle={{
              marginBottom: 4,
            }}
            mode={mode}
            dateTimeFormatter={getDateFormatter()}
            value={
              textFieldDate == undefined
                ? textFieldDate
                : new Date(textFieldDate)
            }
          />
        </View>
      </Pressable>
    );
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

  async function updateEvent() {
    // setEvent(previousEvent => ({
    //   ...previousEvent,
    //   ["organizer"]: "Sunnation Jamaica",
    //   ["country"]: "Jamaica",
    //   ["imageUrl"]: "https://assets.fete.land/vibes/styles/full/s3/event/image/202303/fetelist-sunrise-breakfast-party-jamaica-carnival-2023.jpg"
    // }))

    // if (!editEvent && event.ticketTypes.length !== 0) {
    //   let tempTickets = event.ticketTypes;
    //   for (let i = 0; i < tempTickets.length; i++) {
    //     delete tempTickets[i].eventId;
    //   }
    //   setEvent(previousEvent => ({ ...previousEvent, ["ticketTypes"]: tempTickets }))
    // }

    try {
      const response: TropTixResponse = await saveEvent(event, editEvent);
      console.log("[updateEvent] ", response);
    } catch (error) {
      console.log("[updateEvent] Events Error: " + error)
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
              <Image source={require('../assets/icons/delete.png')} tintColor={Colors.black} width={24} height={24} />
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
          <ScrollView>
            <View>
              <Text
                style={{ fontSize: 24, fontWeight: "bold" }}
                marginT-16
                marginB-8
                $textDefault
              >
                Event Flyer
              </Text>
              <View>
                <Button onPress={() => pickImage()}>
                  <Text>Add Flyer</Text>
                </Button>
              </View>
              <Image
                marginT-8
                marginB-8
                style={{ alignSelf: 'center' }}
                source={{
                  uri: image
                }}
                width={300}
                height={300}
              />
            </View>

            <View>
              <Text
                style={{ fontSize: 24, fontWeight: "bold" }}
                marginT-16
                marginB-8
                $textDefault
              >
                Event Details
              </Text>
              <View>
                <CustomTextField
                  name="name"
                  label="Event Title"
                  placeholder="TropTix Beach Party"
                  value={event.name}
                  reference={eventNameRef}
                  handleChange={handleChange}
                />
              </View>
              <View>
                {fetchTextArea(
                  "description",
                  "Event Description",
                  "Very Cool Description",
                  event.description,
                  eventDescriptionRef
                )}
              </View>
              <View>
                {fetchTextField(
                  "address",
                  "Event Location",
                  "Very Cool Location",
                  event.address,
                  eventLocationRef
                )}
              </View>
            </View>

            <View>
              <Text
                style={{ fontSize: 24, fontWeight: "bold" }}
                marginT-16
                marginB-8
                $textDefault
              >
                Date & Time
              </Text>
              <View row>
                <View marginR-8 flex>
                  {fetchDateTimeField(
                    "startDate",
                    "Start Date",
                    event.startDate,
                    getDatePlaceholder(
                      event.startDate,
                      false
                    ),
                    eventDateRef,
                    "date"
                  )}
                </View>
                <View marginL-8 flex>
                  {fetchDateTimeField(
                    "startTime",
                    "Start Time",
                    event.startTime,
                    getDatePlaceholder(
                      event.startTime,
                      true
                    ),
                    eventDateRef,
                    "time"
                  )}
                </View>
              </View>
              <View row>
                <View marginR-8 flex>
                  {fetchDateTimeField(
                    "endDate",
                    "End Date",
                    event.endDate,
                    getDatePlaceholder(
                      event.endDate,
                      false
                    ),
                    eventDateRef,
                    "date"
                  )}
                </View>
                <View marginL-8 flex>
                  {fetchDateTimeField(
                    "endTime",
                    "End Time",
                    event.endTime,
                    getDatePlaceholder(event.endTime, true),
                    eventDateRef,
                    "time"
                  )}
                </View>
              </View>
            </View>

            <View>
              <Text
                style={{ fontSize: 24, fontWeight: "bold" }}
                marginT-16
                marginB-8
                $textDefault
              >
                Ticket Details
              </Text>
              <Button
                onPress={() => onTicketClick(new TicketType(event), false, 0)}
                marginT-16
                outline
                borderRadius={25}
                outlineColor={Colors.grey30}
                style={{ height: 40, width: 150 }}
              >
                <Image
                  source={require("../assets/icons/add.png")}
                  width={24}
                  height={24}
                />
                <Text style={{ fontSize: 16 }} marginL-10>
                  Add Ticket
                </Text>
              </Button>
              <View marginT-16>{renderTickets()}</View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </View>

      {editEvent ? (
        <View
          backgroundColor="transparent"
          marginB-24
          style={{
            borderTopColor: "#D3D3D3",
            borderTopWidth: 1,
            height: 70,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            onPress={() => updateEvent()}
            style={{ width: "70%", height: "70%" }}
            label={"Save Event"}
            labelStyle={{ fontSize: 18 }}
          />
        </View>
      ) : (
        <View
          backgroundColor="transparent"
          style={{
            borderTopColor: "#D3D3D3",
            borderTopWidth: 1,
            height: 70,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            onPress={() => updateEvent()}
            style={{ width: "70%", height: "70%" }}
            label={"Add Event"}
            labelStyle={{ fontSize: 18 }}
          />
        </View>
      )}
    </View>
  );
}
