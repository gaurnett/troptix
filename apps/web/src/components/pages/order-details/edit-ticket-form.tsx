import { CustomInput } from "@/components/ui/input";
import { Button, Form } from "antd";

export default function EditTicketForm({ selectedTicket, setSelectedTicket, saveTicket }) {

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSelectedTicket(previousTicket => ({
      ...previousTicket,
      [event.target.name]: event.target.value,
    }))
  }

  return (
    <div className="md:max-w-md">
      <Form
        className=""
        name="basic"
        onFinish={saveTicket}>
        <div className="md:flex md:justify-between">
          <div className="mb-4 md:mr-4 w-full">
            <CustomInput value={selectedTicket.firstName} name={"firstName"} id={"firstName"} label={"First Name"} type={"text"} placeholder={"John"} handleChange={handleChange} required={true} />

          </div>
          <div className="mb-4 md:ml-4 w-full">
            <CustomInput value={selectedTicket.lastName} name={"lastName"} id={"lastName"} label={"Last Name"} type={"text"} placeholder={"Doe"} handleChange={handleChange} required={true} />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-screen px-3">
            <CustomInput disabled={true} value={selectedTicket.email} name={"email"} id={"email"} label={"Email"} type={"text"} placeholder={"johndoe@gmail.com"} handleChange={handleChange} required={true} />
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