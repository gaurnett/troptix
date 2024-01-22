import { allowCors } from '../lib/auth';
import {
  getAllEventsQuery,
  getEventByIdQuery,
  getEventsByOrganizerIdQuery,
  getEventsScannableByOrganizerIdQuery,
  getPrismaCreateStarterEventQuery,
  getPrismaUpdateEventQuery,
} from '../lib/eventHelper';
import prisma from '../prisma/prisma';

async function handler(request, response) {
  const { body, method } = request;

  if (method === undefined) {
    return response
      .status(500)
      .json({ error: 'No method found for events endpoint' });
  }

  if (method === 'OPTIONS') {
    return response.status(200).end();
  }

  switch (method) {
    case 'POST':
      return await addEvent(body, response);
    case 'GET':
      const getEventType = request.query.getEventsType;
      const id = request.query.id;
      return await getEvents(getEventType, id, request, response);
    case 'PUT':
      return await updateEvent(body, response);
    case 'DELETE':
      break;
    default:
      break;
  }
}

module.exports = allowCors(handler);

async function getEvents(getEventType, id, request, response) {
  switch (String(getEventType)) {
    case 'GET_EVENTS_ALL': // GetEventsType.GET_EVENTS_ALL
      return getAllEvents(request, response);
    case 'GET_EVENTS_BY_ID': // GetEventsType.GET_EVENTS_BY_ID
      return getEventById(request, response, id);
    case 'GET_EVENTS_BY_ORGANIZER': // GetEventsType.GET_EVENTS_BY_ORGANIZER
      return getEventsByOrganizerId(request, response);
    case 'GET_EVENTS_SCANNABLE_BY_ORGANIZER': // GetEventsType.GET_EVENTS_SCANNABLE_BY_ORGANIZER
      return getEventsScannableByOrganizerId(request, response);
    default:
      return response.status(500).json({ error: 'No event type set' });
  }
}

async function getAllEvents(request, response) {
  const userId = request.query.userId;
  try {
    const events = await getAllEventsQuery(userId);
    return response.status(200).json(events);
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: e });
  }
}

async function getEventById(request, response, id) {
  try {
    const event = await getEventByIdQuery(id);
    return response.status(200).json(event);
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error fetching event' });
  }
}

async function getEventsByOrganizerId(request, response) {
  const userId = request.query.id;

  try {
    const events = await getEventsByOrganizerIdQuery(userId);
    return response.status(200).json(events);
  } catch (e) {
    console.error('Request error', e);
    return response
      .status(500)
      .json({ error: 'Error fetching organizer events' });
  }
}

async function getEventsScannableByOrganizerId(request, response) {
  const userId = request.query.id;

  try {
    const events = await getEventsScannableByOrganizerIdQuery(userId);
    return response.status(200).json(events);
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error fetching orders' });
  }
}

async function addEvent(body, response) {
  if (body === undefined || body.event === undefined) {
    return response
      .status(500)
      .json({ error: 'No event body found in POST request' });
  }

  try {
    const event = await prisma.events.create({
      data: getPrismaCreateStarterEventQuery(body.event),
    });

    return response
      .status(200)
      .json({ error: null, message: 'Successfully added event' });
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error adding event' });
  }
}

async function updateEvent(body, response) {
  if (body === undefined || body.event === undefined) {
    return response
      .status(500)
      .json({ error: 'No body found in POST request' });
  }

  try {
    await prisma.events.update({
      where: {
        id: body.event.id,
      },
      data: getPrismaUpdateEventQuery(body.event),
    });

    return response
      .status(200)
      .json({ error: null, message: 'Successfully updated event and tickets' });
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error updating event' });
  }
}
