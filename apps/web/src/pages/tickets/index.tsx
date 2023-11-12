import { TropTixContext } from "@/components/WebNavigator";
import { Avatar, Button, Card, Carousel, List, QRCode, Spin } from "antd";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from 'react';
import { TicketSummary, TicketsSummary, getOrders, Ticket, getTicketsForUser, GetOrdersType, GetOrdersRequest } from 'troptix-api';
import { format } from 'date-fns';
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { IoMdArrowRoundBack } from "react-icons/io";

export default function TicketsPage() {
  const router = useRouter();
  const carouselRef = useRef<any>();
  const orderId = router.query.orderId;
  const { user } = useContext(TropTixContext);
  const [isFetchingOrders, setIsFetchingOrders] = useState(true);
  const [order, setOrder] = useState<any>();

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

  function goNext() {
    carouselRef.current.next();
  }

  function goBack() {
    carouselRef.current.prev();
  }

  function goToOrders() {
    router.back();
  }

  function getDateFormatted(date, time) {
    return format(new Date(date), 'MMM dd, yyyy') + ", " + format(new Date(time), 'hh:mm a');
  }

  function renderTicketRow(label, value) {
    return (
      <div className="mt-2 mb-2">
        <label className="block text-gray-800 text-base font-base">{label}</label>
        <p className="text-base font-thin">{value}</p>
      </div>
    )
  }
  function renderTicket(ticket: any, event: any, index: number, count: number) {
    return (
      <div className="" key={index}>
        <div className="mx-auto w-full h-full">
          <div className="flex justify-center">
            {
              count > 1 ?
                <div onClick={goBack} className="my-auto">
                  <MdOutlineKeyboardArrowLeft className="text-4xl" />
                </div>
                : <></>
            }
            <div className={`${count === 1 ? 'mx-4' : ''} py-4 grow px-4 rounded-xl ${ticket.status === "NOT_AVAILABLE" ? 'bg-red-300' : 'bg-green-300'}`}>
              <div className="mb-2 text-center">Ticket {index + 1} of {count}</div>
              <QRCode bgColor="white" className="mx-auto" value={ticket.id} />
              {renderTicketRow("Name", "Gaurnett Flowers")}
              {renderTicketRow("Event", event.name)}
              {renderTicketRow("Ticket", ticket.ticketType.name)}
              {renderTicketRow("Start Date", getDateFormatted(event.startDate, event.startTime))}
              {renderTicketRow("End Date", getDateFormatted(event.endDate, event.endTime))}
              {renderTicketRow("Event Venue", event.venue)}
              <div className="mb-4">
                {renderTicketRow("Event Address", event.address)}
              </div>
            </div>
            {
              count > 1 ?
                <div onClick={goNext} className="my-auto">
                  <MdOutlineKeyboardArrowRight className="text-4xl" />
                </div>
                : <></>
            }
          </div>
        </div>
      </div>
    )

  }

  return (
    <div className="mt-32 w-full md:max-w-3xl mx-auto">
      {
        isFetchingOrders ?
          <Spin className="mt-16" tip="Fetching Tickets" size="large">
            <div className="content" />
          </Spin> :
          <div>
            <h1 className="mx-4 text-center text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4" data-aos="zoom-y-out"><span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-teal-400">{order.event.name}</span></h1>
            <div className='flex w-full md:max-w-lg md:mx-auto my-6 mx-4'>
              <a className='justify-center align-middle my-auto' style={{ cursor: 'pointer' }} onClick={goToOrders}>
                <IoMdArrowRoundBack className="text-2xl mr-4" />
              </a>
              <Button className="px-4 py-4 shadow-md items-center justify-center font-medium inline-flex">View Event Details</Button>

            </div>
            <div className="w-full md:max-w-lg mx-auto mb-4">
              <div className="mx-auto w-full h-full">
                <div className="flex-inline justify-center">
                  <div className='w-full'>
                    <Carousel ref={carouselRef} arrows={true} draggable={true}>
                      {
                        order.tickets.map((ticket: any, index: number) => {
                          return (
                            renderTicket(ticket, order.event, index, order.tickets.length)
                          );
                        })
                      }
                    </Carousel>
                  </div>
                </div>
              </div>


            </div>
          </div>
      }

    </div>
  );
}