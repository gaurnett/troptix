import { TropTixContext } from "@/components/WebNavigator";
import { Avatar, Button, Card, Typography, List, QRCode, Spin, Image, Table } from "antd";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from 'react';
import { TicketSummary, TicketsSummary, getOrders, Ticket, getTicketsForUser, GetOrdersType, GetOrdersRequest } from 'troptix-api';
import { format } from 'date-fns';
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { IoMdArrowRoundBack } from "react-icons/io";
import Link from "next/link";
import { ColumnsType } from "antd/es/table";

const { Text } = Typography;
interface DataType {
  key: string;
  name: string;
  price: number;
  fee: number;
  subtotal: number;
}

export default function OrderConfirmationPage() {
  const router = useRouter();
  const carouselRef = useRef<any>();
  const orderId = router.query.orderId;
  const { user } = useContext(TropTixContext);
  const [isFetchingOrders, setIsFetchingOrders] = useState(true);
  const [order, setOrder] = useState<any>({});

  useEffect(() => {
    async function fetchOrders() {
      try {
        const getOrdersRequest: any = {
          getOrdersType: GetOrdersType.GET_ORDER_BY_ID,
          orderId: orderId
        }
        const response = await getOrders(getOrdersRequest);

        if (response !== undefined) {
          setOrder(response);
        }
      } catch (error) {
      }

      setIsFetchingOrders(false);
    };

    fetchOrders();
  }, [orderId]);

  const columns: ColumnsType<DataType> = [
    {
      title: 'Ticket Name',
      dataIndex: 'name',
    },
    {
      title: 'Price',
      dataIndex: 'price',
    },
    {
      title: 'Fee',
      dataIndex: 'fee',
    },
    {
      title: 'Subtotal',
      dataIndex: 'subtotal',
    },
  ];

  const data: DataType[] = [
    {
      key: '1',
      name: 'Early Bird',
      price: 150,
      fee: 15,
      subtotal: 165,
    },
    {
      key: '2',
      name: 'General Admission',
      price: 300,
      fee: 30,
      subtotal: 330,
    },
    {
      key: '3',
      name: 'All Inclusive VIP',
      price: 1500,
      fee: 150,
      subtotal: 1650,
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

  return (
    <div className="md:mt-8 md:mb-8 w-full md:max-w-3xl mx-auto">
      {
        isFetchingOrders ?
          <Spin className="mt-16" tip="Fetching Order" size="large">
            <div className="content" />
          </Spin> :
          <div className="border px-4">
            <div className='flex w-full md:max-w-2xl md:mx-auto my-6'>
              <div>
                <Image src={"/logos/logo_v1.png"} width={75} height={75} alt='troptix-logo' />
              </div>
              <div className="w-full text-right my-auto">
                <div className="text-sm md:text-md font-bold">Order #{String(orderId).toUpperCase().slice(3)}</div>
                <div className="text-sm md:text-md font-bold">Gaurnett Flowers</div>
                <div className="text-sm md:text-md font-bold">Sunday, November 12, 2023</div>
              </div>
            </div>
            <div className="mx-4 text-center text-4xl font-extrabold leading-tighter tracking-tighter mb-4" data-aos="zoom-y-out"><span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">{order.event.name}</span></div>

            <div className="w-full md:max-w-2xl mx-auto">
              <div className="md:flex">
                <div className="w-full text-center">
                  <Image
                    width={250}
                    height={250}
                    className="w-auto"
                    style={{ objectFit: 'cover' }}
                    src={order.event.imageUrl}
                    alt={"event flyer image"} />
                </div>
                <div className="w-full">
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
                  <div className="text-center">
                    <Image
                      preview={false}
                      width={50}
                      height={50}
                      className="w-full mx-auto justify-center content-center items-center"
                      style={{ objectFit: 'contain' }}
                      src={"/icons/wallet.png"}
                      alt={"mobile wallet image"} />
                    <div>Add to mobile wallet</div>
                  </div>
                  <div className="text-center ml-16">
                    <Image
                      preview={false}
                      width={50}
                      height={50}
                      className="w-auto"
                      style={{ objectFit: 'contain' }}
                      src={"/icons/tickets.png"}
                      alt={"tickets image"} />
                    <div>View your tickets</div>
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
                        let totalPrice = 0;
                        let totalFees = 0;
                        let total = 0

                        pageData.forEach(({ price, fee }) => {
                          totalPrice += price;
                          totalFees += fee;
                          total += price + fee;
                        });

                        return (
                          <>
                            <Table.Summary.Row>
                              <Table.Summary.Cell className="font-bold" index={0}>Total</Table.Summary.Cell>
                              <Table.Summary.Cell className="font-bold" index={1}>
                                <Text>{totalPrice}</Text>
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
                  <p className="block text-gray-800 text-base font-base">Gaurnett Flowers</p>
                  <p className="block font-light">309 Gold Street</p>
                  <p className="block font-light">APT 8E</p>
                  <p className="block font-light">Brooklyn, NY, 11201</p>
                  <p className="block font-light">United States</p>
                  <p className="block text-gray-800 text-base font-base mt-4">Phone number: 786-657-4159</p>
                  <p className="block text-gray-800 text-base font-base">Email: flowersgaurnett@gmail.com</p>

                </div>
              </div>
            </div>
          </div>
      }

    </div>
  );
}