import EventCard from "@/components/EventCard";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useState } from "react";
import { SocialMediaAccount, SocialMediaAccountType } from "troptix-models";
import { TropTixContext } from "@/components/WebNavigator";
import Link from "next/link";
import {
  List,
  Spin,
  Image,
  Form,
  Button,
  Popconfirm,
  Drawer,
  message,
} from "antd";
import { CustomInput } from "@/components/ui/input";
import { updateProfile } from "firebase/auth";
import { auth } from "../../config";
import { useFetchUser, useUpdateUser } from "@/hooks/useUser";

export default function AccountPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [socialMediaAccounts, setSocialMediaAccounts] = useState<any[]>([]);
  const [adminUser, setAdminUser] = useState<any>();
  const [socialMediaAccount, setSocialMediaAccount] = useState<any>();
  const [socialMediaAccountIndex, setSocialMediaAccountIndex] = useState(0);
  const [socialMediaAccountOpen, setSocialMediaAccountOpen] = useState(false);

  const { user, isPending, isError } = useFetchUser();
  const updateUser = useUpdateUser();

  useEffect(() => {
    if (user) {
      setAdminUser(user);
    }
  }, [user]);

  function showDrawer(ticket: any, index: number) {
    setSocialMediaAccount(ticket);
    setSocialMediaAccountIndex(index);
    setSocialMediaAccountOpen(true);
  }

  function deleteAccount() {
    setSocialMediaAccounts(
      socialMediaAccounts.filter(
        (account) => account.id !== socialMediaAccount.id
      )
    );
  }

  function onClose() {
    setSocialMediaAccountOpen(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAdminUser((previousUser) => ({
      ...previousUser,
      [e.target.name]: e.target.value,
    }));
  }

  async function onFinish(values: any) {
    updateUser.mutate(adminUser, {
      onSuccess: async () => {
        if (
          adminUser.name !== auth.currentUser?.displayName &&
          auth.currentUser
        ) {
          await updateProfile(auth.currentUser, {
            displayName: adminUser.name,
          });
        }
        messageApi.open({
          type: "success",
          content: "Successfully saved account.",
        });
      },
      onError: () => {
        messageApi.open({
          type: "error",
          content: "Failed to save account, please try again.",
        });
      },
    });
  }

  const onFinishFailed = (errorInfo: any) => { };

  function transformAccountType(accountType: string) {
    switch (accountType) {
      case SocialMediaAccountType.FACEBOOK:
        return "Facebook";
      case SocialMediaAccountType.INSTAGRAM:
        return "Instagram";
        break;
      case SocialMediaAccountType.TIKTOK:
        return "TikTok";
      case SocialMediaAccountType.TWITTER:
        return "Twitter";
      default:
        return "Social Media Account";
    }
  }

  return (
    <div className="w-full md:max-w-2xl mx-auto mt-32">
      {contextHolder}
      <div className="mx-4">
        <h1
          className="text-center text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4"
          data-aos="zoom-y-out"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-teal-400">
            Account Settings
          </span>
        </h1>
        {!isPending && adminUser ? (
          <Form
            name="basic"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            className="mx-4"
          >
            <h2
              className="text-2xl md:text-3xl font-extrabold leading-tighter tracking-tighter mb-4 mt-4"
              data-aos="zoom-y-out"
            >
              Contact Information
            </h2>
            <div className="flex flex-wrap -mx-3 mb-4">
              <div className="w-full px-3">
                <CustomInput
                  value={adminUser.name}
                  name={"name"}
                  id={"name"}
                  label={"Name"}
                  type={"text"}
                  placeholder={"John Doe"}
                  handleChange={handleChange}
                  required={true}
                />
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-4">
              <div className="w-full px-3">
                <CustomInput
                  value={adminUser.email}
                  name={"email"}
                  id={"email"}
                  label={"Email"}
                  type={"text"}
                  placeholder={"johndoe@gmail.com"}
                  handleChange={handleChange}
                  required={true}
                  disabled={true}
                />
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-4">
              <div className="w-full px-3">
                <CustomInput
                  value={adminUser.telephoneNumber}
                  name={"telephoneNumber"}
                  id={"telephoneNumber"}
                  label={"Telephone Number"}
                  type={"text"}
                  placeholder={"123456789"}
                  handleChange={handleChange}
                />
              </div>
            </div>

            <h2
              className="text-2xl md:text-3xl font-extrabold leading-tighter tracking-tighter mb-4"
              data-aos="zoom-y-out"
            >
              Billing Address
            </h2>

            <div className="flex flex-wrap -mx-3 mb-4">
              <div className="w-full px-3">
                <CustomInput
                  value={adminUser.billingAddress1}
                  name={"billingAddress1"}
                  id={"billingAddress1"}
                  label={"Address"}
                  type={"text"}
                  placeholder={"185 Kings Street"}
                  handleChange={handleChange}
                />
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-4">
              <div className="w-full px-3">
                <CustomInput
                  value={adminUser.billingAddress2}
                  name={"billingAddress2"}
                  id={"billingAddress2"}
                  label={"Address 2"}
                  type={"text"}
                  placeholder={""}
                  handleChange={handleChange}
                />
              </div>
            </div>
            <div className="md:flex md:justify-between">
              <div className="mb-4 md:mr-4 w-full">
                <CustomInput
                  value={adminUser.billingCity}
                  name={"billingCity"}
                  id={"billingCity"}
                  label={"City"}
                  type={"text"}
                  placeholder={"Kingston"}
                  handleChange={handleChange}
                />
              </div>
              <div className="mb-4 md:ml-4 w-full">
                <CustomInput
                  value={adminUser.billingZip}
                  name={"billingZip"}
                  id={"billingZip"}
                  label={"Zip/Postal Code"}
                  type={"text"}
                  placeholder={"12345"}
                  handleChange={handleChange}
                />
              </div>
            </div>
            <div className="md:flex md:justify-between">
              <div className="mb-4 md:mr-4 w-full">
                <CustomInput
                  value={adminUser.billingState}
                  name={"billingState"}
                  id={"billingState"}
                  label={"State/Parish"}
                  type={"text"}
                  placeholder={"Kingston"}
                  handleChange={handleChange}
                />
              </div>
              <div className="mb-4 md:ml-4 w-full">
                <CustomInput
                  value={adminUser.billingCountry}
                  name={"billingCountry"}
                  id={"billingCountry"}
                  label={"Country"}
                  type={"text"}
                  placeholder={"Jamaica"}
                  handleChange={handleChange}
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
        ) : (
          <Spin className="mt-16" tip="Fetching User" size="large">
            <div className="content" />
          </Spin>
        )}
      </div>
    </div>
  );
}
