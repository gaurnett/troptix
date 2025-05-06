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
    <div className="flex min-h-screen flex-col">
      <div className="grow mt-28 md:mt-32 w-full md:max-w-5xl mx-auto">
        <div className="">
          <h1
            className="text-center text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4"
            data-aos="zoom-y-out"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-400 px-4">
              Events
            </span>
          </h1>
          <div className="mx-auto p-4">
            <div className="flex flex-wrap -mx-2">
              {events.length === 0 ? (
                <>
                  <div
                    className="text-center"
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      width: '100%',
                    }}
                  >
                    <Image
                      width={75}
                      height={75}
                      className="w-full mx-auto justify-center content-center items-center"
                      style={{ objectFit: 'contain', width: 75 }}
                      src={'/icons/empty-events.png'}
                      alt={'mobile wallet image'}
                    />
                    <div className="mt-4 font-bold text-xl">
                      There are no events nearby
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {events.map((event) => {
                    return (
                      <div
                        key={event.id}
                        className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-4"
                      >
                        <EventCard event={event} />
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
