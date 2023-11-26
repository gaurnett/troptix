import { useContext, useEffect, useState } from "react";
import { TropTixContext } from "@/components/WebNavigator";
import { Spin, message, Tabs, TabsProps } from "antd";
import AccountDetails from "./account-detail";
import SocialMedia from "./social-media";
import { getUsers, GetUsersType } from "troptix-api";
import { useFetchUser } from "@/hooks/useUser";

export default function ManageAccountPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [adminUser, setAdminUser] = useState<any>({});

  const { isPending, isError, user } = useFetchUser();

  useEffect(() => {
    if (user) {
      setAdminUser(user);
    }
  }, [user]);

  const items: TabsProps["items"] = [
    {
      key: "0",
      label: "Account Details",
      children: (
        <AccountDetails adminUser={adminUser} setAdminUser={setAdminUser} />
      ),
    },
    {
      key: "1",
      label: "Social Media",
      children: (
        <SocialMedia adminUser={adminUser} setAdminUser={setAdminUser} />
      ),
    },
  ];

  return (
    <div className="w-full md:max-w-2xl mx-auto">
      {contextHolder}
      <div className="mx-4">
        <h1
          className="text-center text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4"
          data-aos="zoom-y-out"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-teal-400">
            Manage Account
          </span>
        </h1>
        {!isPending ? (
          <div className="float-right w-full">
            <Tabs defaultActiveKey="0" items={items} />
          </div>
        ) : (
          <Spin className="mt-16" tip="Fetching User" size="large">
            <div className="content" />
          </Spin>
        )}
      </div>
    </div>
  );
}
