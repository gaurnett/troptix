import { Spinner } from "@/components/ui/spinner";
import { GetOrdersType, useFetchOrderById } from "@/hooks/useOrders";
import { Button, Carousel, Divider, QRCode } from "antd";
import { format } from 'date-fns';
import JsPDF from 'jspdf';
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef } from 'react';
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";

export default function TicketsPage() {
  const router = useRouter();
  const carouselRef = useRef<any>();
  const orderId = router.query.orderId as string;

  const {
    isPending,
    isError,
    data: order,
    error,
  } = useFetchOrderById({
    getOrdersType: GetOrdersType.GET_ORDER_BY_ID,
    id: orderId,
  });

  function goNext() {
    carouselRef.current.next();
  }

  function goBack() {
    carouselRef.current.prev();
  }

  function getDateFormatted(date, time) {
    return format(new Date(date), 'MMM dd, yyyy') + ", " + format(new Date(time), 'hh:mm a');
  }

  function saveToPdf() {
    const element = document.querySelector('#ticket') as HTMLElement;

    if (element === null) {
      return;
    } else {
      const report = new JsPDF('portrait', 'pt', 'letter');
      report.html(element).then(() => {
        report.output('dataurlnewwindow');
      });
    }

  }

  function renderTicketRow(label, value) {
    return (
      <div className="mt-2 mb-2">
        <label className="block text-base font-base text-blue-500">{label}</label>
        <p className="text-base">{value}</p>
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
                  <MdOutlineKeyboardArrowLeft className="text-2xl" />
                </div>
                : <></>
            }
            <div id="ticket" className={`${count === 1 ? 'mx-4' : ''} py-4 grow px-4 rounded-xl border`}>
              <QRCode size={125} bgColor="white" className="mx-auto" value={ticket.id} />
              <Divider dashed={true} plain>
                Ticket {index + 1} of {count}
              </Divider>
              <div className="mt-2 mb-2">
                <label className="block text-base font-base text-blue-500">Name</label>
                <p className="text-2xl font-bold">Gaurnett Flowers</p>
              </div>
              {renderTicketRow("Event", event.name)}
              {renderTicketRow("Ticket", ticket.ticketType.name)}
              {renderTicketRow("Start Date", getDateFormatted(event.startDate, event.startTime))}
              {renderTicketRow("End Date", getDateFormatted(event.endDate, event.endTime))}
              {renderTicketRow("Event Venue", event.venue)}
              {renderTicketRow("Event Address", event.address)}
              <Divider style={{ height: "16px" }} dashed={true} plain>Order Details</Divider>
              {renderTicketRow("Order number", `#${String(order.id).toUpperCase()}`)}
              {renderTicketRow("Event Organizer", event.organizer)}
              <div className="mb-4">
              </div>
            </div>
            {
              count > 1 ?
                <div onClick={goNext} className="my-auto">
                  <MdOutlineKeyboardArrowRight className="text-2xl" />
                </div>
                : <></>
            }
          </div>
        </div>
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

  return (
    <div className="mt-32 mb-8 w-full md:max-w-3xl mx-auto">
      <div>
        <h1 className="mx-4 text-center text-4xl md:text-4xl font-extrabold leading-tighter tracking-tighter mb-4" data-aos="zoom-y-out">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">{order.event.name}</span>
        </h1>
        <div className='flex w-full md:max-w-lg md:mx-auto my-6 mx-auto justify-center'>
          <Button onClick={saveToPdf} className="px-4 py-4 shadow-md items-center justify-center font-medium inline-flex">Save PDF</Button>
          <Link target="_blank" href={{ pathname: "/event", query: { eventId: order.event.id } }}>
            <Button className="ml-4 px-4 py-4 shadow-md items-center justify-center font-medium inline-flex">View event details</Button>

          </Link>
        </div>
        <div className="w-full md:max-w-lg mx-auto">
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

    </div>
  );
}