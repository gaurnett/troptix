import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import {
  Text,
  View,
  TextField,
  Colors,
  DateTimePicker,
  DateTimePickerProps,
  DateTimePickerMode,
  PickerProps,
  Incubator,
  PanningProvider,
  Switch,
  Icon,
  Image,
  Button,
  Picker
} from 'react-native-ui-lib';
import { Keyboard, KeyboardAvoidingView, Pressable, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tickets from '../data/tickets';
import { formatPrice } from '../shared/TroptixHelper';
import { Ticket, TicketFeeStructure } from 'troptix-models';
import { format } from 'date-fns'

export default function TicketFormScreen({ route, navigation }) {
  const { ticketObject, isEditTicket, addTicket, editTicket, ticketIndex } = route.params;
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [ticket, setTicket] = useState<Ticket>(ticketObject);
  const [ticketPrice, setTicketPrice] = useState(formatPrice(ticket.price ? ticket.price : 0));
  const title = ticketObject.name ? ticketObject.name : "Add Ticket";
  const ticketNameRef = useRef()
  const ticketDescriptionRef = useRef()
  const ticketStartDateRef = useRef()
  const ticketStartTimeRef = useRef()
  const ticketEndDateRef = useRef()
  const ticketEndTimeRef = useRef()
  const ticketPriceRef = useRef()
  const ticketFeeStructureRef = useRef()
  const ticketQuantityRef = useRef()
  const ticketMaxPurchaseRef = useRef()
  const ticketFeeRef = useRef()
  const feeOptions = [
    { label: 'Absorb Ticket Fees', value: TicketFeeStructure.ABSORB_TICKET_FEES },
    { label: 'Pass Ticket Fees', value: TicketFeeStructure.PASS_TICKET_FEES },
  ];
  const [fee, setFee] = useState<TicketFeeStructure>(TicketFeeStructure.ABSORB_TICKET_FEES);

  useEffect(() => {
    navigation.setOptions({
      title: title,
    });
  });

  function showDateTime(ref) {
    setShow(true);
    ref.current.focus();
  }

  function setTextFieldFocused(ref) {
    ref.current.focus();
  }

  function handleChange(name, value) {
    setTicket(previousTicket => ({ ...previousTicket, [name]: value }))
  }

  function handlePriceChange(name, value) {
    setTicketPrice(formatPrice(value));
    setTicket(previousTicket => ({ ...previousTicket, [name]: Number(value) }))
  }

  function handlePickerChange(value) {
    setTicket(previousTicket => ({ ...previousTicket, ['ticketingFees']: value }))
  }

  function getDateFormatter(): DateTimePickerProps['dateTimeFormatter'] {
    return (value: Date, mode: DateTimePickerMode) =>
      format(value, mode === 'date' ? 'MMM dd, yyyy' : 'hh:mm a');
  };

  function fetchPicker(textLabel, placeholder, textFieldValue, textFieldReference) {
    return (
      <Pressable onPress={() => setTextFieldFocused(textFieldReference)} style={{ flex: 1, alignItems: 'center', backgroundColor: 'white' }}>
        <View marginT-16 paddingT-6 paddingL-8 style={{ height: 60, width: '100%', borderWidth: 0.5, borderColor: '#D3D3D3' }}>
          <Picker
            label={textLabel}
            placeholder={placeholder}
            migrate
            useSafeArea
            labelStyle={{
              marginBottom: 4
            }}
            topBarProps={{
              doneLabel: 'Save',
            }}
            value={ticket.ticketingFees}
            onChange={value => handlePickerChange(value)}
            mode={Picker.modes.SINGLE}
          >
            {_.map(feeOptions, option => (
              <Picker.Item key={option.value} value={option.value} label={option.label} disabled={option.disabled} />
            ))}
          </Picker>
        </View>
      </Pressable>
    )
  }

  function fetchTextField(name, keyboardType, textLabel, placeholder, textFieldValue, textFieldReference) {
    return (
      <Pressable onPress={() => setTextFieldFocused(textFieldReference)} style={{ flex: 1, alignItems: 'center', backgroundColor: 'white' }}>
        <View marginT-16 paddingT-6 paddingL-8 style={{ height: 60, width: '100%', borderWidth: 0.5, borderColor: '#D3D3D3' }}>
          <TextField
            label={textLabel}
            placeholder={placeholder}
            value={textFieldValue}
            ref={textFieldReference}
            labelColor={Colors.black}
            keyboardType={keyboardType}
            labelStyle={{
              marginBottom: 4
            }}
            enableErrors
            style={{ fontSize: 16 }}
            onChangeText={(txt) => handleChange(name, keyboardType === 'numeric' ? Number(txt) : txt)}
          />
        </View>
      </Pressable>
    )
  }

  function fetchPriceField(name, textLabel, placeholder, textFieldValue, textFieldReference) {
    return (
      <Pressable onPress={() => setTextFieldFocused(textFieldReference)} style={{ flex: 1, alignItems: 'center', backgroundColor: 'white' }}>
        <View marginT-16 paddingT-6 paddingL-8 style={{ height: 60, width: '100%', borderWidth: 0.5, borderColor: '#D3D3D3' }}>
          <TextField
            label={textLabel}
            placeholder={placeholder}
            value={textFieldValue}
            ref={textFieldReference}
            labelColor={Colors.black}
            keyboardType='numeric'
            labelStyle={{
              marginBottom: 4
            }}
            enableErrors
            style={{ fontSize: 16 }}
            onChangeText={(txt) => handlePriceChange(name, txt)}
          />
        </View>
      </Pressable>
    )
  }

  function fetchTextArea(name, textLabel, placeholder, textFieldValue, textFieldReference) {
    return (
      <Pressable onPress={() => setTextFieldFocused(textFieldReference)} style={{ flex: 1, alignItems: 'center', backgroundColor: 'white' }}>
        <View marginT-16 paddingT-6 paddingL-8 style={{ height: 150, width: '100%', borderWidth: 0.5, borderColor: '#D3D3D3' }}>
          <TextField
            label={textLabel}
            placeholder={placeholder}
            multiline={true}
            scrollEnabled={true}
            value={textFieldValue}
            ref={textFieldReference}
            labelColor={Colors.black}
            labelStyle={{
              marginBottom: 4
            }}
            enableErrors
            style={{ fontSize: 16 }}
            onChangeText={(txt) => handleChange(name, txt)}
          />
        </View>
      </Pressable>
    )
  }

  function fetchDateTimeField(name, textLabel, textFieldDate, textFieldPlaceholder, textFieldReference, mode) {
    return (
      <Pressable onPress={() => showDateTime(textFieldReference)} style={{ flex: 1, alignItems: 'center', backgroundColor: 'white' }}>
        <View marginT-16 paddingT-6 paddingL-8 style={{ height: 60, width: '100%', borderWidth: 0.5, borderColor: '#D3D3D3' }}>
          <DateTimePicker
            migrateTextField
            label={textLabel}
            placeholder={textFieldPlaceholder}
            onChange={(date) => handleChange(name, date)}
            ref={textFieldReference}
            labelStyle={{
              marginBottom: 4
            }}
            mode={mode}
            dateTimeFormatter={getDateFormatter()}
            value={textFieldDate == undefined ? textFieldDate : new Date(textFieldDate)}
          />
        </View>
      </Pressable>
    )
  }

  const onChange = (ticket, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  function getFormattedCurrency(price) {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    return formatter.format(price)
  }

  function getDatePlaceholder(date, time) {
    if (time) {
      return date == undefined ? new Date().toLocaleTimeString() : new Date(date).toLocaleTimeString()
    } else {
      return date == undefined ? new Date().toDateString() : new Date(date).toDateString()
    }
  }

  function saveTicket() {
    if (isEditTicket) {
      editTicket(ticketIndex, ticket);
    } else {
      addTicket(ticket);
    }
    navigation.goBack();
  }

  return (
    <KeyboardAvoidingView behavior="padding" style={{ height: "100%", backgroundColor: Colors.white }}>
      <View paddingR-16 paddingL-16 style={{ flex: 1, backgroundColor: 'white' }}>
        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss}
          accessible={false}>
          <ScrollView>
            <View>
              <Text style={{ fontSize: 24, fontWeight: "bold" }} marginT-16 marginB-8 $textDefault>
                Ticket Details
              </Text>
              <View>
                {fetchTextField("name", "default", "Ticket Name", "Very Cool Ticket", ticket.name, ticketNameRef)}
              </View>
              <View>
                {fetchTextArea("description", "Ticket Description", "Very Cool Ticket Description", ticket.description, ticketDescriptionRef)}
              </View>
            </View>

            <View>
              <Text style={{ fontSize: 24, fontWeight: "bold" }} marginT-16 marginB-8 $textDefault>
                Sale Date & Time
              </Text>
              <View row>
                <View marginR-8 flex>
                  {fetchDateTimeField("saleStartDate", "Sale Start Date", ticket.saleStartDate, getDatePlaceholder(ticket.saleStartDate, false), ticketStartDateRef, 'date')}
                </View>
                <View marginL-8 flex>
                  {fetchDateTimeField("saleStartTime", "Sale Start Time", ticket.saleStartTime, getDatePlaceholder(ticket.saleStartTime, true), ticketStartTimeRef, 'time')}
                </View>
              </View>
              <View row>
                <View marginR-8 flex>
                  {fetchDateTimeField("saleEndDate", "Sale End Date", ticket.saleEndDate, getDatePlaceholder(ticket.saleEndDate, false), ticketEndDateRef, 'date')}
                </View>
                <View marginL-8 flex>
                  {fetchDateTimeField("saleEndTime", "Sale End Time", ticket.saleEndTime, getDatePlaceholder(ticket.saleEndTime, true), ticketEndTimeRef, 'time')}
                </View>
              </View>
            </View>

            <View>
              <Text style={{ fontSize: 24, fontWeight: "bold" }} marginT-16 marginB-8 $textDefault>
                Price Details
              </Text>
              <View row>
                <View marginR-8 flex>
                  {fetchTextField("price", "numeric", "Ticket Price ($)", "Very Cool Location", String(ticket.price ? ticket.price : 0), ticketPriceRef)}
                </View>
                <View marginL-8 flex>
                  {fetchPicker("Fee Structure", "Very Cool Location", "ticket.price", ticketFeeRef)}
                </View>
              </View>
              <View row>
                <View marginR-8 flex>
                  {fetchTextField("quantity", "numeric", "Ticket Quantity", "Very Cool Location", String(ticket.quantity ? ticket.quantity : 0), ticketQuantityRef)}
                </View>
                <View marginL-8 flex>
                  {fetchTextField("maxPurchasePerUser", "numeric", "Max Purchase Per User", "Very Cool Location", String(ticket.maxPurchasePerUser ? ticket.maxPurchasePerUser : 0), ticketMaxPurchaseRef)}
                </View>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </View>
      <View
        backgroundColor="transparent"
        marginB-24
        style={{ borderTopColor: '#D3D3D3', borderTopWidth: 1, height: 70, justifyContent: 'center', alignItems: 'center' }}>
        <Button
          onPress={() => saveTicket()}
          style={{ width: '70%', height: '70%' }}
          label={isEditTicket ? "Save Ticket" : "Add Ticket"}
          labelStyle={{ fontSize: 18 }} />
      </View>
    </KeyboardAvoidingView>
  );
}