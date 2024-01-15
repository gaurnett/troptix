import { CustomInput } from "@/components/ui/input";
import { DelegatedAccess } from "@/hooks/types/DelegatedUser";
import { Button, Form, Select } from "antd";

export default function UserDelegationForm({ onClose, selectedUser, setSelectedUser, saveUser }) {

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSelectedUser(previousUser => ({
      ...previousUser,
      [event.target.name]: event.target.value,
    }))
  }

  function handleSelectChange(value: string) {
    setSelectedUser(previousUser => ({
      ...previousUser,
      ["delegatedAccess"]: value,
    }))
  };

  return (
    <div className="md:max-w-md">
      <Form
        name="user-delegation-form"
        onFinish={saveUser}>
        <h3 className="text-xl md:text-xl font-extrabold leading-tighter tracking-tighter mb-4" data-aos="zoom-y-out">User Details</h3>
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
              placeholder={"Select user role"}
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
            <Button onClick={onClose} className="px-8 py-6 shadow-md items-center justify-center font-medium inline-flex">Discard</Button>
          </div>
          <div className="px-3">
            <Button htmlType="submit" type="primary" className="px-8 py-6 shadow-md items-center bg-blue-600 hover:bg-blue-700 justify-center font-medium inline-flex">Save User</Button>
          </div>
        </div>
      </Form>
    </div>
  );
}