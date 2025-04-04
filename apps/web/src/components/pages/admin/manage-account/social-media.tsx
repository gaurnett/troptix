import { TropTixContext } from '@/components/AuthProvider';
import { Button, Drawer, List, Popconfirm, message } from 'antd';
import { useContext, useState } from 'react';
import { PutUsersType, putUsers } from 'troptix-api';
import { SocialMediaAccount, SocialMediaAccountType } from 'troptix-models';
import SocialMediaForm from './social-media-form';

export default function SocialMedia({ adminUser, setAdminUser }) {
  const { user } = useContext(TropTixContext);
  const userId = user === null || user === undefined ? null : user.id;
  const [messageApi, contextHolder] = message.useMessage();
  const [isFetchingUser, setIsFetchingUser] = useState(true);
  const [socialMediaAccounts, setSocialMediaAccounts] = useState<any[]>(
    adminUser.socialMediaAccounts
  );
  const [socialMediaAccount, setSocialMediaAccount] = useState<any>();
  const [socialMediaAccountIndex, setSocialMediaAccountIndex] = useState(0);
  const [socialMediaAccountOpen, setSocialMediaAccountOpen] = useState(false);

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

  async function onFinish(values: any) {}

  async function saveSocialMediaAccount() {
    let putUserRequest = {
      putUsersType: PutUsersType.PUT_USERS_SOCIAL_MEDIA,
      socialMediaAccount: socialMediaAccount,
    };

    const response = await putUsers(putUserRequest);

    if (
      response === null ||
      response === undefined ||
      response.error !== null
    ) {
      messageApi.open({
        type: 'error',
        content: 'Failed to save account, please try again.',
      });
      return;
    }

    messageApi.open({
      type: 'success',
      content: 'Successfully saved account.',
    });

    if (socialMediaAccountIndex === -1) {
      setSocialMediaAccounts([...socialMediaAccounts, socialMediaAccount]);
    } else {
      const updatedAccounts = socialMediaAccounts.map((account, i) => {
        if (account.id === socialMediaAccount.id) {
          return socialMediaAccount;
        } else {
          return account;
        }
      });
      setSocialMediaAccounts(updatedAccounts);
    }

    setSocialMediaAccountOpen(false);
  }

  const onFinishFailed = (errorInfo: any) => {};

  function transformAccountType(accountType: string) {
    switch (accountType) {
      case SocialMediaAccountType.FACEBOOK:
        return 'Facebook';
      case SocialMediaAccountType.INSTAGRAM:
        return 'Instagram';
        break;
      case SocialMediaAccountType.TIKTOK:
        return 'TikTok';
      case SocialMediaAccountType.TWITTER:
        return 'Twitter';
      default:
        return 'Social Media Account';
    }
  }

  return (
    <div className="w-full md:max-w-2xl mx-auto">
      {contextHolder}
      <div>
        <Button
          onClick={() => showDrawer(new SocialMediaAccount(userId), -1)}
          className="my-auto px-4 py-4 shadow-md items-center justify-center font-medium inline-flex"
        >
          Add Social Media Account
        </Button>

        <List
          className="demo-loadmore-list"
          itemLayout="horizontal"
          dataSource={socialMediaAccounts}
          renderItem={(item: any, index) => (
            <List.Item
              actions={[
                <Button onClick={() => showDrawer(item, index)} key="edit">
                  Edit
                </Button>,
                <Popconfirm
                  key="delete"
                  title="Delete this account"
                  description="Are you sure to delete this account?"
                  className="time-picker-button"
                  onConfirm={deleteAccount}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button danger>Delete</Button>
                </Popconfirm>,
              ]}
            >
              <div className="truncate">
                {transformAccountType(item.socialMediaAccountType)}:{' '}
                <a
                  className="underline hover:underline"
                  target="_blank"
                  href={item.link}
                >
                  {item.link}
                </a>
              </div>
            </List.Item>
          )}
        />

        <Drawer
          width={500}
          title="Add Social Media Account"
          placement="right"
          onClose={onClose}
          open={socialMediaAccountOpen}
        >
          <SocialMediaForm
            selectedAccount={socialMediaAccount}
            setSelectedAccount={setSocialMediaAccount}
            saveSocialMediaAccount={saveSocialMediaAccount}
            onClose={onClose}
          />
        </Drawer>
      </div>
    </div>
  );
}
