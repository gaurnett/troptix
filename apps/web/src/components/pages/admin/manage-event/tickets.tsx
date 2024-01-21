import { Spinner } from '@/components/ui/spinner';
import { getFormattedCurrency } from '@/lib/utils';
import { Button, Drawer, List, Popconfirm, Typography, message } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  GetTicketTypesType,
  getTicketTypes,
  saveTicketType,
} from 'troptix-api';
import { TicketType } from 'troptix-models';
import TicketCompForm from './ticket-comp-form';
import TicketForm from './ticket-form';
const { Paragraph } = Typography;

export default function TicketsPage({ event }) {
  const router = useRouter();
  const eventId = router.query.eventId;

  const [messageApi, contextHolder] = message.useMessage();
  const [open, setOpen] = useState(false);
  const [compTicketModalOpen, setCompTicketModalOpen] = useState(false);
  const [ticketTypes, setTicketTypes] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>();
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFetchingTicketTypes, setIsFetchingTicketTypes] = useState(true);

  useEffect(() => {
    async function fetchTicketTypes() {
      const getTicketTypesRequest: any = {
        getTicketTypesType: GetTicketTypesType.GET_TICKET_TYPES_BY_EVENT,
        eventId: eventId,
      };

      try {
        const response = await getTicketTypes(getTicketTypesRequest);

        if (
          (response.error === undefined || response.error === undefined) &&
          response.length !== 0
        ) {
          setTicketTypes(response);
        }
      } catch (error) {}
      setIsFetchingTicketTypes(false);
    }

    fetchTicketTypes();
  }, [eventId]);

  async function saveTicket() {
    messageApi.open({
      key: 'update-ticket-loading',
      type: 'loading',
      content: 'Updating Ticket..',
      duration: 0,
    });

    const response = await saveTicketType(selectedTicket, selectedIndex !== -1);

    messageApi.destroy('update-ticket-loading');
    if (
      response === null ||
      response === undefined ||
      response.error !== null
    ) {
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
      setTicketTypes([...ticketTypes, selectedTicket]);
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
    setTicketTypes((previousEvent) => ({ ...previousEvent, tempTickets }));
  }

  function showDrawer(ticket: any, index: number) {
    setSelectedTicket(ticket);
    setSelectedIndex(index);
    setOpen(true);
  }

  const onClose = () => {
    setOpen(false);
  };

  const closeCompTicketTypeDrawer = () => {
    setCompTicketModalOpen(false);
  };

  return (
    <div>
      {contextHolder}
      <div className="w-full md:max-w-2xl mr-8">
        {isFetchingTicketTypes ? (
          <div className="mt-4">
            <Spinner text={'Fetching Tickets'} />
          </div>
        ) : (
          <div>
            <h2
              className="text-2xl md:text-3xl font-extrabold leading-tighter tracking-tighter mb-4"
              data-aos="zoom-y-out"
            >
              Ticket Details
            </h2>

            <div className="flex mb-18">
              <Button
                onClick={() => showDrawer(new TicketType(eventId), -1)}
                type="primary"
                className="px-6 py-5 shadow-md items-center bg-blue-600 hover:bg-blue-700 justify-center font-medium inline-flex"
              >
                Add Ticket
              </Button>
              <Button
                onClick={() => setCompTicketModalOpen(true)}
                className="px-6 py-5 ml-4 mb-4 shadow-md items-center justify-center font-medium inline-flex"
              >
                Send Complementary Ticket
              </Button>
            </div>

            <div>
              <List
                className="demo-loadmore-list"
                itemLayout="horizontal"
                dataSource={ticketTypes}
                renderItem={(item, index) => (
                  <List.Item
                    actions={[
                      <Button
                        onClick={() => showDrawer(item, index)}
                        key="edit"
                      >
                        Edit
                      </Button>,
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
                      </Popconfirm>,
                    ]}
                  >
                    <div>
                      <p>{item.name}</p>
                      <div className="text-green-700">
                        {getFormattedCurrency(item.price)}
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </div>
          </div>
        )}
      </div>

      <Drawer
        width={500}
        title="Add Ticket"
        placement="right"
        onClose={onClose}
        open={open}
      >
        <TicketForm
          selectedTicket={selectedTicket}
          setSelectedTicket={setSelectedTicket}
          onClose={onClose}
          saveTicket={saveTicket}
        />
      </Drawer>

      <Drawer
        width={500}
        title="Generate Complementary Ticket"
        placement="right"
        onClose={closeCompTicketTypeDrawer}
        open={compTicketModalOpen}
      >
        <TicketCompForm
          ticketTypes={ticketTypes}
          event={event}
          onClose={onClose}
        />
      </Drawer>
    </div>
  );
}
