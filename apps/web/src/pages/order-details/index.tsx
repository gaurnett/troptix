import { TropTixContext } from "@/components/WebNavigator";
import EditTicketForm from "@/components/pages/order-details/edit-ticket-form";
import { Spinner } from "@/components/ui/spinner";
import { Ticket } from "@/hooks/types/Ticket";
import { useFetchOrderById } from "@/hooks/useOrders";
import { PostTicketRequest, PostTicketType, useCreateTicket } from "@/hooks/useTicket";
import { getDateFormatter, getFormattedCurrency } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Drawer, List, Result, Typography, message } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from 'react';
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
  const { user } = useContext(TropTixContext);
  const orderId = router.query.orderId as string;

  const [selectedTicket, setSelectedTicket] = useState<Ticket>();
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const createTicket = useCreateTicket();
  const queryClient = useQueryClient();

  const {
    showSignInError,
    isPending,
    isError,
    data: order,
    error,
  } = useFetchOrderById({
    getOrdersType: GetOrdersType.GET_ORDER_BY_ID,
    id: orderId,
    jwtToken: user?.jwtToken
  });
  const tickets: any[] = order?.tickets;

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

    createTicket.mutate(request, {
      onSuccess: (data) => {
        const oldData = tickets[selectedIndex];
        tickets[selectedIndex] = {
          ...oldData,
          ...data,
        }

        queryClient.setQueryData(['order'], {
          ...order,
          ["tickets"]: tickets
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
    })

    messageApi.destroy('update-ticket-loading');
    messageApi.open({
      type: 'success',
      content: 'Successfully saved ticket.',
    });

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

  if (showSignInError) {
    return (
      <div className="mt-24">
        <Result
          icon={
            <div className="w-full flex justify-center text-center">
              <Image
                width={75}
                height={75}
                className="w-auto"
                style={{ objectFit: 'contain', width: 100 }}
                src={"/icons/tickets.png"}
                alt={"tickets image"} />
            </div>
          }
          title="Please sign in or sign up with the email used to view order details"
          extra={
            <div>
              <Link
                href={{ pathname: "/auth/signin" }}
                key={"login"}>
                <Button
                  className="mr-2 px-6 py-6 shadow-md items-center justify-center font-medium inline-flex">
                  Log in
                </Button>
              </Link>
              <Link
                href={{ pathname: "/auth/signup" }}
                key={"signup"}>
                <Button
                  type='primary'
                  className="bg-blue-600 hover:bg-blue-700 mr-2 px-6 py-6 shadow-md items-center justify-center font-medium inline-flex">
                  Sign up
                </Button>
              </Link>
            </div>
          }
        />
      </div>
    );
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
              <Link href={{ pathname: "/tickets", query: { orderId: order.id } }}>
                <Button
                  type="primary"
                  className="w-full px-6 py-6 shadow-md items-center bg-blue-600 hover:bg-blue-700 justify-center font-medium inline-flex mt-4">
                  View Tickets
                </Button>
              </Link>
            </div>
            <div>
              <Link href={{ pathname: "/order-confirmation", query: { orderId: order.id } }}>
                <Button
                  className="w-full px-6 py-6 shadow-md items-center justify-center font-medium inline-flex mt-4">
                  View Order Confirmation
                </Button>
              </Link>
            </div>
          </aside>
          <div className="mt-8 md:mt-0 md:ml-12 grow">
            <h2 className="text-2xl font-bold leading-tighter tracking-tighter" data-aos="zoom-y-out">Ticket Details</h2>
            <div>
              <List
                className="demo-loadmore-list w-full grow m-0"
                itemLayout="horizontal"
                dataSource={tickets}
                renderItem={(ticket: any, index) => {
                  const ticketName = ticket.ticketsType === "COMPLEMENTARY" ? "Complementary" : ticket.ticketType.name;
                  const ticketPrice = ticket.ticketsType === "COMPLEMENTARY" ? 0 : ticket.ticketType.price;

                  return (
                    <List.Item
                      actions={[
                        <Button onClick={() => showDrawer(ticket, index)} key="edit">Edit</Button>]}>
                      <div>
                        <p className="text-base">{ticketName}</p>
                        <p className="text-base">{ticket.firstName} {ticket.lastName}</p>
                        <p className="text-base">{ticket.email}</p>
                        <div className="text-base text-green-700">{getFormattedCurrency(ticketPrice)}</div>
                      </div>
                    </List.Item>
                  )
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <Drawer width={500} title="Edit Ticket" placement="right" onClose={onClose} open={modalOpen}>
        <EditTicketForm onClose={onClose} selectedTicket={selectedTicket} setSelectedTicket={setSelectedTicket} saveTicket={saveTicket} />
      </Drawer>
    </div>
  );
}