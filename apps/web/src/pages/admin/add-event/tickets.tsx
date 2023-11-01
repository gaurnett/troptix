import { CustomInput, CustomTextArea } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { TicketType } from 'troptix-models';
import TicketForm from "./ticket-form";
import { Button, Drawer, List, Popconfirm, message } from "antd";
import { saveTicketType } from 'troptix-api';
import { useRouter } from "next/router";

export default function TicketsPage({ event, setEvent }) {
  const router = useRouter();
  const eventId = router.query.eventId;

  const [messageApi, contextHolder] = message.useMessage();
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState({});
  const [selectedIndex, setSelectedIndex] = useState(-1);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(event.target.name);
    console.log(event.target.value);
  }

  async function signIn() {
    setShow(!show)
    console.log("signing in");
  }

  function closeTicketForm() {
    setShow(false);
  }

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
      let tempTickets = event.ticketTypes;
      tempTickets.push(selectedTicket);
      setEvent((previousEvent: any) => ({ ...previousEvent, ["ticketTypes"]: tempTickets }))
    } else {
      let tempTickets = event.ticketTypes;
      tempTickets[selectedIndex] = selectedTicket;
      setEvent(previousEvent => ({ ...previousEvent, ["ticketTypes"]: tempTickets }))
    }

    setOpen(false);
  }

  function deleteTicket(index: number) {
    let tempTickets = event.ticketTypes;
    tempTickets.splice(index, 1);
    setEvent(previousEvent => ({ ...previousEvent, ["ticketTypes"]: tempTickets }));
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
        {/* <form className=""> */}
        <h2 className="text-2xl md:text-3xl font-extrabold leading-tighter tracking-tighter mb-4" data-aos="zoom-y-out">Ticket Details</h2>

        <button onClick={() => showDrawer(new TicketType(eventId), -1)} className="btn text-white bg-blue-600 hover:bg-blue-700 mb-4">Add Ticket</button>

        <List
          className="demo-loadmore-list"
          itemLayout="horizontal"
          dataSource={event.ticketTypes}
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

      <Drawer width={500} title="Add Ticket" placement="right" onClose={onClose} open={open}>
        <TicketForm selectedTicket={selectedTicket} setSelectedTicket={setSelectedTicket} saveTicket={saveTicket} />
      </Drawer>

    </div>
  );
}