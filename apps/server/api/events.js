import { getPrismaCreateStarterEventQuery, getPrismaUpdateEventQuery } from "../lib/eventHelper";
import prisma from "../prisma/prisma";

export default async function handler(request, response) {
  const { body, method } = request;

  if (method === undefined) {
    return response.status(500).json({ error: 'No method found for events endpoint' });
  }

  switch (method) {
    case "POST":
      return await addEvent(body, response);
    case "GET":
      const getEventType = request.query.getEventsType;
      const id = request.query.id;
      return await getEvents(getEventType, id, response);
    case "PUT":
      return await updateEvent(body, response);
    case "DELETE":
      break;
    default:
      break;
  }
}

async function getEvents(getEventType, id, response) {
  switch (String(getEventType)) {
    case 'GET_EVENTS_ALL': // GetEventsType.GET_EVENTS_ALL
      return getAllEvents(response);
    case 'GET_EVENTS_BY_ID': // GetEventsType.GET_EVENTS_BY_ID
      return getEventById(response, id);
    case 'GET_EVENTS_BY_ORGANIZER': // GetEventsType.GET_EVENTS_BY_ORGANIZER
      return getEventsByOrganizerId(response, id);
    case 'GET_EVENTS_SCANNABLE_BY_ORGANIZER': // GetEventsType.GET_EVENTS_SCANNABLE_BY_ORGANIZER
      return getEventsScannableByOrganizerId(response, id);
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

async function getEventById(response, id) {
  try {
    const event = await prisma.events.findUnique({
      where: {
        id: id,
      },
      include: {
        ticketTypes: true,
      },
    });
    return response.status(200).json(event);
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error fetching event' });
  }
}

async function getEventsByOrganizerId(response, id) {
  try {
    const events = await prisma.events.findMany({
      where: {
        organizerUserId: id,
      },
      include: {
        ticketTypes: true,
      },
    });
    return response.status(200).json(events);
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error fetching organizer events' });
  }
}

async function getEventsScannableByOrganizerId(response, id) {
  try {
    const organizedEvents = await prisma.events.findMany({
      where: {
        organizerUserId: id,
      },
    });

    const scannableEvents = await prisma.delegatedUsers.findMany({
      select: {
        event: true
      },
      where: {
        userId: id,
        delegatedAccess: 'TICKET_SCANNER'
      },
    });

    let scannedEvents = [];
    if (scannableEvents.length !== 0) {
      scannableEvents.forEach(scannableEvent => {
        scannedEvents.push(scannableEvent.event);
      });
    }

    return response.status(200).json(organizedEvents.concat(scannedEvents));
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error fetching orders' });
  }
}

async function addEvent(body, response) {
  if (body === undefined || body.event === undefined) {
    return response.status(500).json({ error: 'No event body found in POST request' });
  }

  try {
    const event = await prisma.events.create({
      data: getPrismaCreateStarterEventQuery(body.event),
    });

    return response.status(200).json({ error: null, message: "Successfully added event" });
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error adding event' });
  }
}

async function updateEvent(body, response) {
  if (body === undefined || body.event === undefined) {
    return response.status(500).json({ error: 'No body found in POST request' });
  }

  try {
    await prisma.events.update({
      where: {
        id: body.event.id,
      },
      data: getPrismaUpdateEventQuery(body.event),
    });

    return response.status(200).json({ error: null, message: "Successfully updated event and tickets" });
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error updating event' });
  }
}