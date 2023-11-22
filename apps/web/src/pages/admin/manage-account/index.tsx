import { useContext, useEffect, useState } from 'react';
import { TropTixContext } from '@/components/WebNavigator';
import { Spin, message, Tabs, TabsProps } from 'antd';
import AccountDetails from './account-detail';
import SocialMedia from './social-media';
import { getUsers, GetUsersType } from 'troptix-api';

export default function ManageAccountPage() {
  const { user } = useContext(TropTixContext);
  const userId = user === null || user === undefined ? null : user.id;
  const [messageApi, contextHolder] = message.useMessage();
  const [isFetchingUser, setIsFetchingUser] = useState(true);
  const [adminUser, setAdminUser] = useState<any>({});

  useEffect(() => {
    async function fetchUser() {
      if (!userId) {
        setIsFetchingUser(false);
        return;
      }

      const getUsersRequest: any = {
        getUsersType: GetUsersType.GET_USERS_BY_ID,
        userId: userId
      }
      const response: any = await getUsers(getUsersRequest);

      if (response !== undefined) {
        setAdminUser(response);
      }

      console.log("ManageAccountPage [fetchUser]: " + JSON.stringify(response));

      setIsFetchingUser(false);
    };

    fetchUser();
  }, [userId]);

  const items: TabsProps['items'] = [
    {
      key: '0',
      label: 'Account Details',
      children: <AccountDetails adminUser={adminUser} setAdminUser={setAdminUser} />,
    },
    {
      key: '1',
      label: 'Social Media',
      children: <SocialMedia adminUser={adminUser} setAdminUser={setAdminUser} />,
    },

  ];

  return (
    <div className="w-full md:max-w-2xl mx-auto">
      {contextHolder}
      <div className="mx-4">
        <h1 className="text-center text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4" data-aos="zoom-y-out"><span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-teal-400">Manage Account</span></h1>
        {!isFetchingUser
          ?
          <div className="float-right w-full">
            <Tabs defaultActiveKey="0" items={items} />
          </div>
          :
          <Spin className="mt-16" tip="Fetching User" size="large">
            <div className="content" />
          </Spin>}
      </div>
    </div>
  );
}