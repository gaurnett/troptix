import { TicketDetail } from "@/components/TicketDetail";
import { useFetchEvent } from "@/hooks/useFetchEvent";
import Image from "next/image";
import { useRouter } from "next/router";

export default function EventDetailPage() {
  const router = useRouter();
  const eventIndex = 1;

  const { event, isLoading, isError } = useFetchEvent(eventIndex);
  const ticketTypes = event.ticketTypes;

  if (isLoading) {
    return;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      <div className="flex flex-wrap md:flex-nowrap mb-6">
        <Image
          width={150}
          height={150}
          src={event.imageUrl}
          alt={event.name}
          className="w-full md:w-1/2 rounded-md shadow-md mb-4 md:mb-0 md:mr-6"
        />
        <div>
          <h1 className="text-2xl font-bold mb-2">{event.name}</h1>
          <p className="text-gray-600 mb-4">Organized by {event.organizer}</p>
          <p className="mb-4">{event.description}</p>
          <p className="mb-2">
            <span className="font-semibold">Date:</span> {event.startDate}
          </p>
          <p>
            <span className="font-semibold">Location:</span> {event.country}
          </p>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-center mb-2">Tickets:</h2>
      <ul className="">
        {/* {ticketTypes.map((ticket: any, index: number) => (
          <TicketDetail
            key={index}
            ticketName={ticket.name}
            price={ticket.price}
            description={ticket.description}
            onAdd={() => { }}
          />
          // <li key={index} className="m-2 px-4 py-2 bg-gray-200 rounded-md">
          //   {ticket.name}: ${ticket.price.toFixed(2)}
          // </li>
        ))} */}
      </ul>
    </div>
  );
}
