import { CustomDateField, CustomInput, CustomNumberInput, CustomTextArea, CustomTimeField } from "@/components/ui/input";
import { Button, Select } from "antd";
import Link from "next/link";
import { useState } from "react";
import { DelegatedAccess } from 'troptix-models';
import { IoMdClose } from "react-icons/io";

export default function UserDelegationForm({ selectedUser, setSelectedUser, saveUser }) {

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSelectedUser(previousUser => ({
      ...previousUser,
      [event.target.name]: event.target.value,
    }))
  }

  function handleNumberChange(name, value) {
    setSelectedUser(previousUser => ({
      ...previousUser,
      [name]: value,
    }))
  }

  function handleSelectChange(value: string) {
    setSelectedUser(previousUser => ({
      ...previousUser,
      ["ticketingFees"]: value,
    }))
  };

  return (
    <div className="md:max-w-md">
      <form>
        <h3 className="text-xl md:text-xl font-extrabold leading-tighter tracking-tighter mb-4" data-aos="zoom-y-out">Promotion Details</h3>
        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-screen px-3">
            <CustomInput value={selectedUser.email} name={"email"} id={"email"} label={"User Email"} type={"text"} placeholder={"johndoe@gmail.com"} handleChange={handleChange} required={true} />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-screen px-3">
            <label className="block text-gray-800 text-sm font-medium mb-1" htmlFor={"delegatedAccess"}>User Role</label>
            <Select
              className="sm:w-screen w-full md:w-52 h-12 text-gray-800"
              id="delegatedAccess"
              defaultValue={DelegatedAccess.PERCENTAGE}
              onChange={handleSelectChange}
              value={selectedUser.delegatedAccess}
              options={[
                { label: 'Owner', value: DelegatedAccess.OWNER },
                { label: 'Ticket Scanner', value: DelegatedAccess.TICKET_SCANNER },
              ]}
            />
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-4 mt-4">
          <div className="px-3">
            <Button className="px-8 py-6 shadow-md items-center justify-center font-medium inline-flex">Discard</Button>
          </div>
          <div className="px-3">
            <Button onClick={saveUser} type="primary" className="px-8 py-6 shadow-md items-center bg-blue-600 hover:bg-blue-700 justify-center font-medium inline-flex">Save User</Button>
          </div>
        </div>
      </form>
    </div>
  );
}