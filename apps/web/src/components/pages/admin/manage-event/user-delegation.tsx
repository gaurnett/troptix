import { TropTixContext } from '@/components/AuthProvider';
import { Spinner } from '@/components/ui/spinner';
import {
  DelegatedAccess,
  DelegatedUser,
  createUser,
} from '@/hooks/types/DelegatedUser';
import {
  DeleteDelegatedUserRequest,
  PostDelegatedUserRequest,
  useDeleteDelegatedUser,
  useFetchDelegatedUsers,
  usePostDelegatedUser,
} from '@/hooks/useDelegatedUser';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Drawer, List, Popconfirm, message } from 'antd';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import UserDelegationForm from './user-delegation-form';

export default function UserDelegationPage() {
  const router = useRouter();
  const { user } = useContext(TropTixContext);
  const eventId = router.query.eventId as string;

  const [messageApi, contextHolder] = message.useMessage();
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<DelegatedUser>();
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const {
    isPending,
    isError,
    data: delegatedUsers,
    error,
  } = useFetchDelegatedUsers(eventId as string, user?.jwtToken);
  const postDelegatedUser = usePostDelegatedUser();
  const deleteDelegatedUser = useDeleteDelegatedUser();
  const queryClient = useQueryClient();

  async function saveUser() {
    messageApi.open({
      key: 'update-user-loading',
      type: 'loading',
      content: 'Updating Users..',
      duration: 0,
    });

    const request: PostDelegatedUserRequest = {
      editingUser: selectedIndex !== -1,
      user: selectedUser,
      jwtToken: user?.jwtToken,
    };

    postDelegatedUser.mutate(request, {
      onSuccess: (data) => {
        const updatedList: DelegatedUser[] = delegatedUsers;
        if (selectedIndex >= 0) {
          updatedList[selectedIndex] = data;
        } else {
          updatedList.push(data);
        }
        queryClient.setQueryData([eventId], updatedList);

        messageApi.destroy('update-user-loading');
        messageApi.open({
          type: 'success',
          content: 'Successfully saved user.',
        });
        setOpen(false);
      },
      onError: (error) => {
        messageApi.destroy('update-user-loading');
        messageApi.open({
          type: 'error',
          content: error.message,
        });
        return;
      },
    });
  }

  function deleteUser(deletedUser: DelegatedUser) {
    messageApi.open({
      key: 'delete-user-loading',
      type: 'loading',
      content: 'Deleting User...',
      duration: 0,
    });
    const request: DeleteDelegatedUserRequest = {
      id: deletedUser?.id,
      jwtToken: user.jwtToken,
    };

    deleteDelegatedUser.mutate(request, {
      onSuccess: (data: DelegatedUser) => {
        const updatedList: DelegatedUser[] = delegatedUsers.filter(
          (user) => user.email !== data?.email
        );
        queryClient.setQueryData([eventId], updatedList);

        messageApi.destroy('delete-user-loading');
        messageApi.open({
          type: 'success',
          content: 'Successfully deleted user.',
        });
        setOpen(false);
      },
      onError: (error) => {
        messageApi.destroy('delete-user-loading');
        messageApi.open({
          type: 'error',
          content: 'There was an error deleting the user, please try again',
        });
      },
    });
  }

  function showDrawer(ticket: any, index: number) {
    setSelectedUser(ticket);
    setSelectedIndex(index);
    setOpen(true);
  }

  const onClose = () => {
    setOpen(false);
  };

  function normalizeAccessType(delegatedAccess: DelegatedAccess) {
    switch (delegatedAccess) {
      case DelegatedAccess.OWNER:
        return 'Owner';
      case DelegatedAccess.TICKET_SCANNER:
        return 'Ticket Scanner';
    }
  }

  return (
    <div className="">
      {contextHolder}
      <div className="w-full md:max-w-md mr-8">
        {isPending ? (
          <div className="mt-4">
            <Spinner text={'Fetching Users'} />
          </div>
        ) : (
          <div>
            <h2
              className="text-2xl md:text-3xl font-extrabold leading-tighter tracking-tighter mb-4"
              data-aos="zoom-y-out"
            >
              Users
            </h2>

            <Button
              onClick={() => showDrawer(createUser(eventId), -1)}
              type="primary"
              className="px-6 py-5 shadow-md items-center bg-blue-600 hover:bg-blue-700 justify-center font-medium inline-flex"
            >
              Add User
            </Button>

            <List
              className="demo-loadmore-list"
              itemLayout="horizontal"
              dataSource={delegatedUsers}
              renderItem={(item: DelegatedUser, index) => (
                <List.Item
                  actions={[
                    <Button onClick={() => showDrawer(item, index)} key="edit">
                      Edit
                    </Button>,
                    <Popconfirm
                      key="delete"
                      title="Delete User"
                      description="Are you sure to delete this user?"
                      className="time-picker-button"
                      onConfirm={() => deleteUser(item)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button danger>Delete</Button>
                    </Popconfirm>,
                  ]}
                >
                  <div>
                    <div>{item.email}</div>
                    <div>
                      {normalizeAccessType(
                        item.delegatedAccess as DelegatedAccess
                      )}
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </div>
        )}
      </div>

      <Drawer
        width={500}
        title="Add Delegated User"
        placement="right"
        onClose={onClose}
        open={open}
      >
        <UserDelegationForm
          onClose={onClose}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          saveUser={saveUser}
        />
      </Drawer>
    </div>
  );
}
