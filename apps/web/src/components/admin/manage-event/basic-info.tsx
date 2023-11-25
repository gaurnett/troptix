import {
  CustomDateField,
  CustomInput,
  CustomTimeField,
} from "@/components/ui/input";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import Autocomplete from "react-google-autocomplete";
import { Button, DatePicker, DatePickerProps, Drawer, Form } from "antd";

export default function BasicInfoPage({ event, setEvent, updateEvent }) {
  const placesLibrary = ["places"];

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEvent((previousEvent) => ({
      ...previousEvent,
      [e.target.name]: e.target.value,
    }));
  }

  function updateDate(name, value) {
    setEvent((previousEvent) => ({
      ...previousEvent,
      [name]: value.toDate(),
    }));
  }

  function getValueOrDefault(value: any, defaultValue: any) {
    if (value === undefined || value === null) {
      return defaultValue;
    }

    return value;
  }

  function onPlaceChanged(place) {
    if (place === null || place === undefined) {
      return;
    }
    let country = "";
    let countryCode = "";
    let lat = 0;
    let lng = 0;
    if (place.address_components !== undefined) {
      place.address_components.forEach((component) => {
        if (component.types.includes("country")) {
          country = component.long_name;
          countryCode = component.short_name;
        }
      });
    }

    if (place.geometry?.location !== undefined) {
      lat = place.geometry.location.lat();
      lng = place.geometry.location.lng();
    }

    setEvent((previousEvent: any) => ({
      ...previousEvent,
      ["address"]: getValueOrDefault(place.formatted_address, ""),
      ["country"]: getValueOrDefault(country, ""),
      ["country_code"]: getValueOrDefault(countryCode, ""),
      ["latitude"]: getValueOrDefault(lat, 0),
      ["longitude"]: getValueOrDefault(lng, 0),
    }));
  }

  return (
    <div className="w-full md:max-w-md mr-8">
      <Form className="" name="basic" onFinish={() => updateEvent(event)}>
        <h2
          className="text-2xl md:text-3xl font-extrabold leading-tighter tracking-tighter mb-4"
          data-aos="zoom-y-out"
        >
          Event Details
        </h2>

        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-full px-3">
            <CustomInput
              value={event.name}
              name={"name"}
              id={"name"}
              label={"Event Title"}
              type={"text"}
              placeholder={"TropTix Beach Party"}
              handleChange={handleChange}
              required={true}
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-full px-3">
            <CustomInput
              value={event.organizer}
              name={"organizer"}
              id={"organizer"}
              label={"Event Organizer"}
              type={"text"}
              placeholder={"TropTix"}
              handleChange={handleChange}
              required={true}
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-full px-3">
            <CustomInput
              value={event.venue}
              name={"venue"}
              id={"venue"}
              label={"Event Venue *"}
              type={"text"}
              placeholder={"Brooklyn Museum"}
              handleChange={handleChange}
              required={true}
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-full px-3">
            <label
              className="block text-gray-800 text-sm font-medium mb-1"
              htmlFor={"location"}
            >
              Event Location
            </label>
            <Autocomplete
              className="form-input w-full text-gray-800"
              placeholder="Brooklyn Museum"
              defaultValue={event.address}
              apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
              onPlaceSelected={(place) => {
                onPlaceChanged(place);
              }}
              options={{
                types: [],
              }}
            />
          </div>
        </div>
        <h2
          className="text-2xl md:text-3xl font-extrabold leading-tighter tracking-tighter mb-4"
          data-aos="zoom-y-out"
        >
          Date & Time
        </h2>
        <div className="md:flex md:justify-between">
          <div className="mb-4 md:mr-4 w-full">
            <CustomDateField
              value={event.startDate}
              name={"startDate"}
              id={"startDate"}
              label={"Start Date"}
              placeholder={"Start Date"}
              handleChange={(value) => updateDate("startDate", value)}
              required={true}
            />
          </div>
          <div className="mb-4 md:ml-4 w-full">
            <CustomTimeField
              value={event.startTime}
              name={"startTime"}
              id={"startTime"}
              label={"Start Time"}
              placeholder={"Start Time"}
              handleChange={(value) => updateDate("startTime", value)}
              required={true}
            />
          </div>
        </div>
        <div className="md:flex md:justify-between">
          <div className="mb-4 md:mr-4 w-full">
            <CustomDateField
              value={event.endDate}
              name={"endDate"}
              id={"endDate"}
              label={"End Date"}
              placeholder={"End Date"}
              handleChange={(value) => updateDate("endDate", value)}
              required={true}
            />
          </div>
          <div className="mb-4 md:ml-4 w-full">
            <CustomTimeField
              value={event.endTime}
              name={"endTime"}
              id={"endTime"}
              label={"End Time"}
              placeholder={"End Time"}
              handleChange={(value) => updateDate("endTime", value)}
              required={true}
            />
          </div>
        </div>
        <div className="mt-4">
          <Button
            htmlType="submit"
            type="primary"
            className="px-6 py-5 shadow-md items-center bg-blue-600 hover:bg-blue-700 justify-center font-medium inline-flex"
          >
            Save Event Details
          </Button>
        </div>
      </Form>
    </div>
  );
}
