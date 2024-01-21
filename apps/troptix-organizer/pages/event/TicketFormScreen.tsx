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
  Picker,
} from 'react-native-ui-lib';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatPrice } from '../../shared/TroptixHelper';
import { TicketType, TicketFeeStructure } from 'troptix-models';
import { format } from 'date-fns';
import CustomTextField from '../../components/CustomTextField';
import CustomDateTimeField from '../../components/CustomDateTimeField';
import { TropTixResponse, saveTicketType } from 'troptix-api';

export default function TicketFormScreen({ route, navigation }) {
  const { ticketObject, isEditTicket, addTicket, editTicket, ticketIndex } =
    route.params;
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [ticket, setTicket] = useState<TicketType>(ticketObject);
  const [ticketPrice, setTicketPrice] = useState(
    formatPrice(ticket.price ? ticket.price : 0)
  );
  const title = ticketObject.name ? ticketObject.name : 'Add Ticket';
  const ticketNameRef = useRef();
  const ticketDescriptionRef = useRef();
  const ticketStartDateRef = useRef();
  const ticketStartTimeRef = useRef();
  const ticketEndDateRef = useRef();
  const ticketEndTimeRef = useRef();
  const ticketPriceRef = useRef();
  const ticketFeeStructureRef = useRef();
  const ticketQuantityRef = useRef();
  const ticketMaxPurchaseRef = useRef();
  const ticketFeeRef = useRef();
  const feeOptions = [
    {
      label: 'Absorb Ticket Fees',
      value: TicketFeeStructure.ABSORB_TICKET_FEES,
    },
    { label: 'Pass Ticket Fees', value: TicketFeeStructure.PASS_TICKET_FEES },
  ];
  const [fee, setFee] = useState<TicketFeeStructure>(
    TicketFeeStructure.ABSORB_TICKET_FEES
  );

  useEffect(() => {
    navigation.setOptions({
      title: title,
    });
  });

  function setTextFieldFocused(ref) {
    if (ref === undefined || ref.current === undefined) return;

    ref.current.focus();
  }

  function handleChange(name, value) {
    setTicket((previousTicket) => ({ ...previousTicket, [name]: value }));
  }

  function handlePriceChange(name, value) {
    setTicketPrice(formatPrice(value));
    setTicket((previousTicket) => ({
      ...previousTicket,
      [name]: Number(value),
    }));
  }

  function handlePickerChange(value) {
    setTicket((previousTicket) => ({
      ...previousTicket,
      ['ticketingFees']: value,
    }));
  }

  function getDateFormatter(): DateTimePickerProps['dateTimeFormatter'] {
    return (value: Date, mode: DateTimePickerMode) =>
      format(value, mode === 'date' ? 'MMM dd, yyyy' : 'hh:mm a');
  }

  function fetchPicker(
    textLabel,
    placeholder,
    textFieldValue,
    textFieldReference
  ) {
    return (
      <Pressable
        onPress={() => setTextFieldFocused(textFieldReference)}
        style={{ flex: 1, alignItems: 'center', backgroundColor: 'white' }}
      >
        <View
          marginT-16
          paddingT-6
          paddingL-8
          style={{
            height: 60,
            width: '100%',
            borderWidth: 0.5,
            borderColor: '#D3D3D3',
          }}
        >
          <Picker
            label={textLabel}
            placeholder={placeholder}
            migrate
            useSafeArea
            labelStyle={{
              marginBottom: 4,
            }}
            topBarProps={{
              doneLabel: 'Save',
            }}
            value={ticket.ticketingFees}
            onChange={(value) => handlePickerChange(value)}
            mode={Picker.modes.SINGLE}
          >
            {_.map(feeOptions, (option) => (
              <Picker.Item
                key={option.value}
                value={option.value}
                label={option.label}
                disabled={option.disabled}
              />
            ))}
          </Picker>
        </View>
      </Pressable>
    );
  }

  function fetchTextField(
    name,
    keyboardType,
    textLabel,
    placeholder,
    textFieldValue,
    textFieldReference
  ) {
    return (
      <Pressable
        onPress={() => setTextFieldFocused(textFieldReference)}
        style={{ flex: 1, alignItems: 'center', backgroundColor: 'white' }}
      >
        <View
          marginT-16
          paddingT-6
          paddingL-8
          style={{
            height: 60,
            width: '100%',
            borderWidth: 0.5,
            borderColor: '#D3D3D3',
          }}
        >
          <TextField
            label={textLabel}
            placeholder={placeholder}
            value={textFieldValue}
            ref={textFieldReference}
            labelColor={Colors.black}
            keyboardType={keyboardType}
            labelStyle={{
              marginBottom: 4,
            }}
            enableErrors
            style={{ fontSize: 16 }}
            onChangeText={(txt) =>
              handleChange(name, keyboardType === 'numeric' ? Number(txt) : txt)
            }
          />
        </View>
      </Pressable>
    );
  }

  function getDatePlaceholder(date, time) {
    if (time) {
      return date == undefined
        ? new Date().toLocaleTimeString()
        : new Date(date).toLocaleTimeString();
    } else {
      return date == undefined
        ? new Date().toDateString()
        : new Date(date).toDateString();
    }
  }

  function checkInputNullOrUndefined(input): boolean {
    return input === null || input === undefined || input === '';
  }

  function validateTicketInputs(): string {
    if (
      checkInputNullOrUndefined(ticket.name) ||
      checkInputNullOrUndefined(ticket.description) ||
      checkInputNullOrUndefined(ticket.price) ||
      checkInputNullOrUndefined(ticket.quantity) ||
      checkInputNullOrUndefined(ticket.maxPurchasePerUser)
    ) {
      return 'Please populate all required fields.';
    }

    const startDate = new Date(ticket.saleStartDate);
    const endDate = new Date(ticket.saleEndDate);
    const startTime = new Date(ticket.saleEndTime);
    const endTime = new Date(ticket.saleEndTime);

    console.log(startDate + ' ' + startDate.getTime());
    console.log(endDate + ' ' + endDate.getTime());
    if (startDate.getTime() > endDate.getTime()) {
      return 'Event start date is after end date.';
    }

    if (startDate === endDate && startTime.getTime() > endTime.getTime()) {
      return 'Event start time is after end time.';
    }

    if (startDate === endDate && startTime.getTime() === endTime.getTime()) {
      return 'Event start time is after end time.';
    }

    return 'dfv';
  }

  async function saveTicket() {
    const errorMessage = validateTicketInputs();
    if (errorMessage !== '') {
      Alert.alert('Error saving ticket', errorMessage);
      return;
    }
    // try {
    //   const response = await saveTicketType(ticket, isEditTicket);

    //   if (response.error !== null) {
    //     console.log("TicketFormScreen [saveTicket] response error: " + JSON.stringify(response.error));
    //     return;
    //   }
    // } catch (error) {
    //   console.log("TicketFormScreen [saveTicket] error: " + error);
    //   return;
    // }

    if (isEditTicket) {
      editTicket(ticketIndex, ticket);
    } else {
      addTicket(ticket);
    }
    navigation.goBack();
  }

  return (
    <View style={{ height: '100%', backgroundColor: Colors.white }}>
      <View
        paddingR-16
        paddingL-16
        style={{ flex: 1, backgroundColor: 'white' }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView automaticallyAdjustKeyboardInsets>
            <View>
              <Text
                style={{ fontSize: 24, fontWeight: 'bold' }}
                marginT-16
                marginB-8
                $textDefault
              >
                Ticket Details
              </Text>
              <View>
                <CustomTextField
                  name="name"
                  label="Ticket Name *"
                  placeholder="General Admission"
                  value={ticket.name}
                  reference={ticketNameRef}
                  handleChange={handleChange}
                />
              </View>
              <View>
                <CustomTextField
                  name="description"
                  label="Ticket Description *"
                  placeholder="Describe what patrons get with this ticket"
                  value={ticket.description}
                  reference={ticketDescriptionRef}
                  handleChange={handleChange}
                  isTextArea={true}
                  textAreaSize={150}
                />
              </View>
            </View>

            <View>
              <Text
                style={{ fontSize: 24, fontWeight: 'bold' }}
                marginT-16
                marginB-8
                $textDefault
              >
                Sale Date & Time
              </Text>
              <View row>
                <View marginR-8 flex>
                  <CustomDateTimeField
                    name="saleStartDate"
                    label="Sales start date *"
                    placeholder={getDatePlaceholder(
                      ticket.saleStartDate,
                      false
                    )}
                    value={ticket.saleStartDate}
                    reference={ticketStartDateRef}
                    dateMode={'date'}
                    handleChange={handleChange}
                  />
                </View>
                <View marginL-8 flex>
                  <CustomDateTimeField
                    name="saleStartTime"
                    label="Start time *"
                    placeholder={getDatePlaceholder(
                      ticket.saleStartTime,
                      false
                    )}
                    value={ticket.saleStartTime}
                    reference={ticketStartTimeRef}
                    dateMode={'time'}
                    handleChange={handleChange}
                  />
                </View>
              </View>
              <View row>
                <View marginR-8 flex>
                  <CustomDateTimeField
                    name="saleEndDate"
                    label="Sales end date *"
                    placeholder={getDatePlaceholder(
                      ticket.saleStartDate,
                      false
                    )}
                    value={ticket.saleEndDate}
                    reference={ticketEndDateRef}
                    dateMode={'date'}
                    handleChange={handleChange}
                  />
                </View>
                <View marginL-8 flex>
                  <CustomDateTimeField
                    name="saleEndTime"
                    label="End time *"
                    placeholder={getDatePlaceholder(ticket.saleEndTime, false)}
                    value={ticket.saleEndTime}
                    reference={ticketEndTimeRef}
                    dateMode={'time'}
                    handleChange={handleChange}
                  />
                </View>
              </View>
            </View>

            <View>
              <Text
                style={{ fontSize: 24, fontWeight: 'bold' }}
                marginT-16
                marginB-8
                $textDefault
              >
                Price Details
              </Text>
              <View row>
                <View marginR-8 flex>
                  {fetchTextField(
                    'price',
                    'numeric',
                    'Ticket Price ($) *',
                    '$130.00',
                    ticket.price ? String(ticket.price) : undefined,
                    ticketPriceRef
                  )}
                </View>
                <View marginL-8 flex>
                  {fetchPicker(
                    'Fee Structure *',
                    'Very Cool Location',
                    'ticket.price',
                    ticketFeeRef
                  )}
                </View>
              </View>
              <View row>
                <View marginR-8 flex>
                  {fetchTextField(
                    'quantity',
                    'numeric',
                    'Ticket Quantity *',
                    '100',
                    ticket.quantity ? String(ticket.quantity) : undefined,
                    ticketQuantityRef
                  )}
                </View>
                <View marginL-8 flex>
                  {fetchTextField(
                    'maxPurchasePerUser',
                    'numeric',
                    'Max Purchase Per User *',
                    '10',
                    ticket.maxPurchasePerUser
                      ? String(ticket.maxPurchasePerUser)
                      : undefined,
                    ticketMaxPurchaseRef
                  )}
                </View>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </View>
      <View
        backgroundColor="transparent"
        marginB-24
        style={{
          borderTopColor: '#D3D3D3',
          borderTopWidth: 1,
          height: 70,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Button
          onPress={() => saveTicket()}
          style={{ width: '70%', height: '70%' }}
          label={isEditTicket ? 'Save Ticket' : 'Add Ticket'}
          labelStyle={{ fontSize: 18 }}
        />
      </View>
    </View>
  );
}
