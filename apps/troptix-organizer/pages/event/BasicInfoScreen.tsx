import _ from "lodash";
import { useRef, useState } from "react";
import {
  Text,
  View,
} from "react-native-ui-lib";
import {
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { Event } from "troptix-models";
import CustomTextField from "../../components/CustomTextField";
import CustomDateTimeField from "../../components/CustomDateTimeField";
import { GooglePlaceData, GooglePlaceDetail, GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import CustomLocationTextField from "../../components/CustomLocationTextField";

export default function BasicInfoForm({ event, setEvent, navigation }) {
  const eventNameRef = useRef();
  const eventOrganizerRef = useRef();
  const eventLocationRef = useRef();
  const eventDateRef = useRef();

  function setMapsResults(data: GooglePlaceData, details: GooglePlaceDetail) {
    let country = ""
    let countryCode = "";
    details.address_components.forEach(component => {
      if (component.types.includes("country")) {
        country = component.long_name;
        countryCode = component.short_name
      }
    })

    setEvent(previousEvent => ({
      ...previousEvent,
      ["address"]: details.formatted_address,
      ["venue"]: details.name,
      ["country"]: country,
      ["country_code"]: countryCode,
      ["latitude"]: details.geometry.location.lat,
      ["longitude"]: details.geometry.location.lng
    }))
  }

  function handleChange(name, value) {
    setEvent(previousEvent => ({ ...previousEvent, [name]: value }))
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
                <CustomTextField
                  name="organizer"
                  label="Event Organizer"
                  placeholder="TropTix"
                  value={event.organizer}
                  reference={eventOrganizerRef}
                  handleChange={handleChange}
                />
              </View>
              <View>
                <CustomLocationTextField
                  label="Event Location"
                  placeholder="Kingston, Jamaica"
                  value={event.address}
                  reference={eventLocationRef}
                  setMapsResults={setMapsResults}
                  navigation={navigation}
                />
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
                  <CustomDateTimeField
                    name="startDate"
                    label="Start Date"
                    placeholder={
                      getDatePlaceholder(
                        event.startDate,
                        false
                      )}
                    value={event.startDate}
                    reference={eventDateRef}
                    dateMode={"date"}
                    handleChange={handleChange}
                  />
                </View>
                <View marginL-8 flex>
                  <CustomDateTimeField
                    name="startTime"
                    label="Start Time"
                    placeholder={
                      getDatePlaceholder(
                        event.startTime,
                        true
                      )}
                    value={event.startTime}
                    reference={eventDateRef}
                    dateMode={"time"}
                    handleChange={handleChange}
                  />
                </View>
              </View>
              <View row>
                <View marginR-8 flex>
                  <CustomDateTimeField
                    name="endDate"
                    label="Start Date"
                    placeholder={
                      getDatePlaceholder(
                        event.endDate,
                        false
                      )}
                    value={event.endDate}
                    reference={eventDateRef}
                    dateMode={"date"}
                    handleChange={handleChange}
                  />
                </View>
                <View marginL-8 flex>
                  <CustomDateTimeField
                    name="endTime"
                    label="End Time"
                    placeholder={
                      getDatePlaceholder(
                        event.startTime,
                        true
                      )}
                    value={event.endTime}
                    reference={eventDateRef}
                    dateMode={"time"}
                    handleChange={handleChange}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}
