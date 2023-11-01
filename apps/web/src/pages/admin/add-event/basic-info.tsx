import { CustomDateField, CustomInput, CustomTimeField } from "@/components/ui/input";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import Autocomplete from "react-google-autocomplete";
import { DatePicker, DatePickerProps, Drawer } from "antd";

export default function BasicInfoPage({ event, setEvent }) {
  const placesLibrary = ['places']
  const [searchResult, setSearchResult] = useState(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    console.log(e);
    // console.log(e.target.name);
    // console.log(e.target.value);
    setEvent(previousEvent => ({
      ...previousEvent,
      [e.target.name]: e.target.value,
    }))
  }

  function updateDate(name, value) {
    setEvent(previousEvent => ({
      ...previousEvent,
      [name]: value.toDate(),
    }))
  }

  async function signIn() {
    console.log("signing in");
  }

  function onLoad(autocomplete) {
    setSearchResult(autocomplete);
  }

  function onPlaceChanged(place) {
    if (searchResult !== null) {
      // console.log(searchResult.getPlace())
    } else {
      console.log('Autocomplete is not loaded yet!')
    }

    if (searchResult != null) {
      const place = searchResult.getPlace();
      const name = place.name;
      const status = place.business_status;
      const formattedAddress = place.formatted_address;
      console.log(`Name: ${name}`);
      console.log(`Business Status: ${status}`);
      console.log(`Formatted Address: ${formattedAddress}`);

      let country = ""
      let countryCode = "";
      place.address_components.forEach(component => {
        if (component.types.includes("country")) {
          country = component.long_name;
          countryCode = component.short_name
        }
      })

      setEvent(previousEvent => ({
        ...previousEvent,
        ["address"]: place.formatted_address,
        ["venue"]: place.name,
        ["country"]: country,
        ["country_code"]: countryCode,
        ["latitude"]: place.geometry.location.lat,
        ["longitude"]: place.geometry.location.lng
      }))
    } else {
      // alert("Please enter text");
    }
  }

  return (
    <div className="w-full md:max-w-md mr-8">
      <form className="">
        <h2 className="text-2xl md:text-3xl font-extrabold leading-tighter tracking-tighter mb-4" data-aos="zoom-y-out">Event Details</h2>

        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-full px-3">
            <CustomInput value={event.name} name={"name"} id={"name"} label={"Event Title"} type={"text"} placeholder={"TropTix Beach Party"} handleChange={handleChange} required={true} />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-full px-3">
            <CustomInput value={event.organizer} name={"organizer"} id={"organizer"} label={"Event Organizer"} type={"text"} placeholder={"TropTix"} handleChange={handleChange} required={true} />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-full px-3">
            <CustomInput value={event.venue} name={"venue"} id={"venue"} label={"Event Venue *"} type={"text"} placeholder={"Brooklyn Museum"} handleChange={handleChange} required={true} />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-full px-3">
            <label className="block text-gray-800 text-sm font-medium mb-1" htmlFor={"location"}>Event Location</label>
            <Autocomplete
              className="form-input w-full text-gray-800"
              placeholder="Brooklyn Museum"
              defaultValue={event.address}
              apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
              onPlaceSelected={(place) => {
                console.log(place);
              }}
              options={{
                types: [],
              }}
            />
          </div>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold leading-tighter tracking-tighter mb-4" data-aos="zoom-y-out">Date & Time</h2>
        <div className="md:flex md:justify-between">
          <div className="mb-4 md:mr-4 w-full">
            <CustomDateField value={event.startDate} name={"startDate"} id={"startDate"} label={"Start Date"} placeholder={"Start Date"} handleChange={(value) => updateDate("startDate", value)} required={true} />
          </div>
          <div className="mb-4 md:ml-4 w-full">
            <CustomTimeField value={event.startTime} name={"startTime"} id={"startTime"} label={"Start Time"} placeholder={"Start Time"} handleChange={(value) => updateDate("startTime", value)} required={true} />
          </div>
        </div>
        <div className="md:flex md:justify-between">
          <div className="mb-4 md:mr-4 w-full">
            <CustomDateField value={event.endDate} name={"endDate"} id={"endDate"} label={"End Date"} placeholder={"End Date"} handleChange={(value) => updateDate("endDate", value)} required={true} />
          </div>
          <div className="mb-4 md:ml-4 w-full">
            <CustomTimeField value={event.endTime} name={"endTime"} id={"endTime"} label={"End Time"} placeholder={"End Time"} handleChange={(value) => updateDate("endTime", value)} required={true} />
          </div>
        </div>
      </form>
    </div>
  );
}