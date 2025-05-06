'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import { getFormattedCurrency } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { Event } from '../page';

interface EventDisplayProps {
  name: string;
  displayDate: string;
  displayPrice: string;
  venue: string | null;
  imageUrl: string;
  altText: string;
}

export default function EventCard({ event }: { event: Event }) {
  const isMobile = useIsMobile();

  const displayPrice =
    event.ticketTypes && event.ticketTypes.length > 0
      ? 'From ' + getFormattedCurrency(event.ticketTypes[0].price) + ' USD'
      : 'No tickets available';

  const displayDate = new Date(event.startDate).toDateString();

  const displayImageUrl =
    event.imageUrl ?? 'https://placehold.co/400x400?text=Add+Event+Flyer';

  const altText = `Flyer for ${event.name}`;

  const cardProps: EventDisplayProps = {
    name: event.name,
    displayDate: displayDate,
    displayPrice: displayPrice,
    venue: event.venue,
    imageUrl: displayImageUrl,
    altText: altText,
  };

  const eventUrl = `/event/${event.id}`;

  return (
    <Link
      href={eventUrl}
      className="block cursor-pointer group"
      aria-label={`View details for ${event.name}`}
    >
      {isMobile ? (
        <MobileEventCard {...cardProps} />
      ) : (
        <DesktopEventCard {...cardProps} />
      )}
    </Link>
  );
}

function MobileEventCard(props: EventDisplayProps) {
  const imageSize = 125;

  return (
    <div className="flex p-2 border-b border-gray-200 group-hover:bg-gray-50 transition-colors duration-150">
      <div className="flex-shrink-0 w-[125px] h-[125px]">
        <Image
          width={imageSize}
          height={imageSize}
          className="rounded object-cover w-full h-full"
          src={props.imageUrl}
          alt={props.altText}
        />
      </div>
      <div className="ml-4 my-auto overflow-hidden">
        <div className="font-bold text-xl truncate">{props.name}</div>
        <div className="text-blue-500 text-base mt-1">{props.displayDate}</div>
        <div className="text-green-700 text-base mt-1">
          {props.displayPrice}
        </div>
        {props.venue && (
          <div className="text-base text-gray-600 mt-1 truncate">
            {props.venue}
          </div>
        )}
      </div>
    </div>
  );
}

function DesktopEventCard(props: EventDisplayProps) {
  return (
    <div
      className="relative rounded-md overflow-hidden h-[300px] group-hover:shadow-xl transition-shadow duration-150"
      style={{
        backgroundImage: `url("${props.imageUrl}")`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="py-2 px-4 bg-white bg-opacity-90 absolute inset-x-0 bottom-0">
        <div className="font-bold text-base">{props.name}</div>
        <p className="text-blue-500 text-sm">{props.displayDate}</p>
        <p className="text-green-700 text-sm">{props.displayPrice}</p>
        {props.venue && (
          <p className="text-gray-700 text-sm truncate">{props.venue}</p>
        )}
      </div>
    </div>
  );
}
