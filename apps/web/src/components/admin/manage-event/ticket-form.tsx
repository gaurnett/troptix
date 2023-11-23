import { CustomDateField, CustomInput, CustomNumberInput, CustomTextArea, CustomTimeField } from "@/components/ui/input";
import { Button, Form, Select } from "antd";
import Link from "next/link";
import { useState } from "react";
import { TicketType, TicketFeeStructure } from 'troptix-models';
import { IoMdClose } from "react-icons/io";

export default function TicketForm({ selectedTicket, setSelectedTicket, saveTicket }) {

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSelectedTicket(previousTicket => ({
      ...previousTicket,
      [event.target.name]: event.target.value,
    }))
  }

  function handleNumberChange(name, value) {
    setSelectedTicket(previousTicket => ({
      ...previousTicket,
      [name]: value,
    }))
  }

  function handleSelectChange(value: string) {
    setSelectedTicket(previousTicket => ({
      ...previousTicket,
      ["ticketingFees"]: value,
    }))
  };

  return (
    <div className="md:max-w-md">
      <Form
        className=""
        name="basic"
        onFinish={saveTicket}>
        <h3 className="text-xl md:text-xl font-extrabold leading-tighter tracking-tighter mb-4" data-aos="zoom-y-out">Details</h3>
        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-screen px-3">
            <CustomInput value={selectedTicket.name} name={"name"} id={"name"} label={"Ticket Name"} type={"text"} placeholder={"General Admission"} handleChange={handleChange} required={true} />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-screen px-3">
            <CustomTextArea value={selectedTicket.description} name={"description"} id={"description"} label={"Ticket Description"} rows={5} placeholder={"Describe what patrons get with this ticket"} handleChange={handleChange} required={true} />
          </div>
        </div>
        <h2 className="text-xl md:text-xl font-extrabold leading-tighter tracking-tighter mb-4" data-aos="zoom-y-out">Sale Date & Time</h2>
        <div className="md:flex md:justify-between">
          <div className="mb-4 md:mr-4 w-full">
            <CustomDateField value={selectedTicket.saleStartDate} name={"saleStartDate"} id={"saleStartDate"} label={"Sale start date"} placeholder={"Start Date"} handleChange={handleChange} required={true} />
          </div>
          <div className="mb-4 md:ml-4 w-full">
            <CustomTimeField value={selectedTicket.saleStartTime} name={"saleStartTime"} id={"saleStartTime"} label={"Sale start time"} placeholder={"Start Time"} handleChange={handleChange} required={true} />
          </div>
        </div>
        <div className="md:flex md:justify-between">
          <div className="mb-4 md:mr-4 w-full">
            <CustomDateField value={selectedTicket.saleEndDate} name={"saleEndDate"} id={"saleEndDate"} label={"Sale end date"} placeholder={"End Date"} handleChange={handleChange} required={true} />
          </div>
          <div className="mb-4 md:ml-4 w-full">
            <CustomTimeField value={selectedTicket.saleEndTime} name={"saleEndTime"} id={"saleEndTime"} label={"Sale end time"} placeholder={"End Time"} handleChange={handleChange} required={true} />
          </div>
        </div>
        <h2 className="text-xl md:text-xl font-extrabold leading-tighter tracking-tighter mb-4" data-aos="zoom-y-out">Pricing & Availability</h2>
        <div className="md:flex md:justify-between">
          <div className="mb-4 md:mr-4 w-full">
            <CustomNumberInput value={selectedTicket.price} name={"price"} id={"ticket-input-price"} label={"Ticket Price"} placeholder={"$130.00"} useFormatter={true} handleChange={(value) => handleNumberChange("price", value)} required={true} />
          </div>
          <div className="mb-4 md:ml-4 w-full">
            <label className="block text-gray-800 text-sm font-medium mb-1" htmlFor={"ticketingFees"}>Fee Structure</label>
            <Select
              className="sm:w-screen w-full md:w-52 h-12 text-gray-800"
              id="ticketingFees"
              defaultValue={TicketFeeStructure.PASS_TICKET_FEES}
              onChange={handleSelectChange}
              value={selectedTicket.ticketingFees}
              options={[
                { label: 'Absorb Ticket Fees', value: TicketFeeStructure.ABSORB_TICKET_FEES },
                { label: 'Pass Ticket Fees', value: TicketFeeStructure.PASS_TICKET_FEES },
              ]}
            />
          </div>
        </div>
        <div className="md:flex md:justify-between">
          <div className="mb-4 md:mr-4 w-full">
            <CustomNumberInput value={selectedTicket.quantity} name={"quantity"} id={"ticket-input-quantity"} label={"Ticket Quantity"} placeholder={"100"} handleChange={(value) => handleNumberChange("quantity", value)} required={true} />
          </div>
          <div className="mb-4 md:ml-4 w-full">
            <CustomNumberInput value={selectedTicket.maxPurchasePerUser} name={"maxPurchasePerUser"} id={"ticket-input-maxPurchasePerUser"} label={"Max Purchase Per User"} placeholder={"10"} handleChange={(value) => handleNumberChange("maxPurchasePerUser", value)} required={true} />
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-4 mt-4">
          <div className="px-3">
            <Button className="px-6 py-5 shadow-md items-center justify-center font-medium inline-flex">Discard</Button>
          </div>
          <div className="px-3">
            <Button htmlType="submit" type="primary" className="px-6 py-5 shadow-md items-center bg-blue-600 hover:bg-blue-700 justify-center font-medium inline-flex">Save Ticket</Button>
          </div>
        </div>
      </Form>
    </div>
  );
}