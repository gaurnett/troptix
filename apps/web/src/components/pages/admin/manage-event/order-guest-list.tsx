import { Ticket, TicketStatus } from "@/hooks/types/Ticket";
import { PostTicketRequest, PostTicketType, useCreateTicket } from "@/hooks/useTicket";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Input, List, Popconfirm, message } from "antd";
import { useEffect, useState } from "react";

export default function OrderGuestListPage({ orders }) {
  const [searchValue, setSearchValue] = useState("");
  const [guests, setGuests] = useState<Ticket[]>([]);
  const [originalList, setOriginalList] = useState<Ticket[]>([])
  const createTicket = useCreateTicket();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    let guestList: Ticket[] = [];

    orders.forEach(order => {
      const tickets = order.tickets;

      tickets.forEach(ticket => {
        guestList.push(ticket);
      });
    });

    setGuests(guestList);
    setOriginalList(guestList);
  }, [orders]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const searchText = event.target.value;
    setSearchValue(searchText);
    filterList(searchText);
  }

  function doesStringInclude(string1: string, string2: string) {
    if (!string1 || !string2) {
      return false;
    }

    return string1.toLowerCase().includes(string2.toLowerCase());
  }

  function filterList(value: string) {
    if (value === "" || value === undefined) {
      setGuests(originalList);
    } else {
      setGuests(originalList.filter(guest =>
        doesStringInclude(guest.id as string, value) || doesStringInclude(guest?.firstName as string, value) || doesStringInclude(guest?.lastName as string, value)
      ));
    }
  }

  function checkIn(guest: Ticket, index) {
    const updatedTicket = {
      ...guest,
      ["status"]: !guest?.status || guest?.status === TicketStatus.NOT_AVAILABLE ? TicketStatus.AVAILABLE : TicketStatus.NOT_AVAILABLE
    }
    messageApi
      .open({
        key: 'update-ticket-loading',
        type: 'loading',
        content: 'Updating Ticket..',
        duration: 0,
      });

    const request: PostTicketRequest = {
      type: PostTicketType.UPDATE_STATUS,
      ticket: updatedTicket
    }

    createTicket.mutate(request, {
      onSuccess: (data) => {
        // const oldData = tickets[selectedIndex];
        // tickets[selectedIndex] = {
        //   ...oldData,
        //   ...data,
        // }

        // queryClient.setQueryData(['order'], {
        //   ...order,
        //   ["tickets"]: tickets
        // });
      },
      onError: (error) => {
        messageApi.destroy('update-ticket-loading');
        messageApi.open({
          type: 'error',
          content: 'Failed to save ticket, please try again.',
        });
        return;
      }
    })

    messageApi.destroy('update-ticket-loading');
    messageApi.open({
      type: 'success',
      content: 'Successfully saved ticket.',
    });
  }

  return (
    <div className="w-full mr-8">
      {contextHolder}
      <div>
        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-full px-3 font-bold">
            Create and send out complementary tickets by visiting the Tickets Tab.
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-4">
          <div className="w-full px-3">
            <Input placeholder={"Search order number, email, or name"} onChange={handleChange} name={"search"} value={searchValue} id={"search"} type={"text"} classNames={{ input: "form-input w-full text-gray-800" }} />
          </div>
        </div>

        <List
          itemLayout="horizontal"
          size="large"
          dataSource={guests}
          pagination={{
            pageSize: 8,
          }}
          renderItem={(guest: any, index: number) => (
            <List.Item
              actions={[
                <Popconfirm
                  key="check-in"
                  title="Check in guest"
                  description={`Are you sure you want to check in ${guest?.firstName} ${guest?.lastName}?`}
                  className="time-picker-button"
                  onConfirm={() => checkIn(guest, index)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button>Check In</Button>
                </Popconfirm>
              ]}>
              <div key={guest.id} >
                <div className="flex">
                  <div className="my-auto">
                    <div>{String(guest.id).toUpperCase()}</div>
                    <div>{guest?.firstName} {guest?.lastName}</div>
                    <div>{guest?.email}</div>
                  </div>
                </div>
              </div>
            </List.Item>

          )}
        />
      </div>
    </div>
  );
}