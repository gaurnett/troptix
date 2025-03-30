import { Spinner } from '@/components/ui/spinner';
import { TicketFeeStructure, TicketType } from '@/hooks/types/Ticket';
import { generateId, getFormattedCurrency } from '@/lib/utils';
import { Button, Drawer, List, Popconfirm, Typography, message } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';
import TicketCompForm from './ticket-comp-form';
import TicketForm from './ticket-form';
import {
  useFetchTicketTypesByEvent,
  useSaveTicketType,
} from '@/hooks/useTicketType';

export default function TicketsPage({ event }) {
  const router = useRouter();
  const eventId = router.query.eventId as string;

  const [messageApi, contextHolder] = message.useMessage();
  // Drawer state
  const [open, setOpen] = useState(false);
  // Complementary ticket modal state
  const [compTicketModalOpen, setCompTicketModalOpen] = useState(false);
  // Selected ticket state
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);

  const {
    data: ticketTypes = [],
    isLoading,
    refetch,
  } = useFetchTicketTypesByEvent(eventId);

  const { mutate: saveTicketType, isError } = useSaveTicketType(eventId);

  // TODO: Refactor to move this into the form component
  async function saveTicket(ticketType: TicketType | undefined) {
    if (!ticketType) return;

    messageApi.open({
      key: 'update-ticket-loading',
      type: 'loading',
      content: 'Updating Ticket..',
      duration: 0,
    });
    const editTicketType = ticketType.id !== undefined;
    const ticketTypeToSave = {
      ...ticketType,
      ...(!editTicketType && { id: generateId() }),
    };
    saveTicketType({
      ticketType: ticketTypeToSave,
      editTicketType: editTicketType,
    });

    messageApi.destroy('update-ticket-loading');
    if (isError) {
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

    // Refetch ticket types after saving
    await refetch();
    setOpen(false);
  }

  function deleteTicket(index: number) {
    // Implementation will need to be updated to use an API call
    // and then refetch the data
    console.warn('Delete functionality needs to be implemented');
  }

  function showDrawer(ticket: TicketType | null) {
    setSelectedTicket(ticket);
    setOpen(true);
  }

  const closeCompTicketTypeDrawer = () => {
    setCompTicketModalOpen(false);
  };

  return (
    <div>
      {contextHolder}
      <div className="w-full md:max-w-2xl mr-8">
        {isLoading ? (
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
                onClick={() => {
                  const startDate = new Date();
                  startDate.setMinutes(0, 0, 0);
                  const endDate = new Date();
                  endDate.setHours(startDate.getHours() + 4);
                  endDate.setMinutes(0, 0, 0);
                  // Intialize a new ticket with default values
                  // ID will be generated when saved
                  const ticket: TicketType = {
                    eventId: eventId,
                    saleEndDate: endDate,
                    saleStartDate: startDate,
                    ticketingFees: TicketFeeStructure.PASS_TICKET_FEES,
                  };
                  showDrawer(ticket);
                }}
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
                renderItem={(item: TicketType, index) => (
                  <List.Item
                    actions={[
                      <Button onClick={() => showDrawer(item)} key="edit">
                        Edit
                      </Button>,
                      // TODO: Uncomment this when delete functionality is implemented
                      // <Popconfirm
                      //   key="delete"
                      //   title="Delete this ticket"
                      //   description="Are you sure to delete this ticket?"
                      //   className="time-picker-button"
                      //   onConfirm={() => deleteTicket(index)}
                      //   okText="Yes"
                      //   cancelText="No"
                      // >
                      //   <Button danger>Delete</Button>
                      // </Popconfirm>,
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
        onClose={() => {
          setOpen(false);
          setSelectedTicket(null);
        }}
        open={open}
      >
        {selectedTicket && (
          <TicketForm
            selectedTicket={selectedTicket}
            saveTicket={saveTicket}
            onClose={() => {
              setOpen(false);
              setSelectedTicket(null);
            }}
          />
        )}
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
          onClose={() => setCompTicketModalOpen(false)}
        />
      </Drawer>
    </div>
  );
}
