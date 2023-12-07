import { Ticket, TicketStatus } from "@/hooks/types/Ticket";
import { PostTicketRequest, PostTicketType, useCreateTicket } from "@/hooks/useTicket";
import { Button, Input, List, Popconfirm, message } from "antd";
import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";

type GuestListRow = {
  orderId: string;
  ticketId: string;
  name: string;
  email: string;
}

export default function OrderGuestListPage({ orders }) {
  const [searchValue, setSearchValue] = useState("");
  const [guests, setGuests] = useState<Ticket[]>([]);
  const [originalList, setOriginalList] = useState<Ticket[]>([])
  const createTicket = useCreateTicket();
  const [messageApi, contextHolder] = message.useMessage();
  const [csvData, setCsvData] = useState<any>([]);

  const csvHeaders = [
    { label: "Order ID", key: "orderId" },
    { label: "Ticket ID", key: "ticketId" },
    { label: "Name", key: "name" },
    { label: "Email", key: "email" }
  ]

  useEffect(() => {
    let guestList: Ticket[] = [];
    let data: GuestListRow[] = []

    orders.forEach(order => {
      const tickets = order.tickets;

      tickets.forEach(ticket => {
        guestList.push(ticket);

        const row: GuestListRow = {
          orderId: ticket.orderId as string,
          ticketId: ticket.id as string,
          name: ticket.firstName + " " + ticket.lastName,
          email: ticket.email as string
        }
        data.push(row);
      });
    });

    setGuests(guestList);
    setCsvData(data);
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

  function checkIn(guest: Ticket, index: number) {
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
        let oldData = guests[index];
        oldData = {
          ...guests[index],
          ...data,
        }

        const updatedGuests = guests.map((guest, i) => {
          if (guest.id === oldData.id) {
            return oldData;
          } else {
            return guest;
          }
        });

        setGuests(updatedGuests);
        messageApi.destroy('update-ticket-loading');
        messageApi.open({
          type: 'success',
          content: 'Successfully saved ticket.',
        });
      },
      onError: (error) => {
        messageApi.destroy('update-ticket-loading');
        messageApi.open({
          type: 'error',
          content: 'Failed to save ticket, please try again.',
        });
        return;
      }
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

        <div className="mb-4">
          <Button>
            <CSVLink filename={"guest-list.csv"} headers={csvHeaders} data={csvData}>
              Export to CSV
            </CSVLink>
          </Button>
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
          renderItem={(guest: Ticket, index: number) => {
            let title = "Check in guest";
            let description = `Are you sure you want to check in ${guest?.firstName} ${guest?.lastName}?`;
            let buttonText = "Check In";

            if (guest.status === TicketStatus.NOT_AVAILABLE) {
              title = "Activate Ticket";
              description = "Are you sure you want to activate this ticket?"
              buttonText = "Activate Ticket"
            }
            return (
              <List.Item
                actions={[
                  <Popconfirm
                    key="check-in"
                    title={title}
                    description={description}
                    className="time-picker-button"
                    onConfirm={() => checkIn(guest, index)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button>{buttonText}</Button>
                  </Popconfirm>
                ]}>
                <div key={guest.id} >
                  <div className="flex">
                    <div className="my-auto">
                      <div>{String(guest.id).toUpperCase()}</div>
                      <div className={`${guest.status === TicketStatus.NOT_AVAILABLE ? 'line-through' : ''}`}>
                        <div>{guest?.firstName} {guest?.lastName}</div>
                        <div>{guest?.email}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </List.Item>

            )
          }}
        />
      </div>
    </div>
  );
}