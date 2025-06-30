import { Prisma } from '@prisma/client';

import EventCard from './_components/EventCard';
import prisma from '@/server/prisma';
import Image from 'next/image';
import * as React from 'react';

const EventSelect = {
  id: true,
  name: true,
  description: true,
  startDate: true,
  endDate: true,
  imageUrl: true,
  venue: true,
  ticketTypes: {
    select: {
      price: true,
    },
    orderBy: {
      price: Prisma.SortOrder.asc,
    },
    take: 1,
  },
};

export type Event = Prisma.EventsGetPayload<{
  select: typeof EventSelect;
}>;

async function fetchEvents(): Promise<Event[]> {
  const events = await prisma.events.findMany({
    select: EventSelect,
    where: {
      isDraft: false,
      startDate: {
        gte: new Date(),
      },
    },
  });

  return events;
}

export default async function EventsPage() {
  const events = await fetchEvents();

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-background via-accent/5 to-background">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-48 h-48 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-primary/10 to-chart-1/10 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-chart-2/10 to-chart-3/10 blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-accent/15 to-primary/10 blur-3xl"></div>
      </div>

      <div className="relative grow mt-24 md:mt-28 w-full px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced header with animations */}
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="bg-gradient-to-r from-primary via-chart-1 to-chart-2 bg-clip-text text-transparent animate-gradient drop-shadow-sm">
                Discover Events
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Find amazing events happening near you
              <span className="block mt-2 bg-gradient-to-r from-muted-foreground to-primary/70 bg-clip-text text-transparent">
                Book your tickets in seconds
              </span>
            </p>
          </div>

          {/* Events Grid */}
          <div className="w-full">
            {events.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-16 md:py-24">
                <div className="relative mb-8">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-chart-1/20 blur-xl"></div>
                  <Image
                    width={120}
                    height={120}
                    className="relative w-20 h-20 md:w-32 md:h-32 mx-auto"
                    style={{ objectFit: 'contain' }}
                    src={'/icons/empty-events.png'}
                    alt={'No events found'}
                  />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary/80 bg-clip-text text-transparent">
                  No events found
                </h3>
                <p className="text-muted-foreground text-lg">
                  Check back later for exciting events coming your way!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {events.map((event, index) => (
                  <div
                    key={event.id}
                    className="group animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <EventCard event={event} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
