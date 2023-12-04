import { CustomInput } from "@/components/ui/input";
import { Button, Form } from "antd";

export default function AccountDetails({ adminUser, setAdminUser }) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAdminUser((previousUser) => ({
      ...previousUser,
      [e.target.name]: e.target.value,
    }));
  }

  async function onFinish(values: any) { }

  const onFinishFailed = (errorInfo: any) => { };

  return (
    <div className="w-full md:max-w-2xl mx-auto">
      <div>
        <Form name="basic" onFinish={onFinish} onFinishFailed={onFinishFailed}>
          <div className="md:flex md:justify-between">
            <div className="mb-4 md:mr-4 w-full">
              <CustomInput
                value={adminUser.firstName}
                name={"firstName"}
                id={"firstName"}
                label={"First Name"}
                type={"text"}
                placeholder={"John"}
                handleChange={handleChange}
              />
            </div>
            <div className="mb-4 md:ml-4 w-full">
              <CustomInput
                value={adminUser.lastName}
                name={"lastName"}
                id={"lastName"}
                label={"Last Name"}
                type={"text"}
                placeholder={"Doe"}
                handleChange={handleChange}
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-4">
            <div className="w-full px-3">
              <CustomInput
                value={adminUser.email}
                disabled={true}
                name={"organizer"}
                id={"organizer"}
                label={"Email"}
                type={"text"}
                placeholder={"johndoe@gmail.com"}
                handleChange={handleChange}
                required={true}
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-4">
            <div className="w-full px-3">
              <CustomInput
                value={adminUser.telephoneNumber}
                name={"organizer"}
                id={"organizer"}
                label={"Telephone Number"}
                type={"text"}
                placeholder={"1234567890"}
                handleChange={handleChange}
                required={true}
              />
            </div>
          </div>

          <div className="flex flex-wrap -mx-3 mb-4 mt-8">
            <div className="px-3">
              <Button
                htmlType="submit"
                type="primary"
                className="px-6 py-6 shadow-md items-center bg-blue-600 hover:bg-blue-700 justify-center font-medium inline-flex"
              >
                Save Account Details
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
