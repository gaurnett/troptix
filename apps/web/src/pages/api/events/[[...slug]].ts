import prisma from '@/server/prisma';
import { DelegatedAccess, Prisma } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

export interface FetchEventOptions {
  userId?: string; // Fetch events viewable by the user
  organizerId?: string; // Fetch events by organizerId
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
          const event = { ...req.body };

          const createdEvent = await createEvent(event);
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

        case 'PUT':
          // Update event by id
          const updatedEvent = await updateEvent(id, req.body);
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
  try {
    const updatedEvent = await prisma.events.update({
      where: {
        id: eventId,
      },
      data: event,
    });
    return updatedEvent;
  } catch (e: any) {
    throw new Error(e);
  }
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
  if (options.organizerId) {
    return getEventsByOrganizerIdQuery(options.organizerId, options.scanable);
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
    console.log('Hello World: ' + events);
    return events;
  } catch (e: any) {
    console.log('Hello World: ' + e);
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
