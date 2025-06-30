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

  const eventUrl = `/events/${event.id}`;

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
    <div className="flex p-4 bg-gradient-to-br from-card to-background border border-primary/10 rounded-xl group-hover:border-primary/30 group-hover:shadow-lg group-hover:bg-gradient-to-br group-hover:from-primary/5 group-hover:to-chart-1/10 transition-all duration-300 backdrop-blur-sm">
      <div className="flex-shrink-0 w-[125px] h-[125px] relative">
        <Image
          width={imageSize}
          height={imageSize}
          className="rounded-lg object-cover w-full h-full shadow-md group-hover:shadow-lg transition-shadow duration-300"
          src={props.imageUrl}
          alt={props.altText}
        />
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/10 to-chart-1/10 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
      </div>
      <div className="ml-4 my-auto overflow-hidden flex-1">
        <h3 className="font-bold text-lg sm:text-xl truncate text-foreground group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-chart-1 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
          {props.name}
        </h3>
        <div className="bg-gradient-to-r from-chart-2 to-chart-3 bg-clip-text text-transparent text-sm sm:text-base mt-1 font-medium">
          {props.displayDate}
        </div>
        <div className="bg-gradient-to-r from-chart-4 to-chart-5 bg-clip-text text-transparent text-sm sm:text-base mt-1 font-semibold">
          {props.displayPrice}
        </div>
        {props.venue && (
          <div className="text-sm sm:text-base text-muted-foreground mt-1 truncate">
            {props.venue}
          </div>
        )}
      </div>
    </div>
  );
}

function DesktopEventCard(props: EventDisplayProps) {
  return (
    <div className="relative rounded-xl overflow-hidden h-[320px] bg-gradient-to-br from-card to-background border border-primary/10 group-hover:border-primary/30 group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300 backdrop-blur-sm">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
        style={{
          backgroundImage: `url("${props.imageUrl}")`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent"></div>
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-chart-2/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Content */}
      <div className="relative h-full flex flex-col justify-end">
        <div className="p-4 bg-gradient-to-t from-background/95 via-background/80 to-transparent backdrop-blur-sm border-t border-primary/20">
          <h3 className="font-bold text-lg mb-2 text-foreground group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-chart-1 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 line-clamp-2">
            {props.name}
          </h3>
          <div className="space-y-1">
            <p className="bg-gradient-to-r from-chart-2 to-chart-3 bg-clip-text text-transparent text-sm font-medium">
              {props.displayDate}
            </p>
            <p className="bg-gradient-to-r from-chart-4 to-chart-5 bg-clip-text text-transparent text-sm font-semibold">
              {props.displayPrice}
            </p>
            {props.venue && (
              <p className="text-muted-foreground text-sm truncate">
                {props.venue}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Decorative corner element */}
      <div className="absolute top-3 right-3 w-6 h-6 bg-gradient-to-br from-primary to-chart-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"></div>
    </div>
  );
}
