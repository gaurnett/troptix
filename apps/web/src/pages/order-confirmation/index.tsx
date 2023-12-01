import { Spinner } from "@/components/ui/spinner";
import { useFetchOrderById } from "@/hooks/useOrders";
import { Result, Table, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import { format } from 'date-fns';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from 'react';
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

export default function OrderConfirmationPage() {
  const router = useRouter();
  const orderId = router.query.orderId as string;
  const [isFetchingOrders, setIsFetchingOrders] = useState(true);
  const [data, setData] = useState<DataType[]>([]);

  const {
    isPending,
    isError,
    data: order,
    error,
  } = useFetchOrderById({
    getOrdersType: GetOrdersType.GET_ORDER_BY_ID,
    id: orderId,
  });

  useEffect(() => {
    if (!order) return;
    const orderMap = new Map<string, any>();
    console.log(JSON.stringify(order.tickets));
    order.tickets.forEach(ticket => {
      const ticketId = ticket.ticketsType === "COMPLEMENTARY" ? "Complementary" : ticket.ticketType.id;
      const ticketName = ticket.ticketsType === "COMPLEMENTARY" ? "Complementary" : ticket.ticketType.name;

      if (orderMap.has(ticketId)) {
        const orderRow = orderMap.get(ticketId);
        orderMap.set(ticketId, {
          ...orderRow,
          quantity: orderRow.quantity + 1,
          total: orderRow.total + ticket.total,
          fee: orderRow.fee + ticket.fees,
          subtotal: orderRow.subtotal + ticket.subtotal,
        });
      } else {
        orderMap.set(ticketId, {
          key: ticket.id,
          name: ticketName,
          quantity: 1,
          total: ticket.total,
          fee: ticket.fees,
          subtotal: ticket.subtotal,
        });
      }
    });

    setData(Array.from(orderMap.values()));
    setIsFetchingOrders(false);
  }, [order])

  const columns: ColumnsType<DataType> = [
    {
      title: 'Ticket Name',
      dataIndex: 'name',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
    },
    {
      title: 'Price',
      dataIndex: 'subtotal',
    },
    {
      title: 'Fee',
      dataIndex: 'fee',
    },
    {
      title: 'Total',
      dataIndex: 'total',
    },
  ];


  function getDateFormatted(date, time) {
    return format(new Date(date), 'MMM dd, yyyy') + ", " + format(new Date(time), 'hh:mm a');
  }

  function renderTicketRow(label, value) {
    return (
      <div className="mt-2 mb-2">
        <label className="block text-gray-800 text-base font-bold">{label}</label>
        <p className="text-base">{value}</p>
      </div>
    )
  }

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
    <div className="mt-32 md:mb-8 w-full md:max-w-3xl mx-auto">
      <div className="border px-4">
        <div className='flex w-full md:max-w-2xl md:mx-auto my-6'>
          <div>
            {/* <Image src={"/logos/logo_v1.png"} width={75} height={75} alt='troptix-logo' /> */}
          </div>
          <div className="w-full text-right my-auto">
            <div className="text-sm md:text-md font-bold">Order #{String(orderId).toUpperCase()}</div>
            <div className="text-sm md:text-md font-bold">{order.name}</div>
            <div className="text-sm md:text-md font-bold">{new Date(order.createdAt).toDateString()}</div>
          </div>
        </div>
        <div className="mx-4 text-center text-4xl font-extrabold leading-tighter tracking-tighter mb-8" data-aos="zoom-y-out"><span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">{order.event.name}</span></div>

        <div className="w-full md:max-w-2xl mx-auto">
          <div className="md:flex">
            <div className="w-full flex justify-center text-center">
              <Image
                width={250}
                height={250}
                className="w-auto"
                style={{ objectFit: 'cover' }}
                src={order.event.imageUrl}
                alt={"event flyer image"} />
            </div>
            <div className="w-full md:ml-8 mt-8 md:mt-0">
              {renderTicketRow("Start Date", getDateFormatted(order.event.startDate, order.event.startTime))}
              {renderTicketRow("End Date", getDateFormatted(order.event.endDate, order.event.endTime))}
              {renderTicketRow("Event Venue", order.event.venue)}
              {renderTicketRow("Event Address", order.event.address)}
            </div>
          </div>
        </div>

        <div className="w-full md:max-w-2xl mx-auto mb-8">
          <div className="mx-auto">
            <div className="flex justify-center mt-8 mx-auto w-full">
              <div className="text-center justify-center">
                <Link className="mx-auto text-center" target="_blank" href={{ pathname: '/tickets', query: { orderId: orderId } }}>
                  <div className="w-full flex justify-center text-center">
                    <Image
                      width={50}
                      height={50}
                      className="w-auto"
                      style={{ objectFit: 'contain' }}
                      src={"/icons/tickets.png"}
                      alt={"tickets image"} />
                  </div>
                  <div className="mt-2">View your tickets</div>
                </Link>

              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:max-w-2xl mx-auto mb-4">
          <div className="mx-auto w-full">
            <div className="">
              <div>
                <Table
                  columns={columns}
                  dataSource={data}
                  pagination={false}
                  bordered
                  summary={(pageData) => {
                    let totalSubtotal = 0;
                    let totalFees = 0;
                    let total = 0
                    let totalQuantity = 0

                    pageData.forEach(({ quantity, subtotal, fee }) => {
                      totalQuantity += quantity;
                      totalSubtotal += subtotal;
                      totalFees += fee;
                    });
                    total = totalSubtotal + totalFees;

                    return (
                      <>
                        <Table.Summary.Row>
                          <Table.Summary.Cell className="font-bold" index={0}>Total</Table.Summary.Cell>
                          <Table.Summary.Cell className="font-bold" index={1}>
                            <Text>{totalQuantity}</Text>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell className="font-bold" index={1}>
                            <Text>{totalSubtotal}</Text>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell className="font-bold" index={2}>
                            <Text>{totalFees}</Text>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell className="font-bold" index={3}>
                            <Text>{total}</Text>
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                      </>
                    );
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:max-w-2xl mx-auto">
          <div className="md:flex md:justify-between">
            <div className="mb-4 md:mr-4 w-full">
              <p className="block text-gray-800 text-bold font-bold">Billing Details</p>
              <p className="block text-gray-800 text-base font-base">{order.name}</p>
              <p className="block font-light">{order.billingAddress1}</p>
              <p className="block font-light">{order.billingAddress2}</p>
              <p className="block font-light">{order.billingCity}, {order.billingState}, {order.billingZip}</p>
              <p className="block font-light">{order.billingCountry}</p>
              <p className="block text-gray-800 text-base font-base">Email: {order.email}</p>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}