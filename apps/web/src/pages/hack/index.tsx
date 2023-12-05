"use client";

export const metadata = {
  title: "Sign Up - Simple",
  description: "Page description",
};

import { TropTixContext } from "@/components/WebNavigator";
import { CustomInput } from "@/components/ui/input";
import { Button, message } from "antd";
import DOMPurify from "dompurify";
import { sanitize } from 'isomorphic-dompurify';
import { useRouter } from "next/router";
import { useContext, useState } from "react";

export type SignUpFields = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};
const isValidEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export default function Hack() {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const { user } = useContext(TropTixContext);

  const [confirmEmail, setConfirmEmail] = useState("");
  const [signUpFields, setSignUpFields] = useState<SignUpFields>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [value, setValue] = useState<any>();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSignUpFields((fields) => ({
      ...fields,
      [e.target.name]: e.target.value,
    }));
  }

  async function onFinish(e) {
    e.preventDefault();
    const clean = sanitize(signUpFields.firstName);
    const clean1 = DOMPurify.sanitize(signUpFields.firstName);
    console.log("Clean: " + clean);
    console.log("Clean: " + clean1);
    const result = await fetch('api/noop', {
      method: 'POST'
    });
    console.log(result);
    console.log(signUpFields.firstName);
    setValue(signUpFields.firstName);
    // router.push('/');
  }

  const onFinishFailed = (errorInfo: any) => { };

  return (
    <div>
      {contextHolder}
      <section className="bg-gradient-to-b from-gray-100 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          <div className="pt-32 pb-12 md:pt-40 md:pb-20">
            {/* Form */}
            <div>{value}</div>
            <form onSubmit={onFinish}>
              <div className="max-w-md mx-auto">
                <div>
                  <div className="flex flex-row -mx-3 mb-4">
                    <div className="w-full px-3">
                      <CustomInput
                        value={signUpFields.firstName}
                        name={"firstName"}
                        id={"firstName"}
                        label={"First Name *"}
                        type={"text"}
                        placeholder={"John"}
                        handleChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap -mx-3 mt-6">
                    <div className="w-full px-3">
                      <Button
                        htmlType="submit"
                        type="primary"
                        className="w-full px-6 py-6 shadow-md items-center bg-blue-600 hover:bg-blue-700 justify-center font-medium inline-flex"
                      >
                        Sign up
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
