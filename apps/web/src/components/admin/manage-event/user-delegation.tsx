import { CustomInput, CustomTextArea } from "@/components/ui/input";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, Drawer, List, Popconfirm, Spin, message } from "antd";
import { DelegatedUser, DelegatedAccess } from "troptix-models";
import { getDelegatedUsers, addDelegatedUser } from 'troptix-api';
import { useRouter } from "next/router";
import PromotionCodeForm from "./promotion-code-form";
import UserDelegationForm from "./user-delegation-form";

export default function UserDelegationPage() {
  const router = useRouter();
  const eventId = router.query.eventId;

  const [messageApi, contextHolder] = message.useMessage();
  const [delegatedUsers, setDelegatedUsers] = useState<any[]>([]);
  const [isFetchingUsers, setIsFetchingUsers] = useState(true);
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>();
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await getDelegatedUsers(eventId);

        if (response !== undefined && response.length !== 0) {
          setDelegatedUsers(response);
        }
      } catch (error) {
      }
      setIsFetchingUsers(false);
    };

    fetchUsers();
  }, [eventId]);

  async function saveUser() {
    const response = await addDelegatedUser(selectedUser, selectedIndex !== -1);

    if (response === null || response === undefined || response.error !== null) {
      messageApi.open({
        type: 'error',
        content: 'Failed to save user, please try again.',
      });
      return;
    }

    messageApi.open({
      type: 'success',
      content: 'Successfully saved user.',
    });

    if (selectedIndex === -1) {
      setDelegatedUsers([...delegatedUsers, selectedUser]);
    } else {
      const updatedUsers = delegatedUsers.map((user, i) => {
        if (user.id === selectedUser.id) {
          return selectedUser;
        } else {
          return user;
        }
      });
      setDelegatedUsers(updatedUsers);
    }

    setOpen(false);
  }

  function deleteUser() {
    setDelegatedUsers(
      delegatedUsers.filter(user => user.email !== selectedUser.email)
    );
  }

  function showDrawer(ticket: any, index: number) {
    setSelectedUser(ticket);
    setSelectedIndex(index);
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <div className="">
      {contextHolder}
      <div className="w-full md:max-w-md mr-8">
        {
          isFetchingUsers ?
            <Spin className="mt-16" tip="Fetching Users" size="large">
              <div className="content" />
            </Spin> :
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold leading-tighter tracking-tighter mb-4" data-aos="zoom-y-out">Users</h2>

              <Button onClick={() => showDrawer(new DelegatedUser(eventId), -1)} type="primary" className="px-6 py-5 shadow-md items-center bg-blue-600 hover:bg-blue-700 justify-center font-medium inline-flex">Add User</Button>

              <List
                className="demo-loadmore-list"
                itemLayout="horizontal"
                dataSource={delegatedUsers}
                renderItem={(item, index) => (
                  <List.Item
                    actions={[
                      <Button onClick={() => showDrawer(item, index)} key="edit">Edit</Button>,
                      <Popconfirm
                        key="delete"
                        title="Delete this promotion"
                        description="Are you sure to delete this promotion?"
                        className="time-picker-button"
                        onConfirm={deleteUser}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button danger>Delete</Button>
                      </Popconfirm>]}
                  >
                    <div>{item.email}</div>
                  </List.Item>
                )}
              />
            </div>

        }
      </div>

      <Drawer width={500} title="Add Promotion" placement="right" onClose={onClose} open={open}>
        <UserDelegationForm selectedUser={selectedUser} setSelectedUser={setSelectedUser} saveUser={saveUser} />
      </Drawer>

    </div>
  );
}