import EditTicketForm from "@/components/pages/order-details/edit-ticket-form";
import { Spinner } from "@/components/ui/spinner";
import { Ticket } from "@/hooks/types/Ticket";
import { useFetchOrderById } from "@/hooks/useOrders";
import { PostTicketRequest, PostTicketType, useCreateTicket } from "@/hooks/useTicket";
import { getDateFormatter, getFormattedCurrency } from "@/lib/utils";
import { Button, Drawer, List, Result, Typography, message } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from 'react';
import { GetOrdersType } from 'troptix-api';

const { Text } = Typography;
interface DataType {
  key: string;
  name: string;
  quantity: number;
  total: number;
  fee: number;
  subtotal: number;
}

export default function OrderDetailsPage() {
  const router = useRouter();
  const orderId = router.query.orderId as string;
  const [isFetchingOrders, setIsFetchingOrders] = useState(true);
  const [data, setData] = useState<DataType[]>([]);

  const [selectedTicket, setSelectedTicket] = useState<Ticket>();
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const createTicket = useCreateTicket();

  const {
    isPending,
    isError,
    data: order,
    error,
  } = useFetchOrderById({
    getOrdersType: GetOrdersType.GET_ORDER_BY_ID,
    id: orderId,
  });

  console.log(order);

  async function saveTicket() {
    messageApi
      .open({
        key: 'update-ticket-loading',
        type: 'loading',
        content: 'Updating Ticket..',
        duration: 0,
      });

    const request: PostTicketRequest = {
      type: PostTicketType.UPDATE_NAME,
      ticket: selectedTicket
    }

    const response = await createTicket.mutateAsync({ request });

    messageApi.destroy('update-ticket-loading');
    // if (response === null || response === undefined || response.error !== null) {
    //   messageApi.open({
    //     type: 'error',
    //     content: 'Failed to save ticket, please try again.',
    //   });
    //   return;
    // }

    messageApi.open({
      type: 'success',
      content: 'Successfully saved ticket.',
    });

    // if (selectedIndex === -1) {
    //   setTicketTypes([...ticketTypes, selectedTicket])
    // } else {
    //   const updatedTickets = ticketTypes.map((ticketType, i) => {
    //     if (ticketType.id === selectedTicket.id) {
    //       return selectedTicket;
    //     } else {
    //       return ticketType;
    //     }
    //   });
    //   setTicketTypes(updatedTickets);
    // }

    setModalOpen(false);
  }

  function showDrawer(ticket: any, index: number) {
    setSelectedTicket(ticket);
    setSelectedIndex(index);
    setModalOpen(true);
  };

  const onClose = () => {
    setModalOpen(false);
  };

  if (isPending) {
    return (
      <div className="mt-32">
        <Spinner text={"Fetching Tickets"} />
      </div>
    )
  }

  if (!order) {
    return (
      <Result
        status="error"
        title="No Order Found"
        className="mt-32"
        subTitle="No order found with that Order ID."
      />
    )
  }


  return (
    <div className="mt-32 md:mb-8 w-full md:max-w-4xl mx-auto">
      {contextHolder}
      <div className={`mx-auto p-4 sm:p-8`}>
        <h1
          className="text-5xl md:text-5xl font-extrabold leading-tighter tracking-tighter mb-4"
          data-aos="zoom-y-out">
          Order for {" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400 pr-4">
            {order.event.name}
          </span>
        </h1>
        <div className="md:flex md:mt-12">
          <aside className="md:w-2/5">
            <h2 className="text-2xl font-bold leading-tighter tracking-tighter md:mb-4" data-aos="zoom-y-out">Order Details</h2>
            <div className="text-base">Order #{orderId}</div>

            <div className="text-base">Placed: {getDateFormatter(new Date(order.createdAt))}</div>
            <div className="text-base">Event Information: {getDateFormatter(new Date(order.event.startDate))}</div>
            <div className="text-base">{order.event.venue}</div>
            <div>
              <Link target="_blank" href={{ pathname: "/tickets", query: { orderId: order.id } }}>
                <Button
                  type="primary"
                  className="w-full px-6 py-6 shadow-md items-center bg-blue-600 hover:bg-blue-700 justify-center font-medium inline-flex mt-4">
                  View Tickets
                </Button>
              </Link>
            </div>
            <div>
              <Link target="_blank" href={{ pathname: "/tickets", query: { orderId: order.id } }}>
                <Button
                  className="w-full px-6 py-6 shadow-md items-center justify-center font-medium inline-flex mt-4">
                  View Order Confirmation
                </Button>
              </Link>
            </div>
          </aside>
          <div className="mt-8 md:mt-0 md:ml-12 grow">
            <h2 className="text-2xl font-bold leading-tighter tracking-tighter" data-aos="zoom-y-out">Tickets Details</h2>
            <div>
              <List
                className="demo-loadmore-list w-full grow m-0"
                itemLayout="horizontal"
                dataSource={order.tickets}
                renderItem={(ticket: any, index) => (
                  <List.Item
                    actions={[
                      <Button onClick={() => showDrawer(ticket, index)} key="edit">Edit</Button>]}>
                    <div>
                      <p className="text-base">{ticket.ticketType.name}</p>
                      <p className="text-base">{ticket.firstName} {ticket.lastName}</p>
                      <p className="text-base">{ticket.email}</p>
                      <div className="text-base text-green-700">{getFormattedCurrency(ticket.ticketType.price)}</div>
                    </div>
                  </List.Item>
                )}
              />
            </div>
          </div>
        </div>
      </div>
      <Drawer width={500} title="Edit Ticket" placement="right" onClose={onClose} open={modalOpen}>
        <EditTicketForm selectedTicket={selectedTicket} setSelectedTicket={setSelectedTicket} saveTicket={saveTicket} />
      </Drawer>
    </div>
  );
}