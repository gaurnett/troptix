import { CustomInput, CustomTextArea } from "@/components/ui/input";
import Link from "next/link";
import { useEffect, useState } from "react";
import TicketForm from "./ticket-form";
import { Button, Drawer, List, Popconfirm, Spin, message } from "antd";
import { useRouter } from "next/router";
import { TicketType } from "troptix-models";
import { GetTicketTypesType, GetTicketTypesRequest, getTicketTypes, saveTicketType } from 'troptix-api';

export default function TicketsPage() {
  const router = useRouter();
  const eventId = router.query.eventId;

  const [messageApi, contextHolder] = message.useMessage();
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const [ticketTypes, setTicketTypes] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>();
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFetchingTicketTypes, setIsFetchingTicketTypes] = useState(true);

  useEffect(() => {
    async function fetchTicketTypes() {
      const getTicketTypesRequest: any = {
        getTicketTypesType: GetTicketTypesType.GET_TICKET_TYPES_BY_EVENT,
        eventId: eventId,
      }

      try {
        const response = await getTicketTypes(getTicketTypesRequest);

        console.log("Ticket Types Response: " + JSON.stringify(response));
        if ((response.error === undefined || response.error === undefined) && response.length !== 0) {
          setTicketTypes(response);
        }
      } catch (error) {
        console.log("Ticket Types [fetchTicketTypes] error: " + error)
      }
      setIsFetchingTicketTypes(false);
    };

    fetchTicketTypes();
  }, [eventId]);

  async function saveTicket() {
    const response = await saveTicketType(selectedTicket, selectedIndex !== -1);

    if (response === null || response === undefined || response.error !== null) {
      console.log("TicketFormScreen [saveTicket] response error: " + JSON.stringify(response.error));
      messageApi.open({
        type: 'error',
        content: 'Failed to save ticket, please try again.',
      });
      return;
    }

    messageApi.open({
      type: 'success',
      content: 'Successfully saved ticket.',
    });

    if (selectedIndex === -1) {
      setTicketTypes([...ticketTypes, selectedTicket])
    } else {
      const updatedTickets = ticketTypes.map((ticketType, i) => {
        if (ticketType.id === selectedTicket.id) {
          return selectedTicket;
        } else {
          return ticketType;
        }
      });
      setTicketTypes(updatedTickets);
    }

    setOpen(false);
  }

  function deleteTicket(index: number) {
    let tempTickets = ticketTypes;
    tempTickets.splice(index, 1);
    setTicketTypes(previousEvent => ({ ...previousEvent, tempTickets }));
  }

  function showDrawer(ticket: any, index: number) {
    setSelectedTicket(ticket);
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
          isFetchingTicketTypes ?
            <Spin className="mt-16" tip="Fetching Tickets" size="large">
              <div className="content" />
            </Spin> :
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold leading-tighter tracking-tighter mb-4" data-aos="zoom-y-out">Ticket Details</h2>

              <button onClick={() => showDrawer(new TicketType(eventId), -1)} className="btn text-white bg-blue-600 hover:bg-blue-700 mb-4">Add Ticket</button>

              <List
                className="demo-loadmore-list"
                itemLayout="horizontal"
                dataSource={ticketTypes}
                renderItem={(item, index) => (
                  <List.Item
                    actions={[
                      <Button type="text" onClick={() => showDrawer(item, index)} key="edit">Edit</Button>,
                      <Popconfirm
                        key="delete"
                        title="Delete this ticket"
                        description="Are you sure to delete this ticket?"
                        className="time-picker-button"
                        onConfirm={() => deleteTicket(index)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button danger>Delete</Button>
                      </Popconfirm>]}
                  >
                    <div>{item.name}</div>
                  </List.Item>
                )}
              />
            </div>
        }

      </div>

      <Drawer width={500} title="Add Ticket" placement="right" onClose={onClose} open={open}>
        <TicketForm selectedTicket={selectedTicket} setSelectedTicket={setSelectedTicket} saveTicket={saveTicket} />
      </Drawer>

    </div>
  );
}