import { getPrismaCreateEventQuery } from "../lib/eventHelper";
import prisma from "../prisma/prisma";

export default async function handler(request, response) {
  const { body, method } = request;

  if (method === undefined) {
    return response.status(500).json({ error: 'No method found for events endpoint' });
  }

  switch (method) {
    case "POST":
      return addEvent(body);
    case "GET":
      const getEventType = request.query.getEventsType;
      const id = request.query.id;
      return getEvents(getEventType, id, response);
    case "PUT":
      break;
    case "DELETE":
      break;
    default:
      break;
  }
}

async function getEvents(getEventType, id, response) {
  switch (Number(getEventType)) {
    case 0: // GetEventsType.GET_EVENTS_ALL
      return getAllEvents(response);
    case 1: // GetEventsType.GET_EVENTS_BY_ID
      return response.status(500).json({ error: 'Not implemented' });
    case 2: // GetEventsType.GET_EVENTS_BY_ORGANIZER
      return getEventsByOrganizerId(response, id);
    default:
      return response.status(500).json({ error: 'No event type set' });
  }
}

async function getAllEvents(response) {
  try {
    const events = await prisma.events.findMany({
      include: {
        ticketTypes: true,
      },
    });
    return response.status(200).json(events);
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: e });
  }
}

async function getEventsByOrganizerId(response, id) {
  try {
    const user = await prisma.events.findMany({
      where: {
        organizerUserId: id,
      },
      include: {
        ticketTypes: true,
      },
    });
    return response.status(200).json(user);
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error fetching orders' });
  }
}

async function addEvent(body) {
  if (body === undefined || body.event === undefined) {
    return response.status(500).json({ error: 'No event body found in POST request' });
  }

  try {
    const event = await prisma.events.create({
      data: getPrismaCreateEventQuery(body.event),
      include: {
        ticketTypes: true,
      }
    });

    return response.status(200).json({ error: null, message: "Successfully added event" });
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error adding event' });
  }
}