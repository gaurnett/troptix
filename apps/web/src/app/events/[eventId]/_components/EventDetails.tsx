'use client';

import TicketDrawer from './ticket-drawer';
import TicketModal from './ticket-modal';
import { ButtonWithIcon } from '@/components/ui/button';
import {
  DividerWithText,
  TypographyH1,
  TypographyH4,
  TypographyP,
} from '@/components/ui/typography';
import { useScreenSize } from '@/hooks/useScreenSize';

import { getDateRangeFormatter, getTimeRangeFormatter } from '@/lib/dateUtils';
import { getFormattedCurrency } from '@/lib/utils';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';

import { Calendar, DollarSign, MapPin, Ticket } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { EventById } from '../page';
import { Banner } from '@/components/ui/banner';

export default function EventDetail({ event }: { event: EventById }) {
  const googleMapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const { isMobile } = useScreenSize();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const isDraft = event.isDraft;
  function closeModal() {
    setIsTicketModalOpen(false);
  }

  function openModal() {
    setIsTicketModalOpen(true);
  }
  const displayImageUrl =
    event.imageUrl ?? 'https://placehold.co/400x400?text=Add+Event+Flyer';

  const displayPrice =
    event.ticketTypes && event.ticketTypes.length > 0
      ? 'From ' + getFormattedCurrency(event.ticketTypes[0].price) + ' USD'
      : 'No tickets available';

  return (
    <>
      {isDraft && (
        <div className="relative z-50">
          <Banner
            title="Draft Mode: Event Not Published"
            message="This event is currently a draft. Only you, as the organizer, can view it. Make any changes you need, then publish when you're ready to go live."
            type="warning"
          />
        </div>
      )}
      
      {/* Main Event Section */}
      <div className="relative min-h-screen bg-gradient-to-br from-background via-accent/5 to-background">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("${displayImageUrl}")`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-background/85 via-background/70 to-accent/30 backdrop-blur-sm"></div>
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-48 h-48 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-primary/15 to-chart-1/15 blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-chart-2/15 to-chart-3/15 blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-accent/20 to-primary/15 blur-3xl"></div>
        </div>

        {/* Ticket Modals */}
        {isMobile ? (
          <TicketDrawer
            event={event}
            isTicketModalOpen={isTicketModalOpen}
            onClose={closeModal}
          />
        ) : (
          <TicketModal
            event={event}
            isTicketModalOpen={isTicketModalOpen}
            onClose={closeModal}
          />
        )}

        {/* Main Content */}
        <div className="relative z-10 w-full min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-16">
            <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
              {/* Event Image and Ticket Button */}
              <aside className="lg:col-span-2 lg:sticky lg:top-32 self-start">
                <div className="relative mb-8 group">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-chart-1/20 blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <Image
                    height={500}
                    width={500}
                    src={displayImageUrl}
                    alt={event.name}
                    className="relative w-full max-w-md mx-auto rounded-2xl shadow-2xl object-cover aspect-square group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div className="relative">
                  <Button
                    onClick={openModal}
                    className="w-full py-4 px-6 text-lg font-semibold bg-gradient-to-r from-primary to-chart-2 text-primary-foreground hover:from-chart-1 hover:to-chart-3 hover:shadow-2xl transform hover:scale-105 transition-all duration-300 rounded-full border-0"
                  >
                    <Ticket className="mr-3 h-5 w-5" />
                    Buy Tickets
                  </Button>
                </div>
              </aside>

              {/* Event Information */}
              <div className="lg:col-span-3 space-y-8">
                {/* Header Section */}
                <div className="relative p-6 md:p-8 bg-gradient-to-br from-card/80 to-background/60 backdrop-blur-md rounded-2xl border border-primary/20 shadow-2xl">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-chart-1 bg-clip-text text-transparent leading-tight">
                    {event.name}
                  </h1>
                  
                  {/* Event Meta Information */}
                  <div className="space-y-4">
                    {/* Date & Time */}
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-chart-1/20 border border-primary/30">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg text-foreground mb-1">
                          {getDateRangeFormatter(
                            new Date(event.startDate),
                            new Date(event.endDate)
                          )}
                        </h4>
                        <p className="text-muted-foreground">
                          {getTimeRangeFormatter(
                            new Date(event.startDate),
                            new Date(event.endDate)
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-chart-2/20 to-chart-3/20 border border-chart-2/30">
                        <MapPin className="w-5 h-5 text-chart-2" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg text-foreground mb-1">{event.venue}</h4>
                        <p className="text-muted-foreground">{event.address}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-chart-4/20 to-chart-5/20 border border-chart-4/30">
                        <DollarSign className="w-5 h-5 text-chart-4" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg text-foreground mb-1">Tickets</h4>
                        <p className="bg-gradient-to-r from-chart-4 to-chart-5 bg-clip-text text-transparent font-semibold">
                          {displayPrice}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Organizer */}
                  <div className="mt-6 pt-6 border-t border-primary/20">
                    <p className="text-lg font-semibold bg-gradient-to-r from-muted-foreground to-primary bg-clip-text text-transparent">
                      Organized by {event.organizer}
                    </p>
                  </div>
                </div>

                {/* Event Description */}
                <div className="relative p-6 md:p-8 bg-gradient-to-br from-card/80 to-background/60 backdrop-blur-md rounded-2xl border border-primary/20 shadow-xl">
                  <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                    Event Details
                  </h2>
                  <div
                    style={{ whiteSpace: 'pre-line' }}
                    className={`text-base leading-relaxed text-foreground ${
                      !isDescriptionExpanded ? 'line-clamp-4' : ''
                    }`}
                  >
                    {event.description}
                  </div>
                  {event.description && (
                    <Button
                      variant="link"
                      className="text-primary hover:text-chart-1 p-0 h-auto mt-3 font-medium"
                      onClick={() =>
                        setIsDescriptionExpanded(!isDescriptionExpanded)
                      }
                    >
                      {isDescriptionExpanded
                        ? 'Show less details'
                        : 'Read full description'}
                    </Button>
                  )}
                </div>

                {/* Venue Map */}
                <div className="relative p-6 md:p-8 bg-gradient-to-br from-card/80 to-background/60 backdrop-blur-md rounded-2xl border border-primary/20 shadow-xl">
                  <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                    Venue Location
                  </h2>
                  <div className="mb-4">
                    <h4 className="font-semibold text-lg text-foreground">{event.venue}</h4>
                    <p className="text-muted-foreground">{event.address}</p>
                  </div>
                  <div className="relative rounded-xl overflow-hidden border border-primary/20 shadow-lg">
                    <APIProvider apiKey={googleMapsKey!}>
                      <Map
                        className="w-full h-64 md:h-80"
                        defaultCenter={{
                          lat: event.latitude ?? 0,
                          lng: event.longitude ?? 0,
                        }}
                        defaultZoom={15}
                        gestureHandling={'cooperative'}
                        disableDefaultUI={false}
                      >
                        <Marker
                          position={{
                            lat: event.latitude ?? 0,
                            lng: event.longitude ?? 0,
                          }}
                        />
                      </Map>
                    </APIProvider>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
