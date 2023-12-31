import { getAllEventsQuery, getEventByIdQuery, getPrismaCreateStarterEventQuery, getPrismaUpdateEventQuery } from "../lib/eventHelper";
import prisma from "../prisma/prisma";

const allowCors = fn => async (req, res) => {
  console.log(req.headers);

  res.setHeader('Access-Control-Allow-Credentials', true);
  // res.setHeader('Access-Control-Allow-Origin', '*');
  // another common pattern
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Authorization, Origin, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

// const handler = (req, res) => {
//   const d = new Date();
//   res.end(d.toString());
// };

// export default async function handler(request, response) {

//   console.log(request.headers);

//   response.setHeader("Access-Control-Allow-Origin", "*");
//   response.setHeader("Access-Control-Allow-Methods", "OPTIONS, POST, GET");
//   response.setHeader("Access-Control-Max-Age", 2592000);

//   const headers = {
//     "Access-Control-Allow-Origin": "http://localhost:3000",
//     "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
//     "Access-Control-Max-Age": 2592000,
//     'Access-Control-Allow-Headers': 'Authorization, Origin, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
//   };

//   if (request.method === "OPTIONS") {
//     res.writeHead(200, headers);
//     res.end();
//     return;
//   }

//   return response.status(200).end();
// }

async function handler(request, response) {
  const { body, method } = request;

  console.log(method);

  if (method === undefined) {
    return response.status(500).json({ error: 'No method found for events endpoint' });
  }

  if (method === "OPTIONS") {
    return response.status(200).end();
  }

  switch (method) {
    case "POST":
      return await addEvent(body, response);
    case "GET":
      const getEventType = request.query.getEventsType;
      const id = request.query.id;
      return await getEvents(getEventType, id, request, response);
    case "PUT":
      return await updateEvent(body, response);
    case "DELETE":
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
      return getEventsScannableByOrganizerId(response, id);
    default:
      return response.status(500).json({ error: 'No event type set' });
  }
}

async function getAllEvents(request, response) {
  try {
    const events = await getAllEventsQuery();
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
    const events = await prisma.events.findMany({
      where: {
        organizerUserId: userId,
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