import prisma from '@/server/prisma';
import { DelegatedAccess, Prisma } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export interface FetchEventOptions {
  userId?: string; // Fetch events viewable by the user
  byOrganizerId?: boolean; // Fetch events by organizerId
  scanable?: boolean; // Fetch events that are scannable by the user
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Destructure the method, slug, query params from the request object
  // Example: /api/events/1?userId="33" -> method: GET,  query: { slug: [1], userId: "33" }
  const {
    method,
    query: { slug },
  } = req;

  const options: FetchEventOptions = { ...req.query };

  const id = slug ? slug[0] : null; // id is the first element in the slug array
  if (id && typeof id !== 'string') {
    res.status(400).json({ error: 'Invalid id' });
    return;
  } else if (id && id === 'undefined') {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }
  // Todo: Check if id is a valid UUID or old Id from DB

  try {
    // if id is not provided get all events or create a new event
    if (!id) {
      switch (method) {
        case 'GET':
          // Fetch all events
          const events = await getEvents(options);
          if (events) {
            res.status(200).json(events);
          } else {
            res.status(404).json({ error: 'Error fetching events' });
          }
          break;
        case 'POST':
          // Create a new event
          const parsedEvent = parseEventForCreateRequest(req.body);
          const createdEvent = await createEvent(parsedEvent);
          res.status(201).json(createdEvent);
          break;
        default:
          res.setHeader('Allow', ['GET', 'POST']);
          res.status(405).end(`Method ${method} Not Allowed`);
      }
    } else {
      // If id is provided, get, update or delete event by id
      switch (method) {
        case 'GET':
          // fetch event by id
          const event = await getEventById(id);
          res.status(200).json(event);
          break;
        // TODO: Add authorization check for PUT request
        case 'PUT':
          // Update event by id
          const parsedEvent = parseEventForUpdateRequest(req.body);
          const updatedEvent = await updateEvent(id, parsedEvent);
          res.status(200).json(updatedEvent);
          break;

        case 'DELETE':
          // Delete event by id
          await deleteEvent(id);
          res.status(204).end();
          break;

        default:
          res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
          res.status(405).end(`Method ${method} Not Allowed`);
      }
    }
  } catch (error) {
    res.status(500).json({ error: `Something went wrong:${error}` });
  }
}

async function createEvent(event: Prisma.EventsCreateInput) {
  try {
    const createdEvent = await prisma.events.create({
      data: event,
    });
    return createdEvent;
  } catch (e: any) {
    throw new Error(e);
  }
}

async function updateEvent(eventId: string, event: Prisma.EventsUpdateInput) {
  // Check if this a publish request
  const isPublishRequest = event.isDraft === false;

  if (isPublishRequest) {
    // Check if the event is paid
    const hasPaidTickets = await isPaidEvent(eventId);
    if (hasPaidTickets) {
      // Fetch the current event state to check the authoritative organizer
      const currentEvent = await prisma.events.findUnique({
        where: { id: eventId },
        select: { organizerUserId: true }, // Only select the field we need
      });

      if (!currentEvent) {
        throw new Error('Event being updated not found.');
      }

      // Check if the user associated with the event data is an organizer
      const organizer = await prisma.users.findUnique({
        where: {
          id: currentEvent.organizerUserId,
        },
        select: { role: true },
      });

      if (organizer?.role !== 'ORGANIZER') {
        throw new Error('You are not authorized to publish paid events');
      }
    }
  }
  try {
    const updatedEvent = await prisma.events.update({
      where: {
        id: eventId,
      },
      data: event,
    });
    return updatedEvent;
  } catch (e: any) {
    console.log('Error updating event: ' + e);
    throw new Error(e);
  }
}

async function isPaidEvent(eventId: string) {
  const ticketTypes = await prisma.ticketTypes.findMany({
    where: {
      eventId: eventId,
    },
  });
  const isPaidEvent = ticketTypes.some((ticket) => ticket.price > 0);
  return isPaidEvent;
}

async function deleteEvent(eventId: string) {
  try {
    await prisma.events.delete({
      where: {
        id: eventId,
      },
    });
  } catch (e: any) {
    throw new Error(e);
  }
}
// Fetch events by organizerId or all events depending on the options provided
async function getEvents(options: FetchEventOptions) {
  if (options.byOrganizerId && options.userId) {
    console.log('getEventsByOrganizerIdQuery: ' + options.userId);
    return getEventsByOrganizerIdQuery(options.userId, options.scanable);
  } else {
    return getAllEvents(options.userId);
  }
}

async function getAllEvents(userId?: string) {
  try {
    const events = await prisma.events.findMany({
      include: {
        ticketTypes: true,
      },
      where: {
        isDraft: false,
        startDate: {
          gte: new Date(),
        },
      },
    });
    return events;
  } catch (e: any) {
    throw new Error(e);
  }
}

async function getEventsByOrganizerIdQuery(userId: string, scanable?: boolean) {
  const events = await prisma.events.findMany({
    where: {
      organizerUserId: userId,
    },
    include: {
      ticketTypes: true,
    },
  });

  const ownedEvents = await prisma.delegatedUsers.findMany({
    select: {
      event: true,
    },
    where: {
      userId: userId,
      // Fetch events that are scannable by the user if scanable is true, else fetch all events the user owns
      ...(scanable
        ? {
            OR: [
              { delegatedAccess: DelegatedAccess.OWNER },
              { delegatedAccess: DelegatedAccess.TICKET_SCANNER },
            ],
          }
        : { delegatedAccess: DelegatedAccess.OWNER }),
    },
  });

  let ownerEvents: any = [];
  if (ownedEvents.length !== 0) {
    ownedEvents.forEach((event) => {
      ownerEvents.push(event.event);
    });
  }

  return events.concat(ownerEvents);
}

async function getEventById(eventId: string) {
  try {
    const events = await prisma.events.findUnique({
      where: {
        id: eventId,
      },
      include: {
        ticketTypes: true,
      },
    });
    return events;
  } catch (e: any) {
    console.error('Request error', e);
    throw new Error(e);
  }
}

interface EventRequestBody {
  imageUrl?: string;
  isDraft?: boolean;
  name: string;
  description: string;
  summary: string;
  organizer: string;
  organizerUserId: string;
  endDate: Date;
  startDate: Date;
  venue: string;
  address: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  country: string;
}

interface CreateEventRequest {
  id: string;
  name: string;
  description: string;
  organizer: string;
  organizerUserId: string;
  endDate: Date;
  startDate: Date;
  venue: string;
  address: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  country: string;
}
export const parseEventForCreateRequest = (
  event: CreateEventRequest
): Prisma.EventsCreateInput => {
  return {
    id: event.id,
    name: event.name,
    description: event.description,
    organizer: event.organizer,
    organizerUserId: event.organizerUserId,
    endDate: event.endDate,
    startDate: event.startDate,
    venue: event.venue,
    address: event.address,
    countryCode: event.countryCode,
    latitude: event.latitude,
    longitude: event.longitude,
    country: event.country,
  };
};

export const parseEventForUpdateRequest = (
  event: Record<string, any>
): EventRequestBody => {
  return {
    imageUrl: event.imageUrl,
    isDraft: event.isDraft,
    name: event.name,
    description: event.description,
    summary: event.summary,
    organizer: event.organizer,
    organizerUserId: event.organizerUserId,
    endDate: event.endDate,
    startDate: event.startDate,
    venue: event.venue,
    address: event.address,
    countryCode: event.country_code,
    latitude: event.latitude,
    longitude: event.longitude,
    country: event.country,
  };
};
