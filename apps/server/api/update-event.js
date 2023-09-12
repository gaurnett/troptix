import { getPrismaTicketTypeQuery, getPrismaUpdateEventQuery } from "../lib/eventHelper";
import prisma from "../prisma/prisma";

export default async function handler(request, response) {
  // try {
  // await prisma.ticketTypes.update({
  //   where: {
  //     id: "8f559389-0ad4-4805-92b7-6b4864ba058f",
  //   },
  //   data: {
  //     quantity: 100
  //   },
  // });
  // return response.status(200).json({ error: null, message: "Successfully updated event and tickets" });
  // const user = await prisma.events.update({
  //   where: {
  //     id: body.event.id,
  //   },
  //   data: getPrismaUpdateEventQuery(body.event),
  // });

  // if (body.event.ticketTypes !== undefined) {
  //   let tickets = body.event.ticketTypes;
  //   tickets.forEach(async (ticket) => {
  //     // await prisma.ticketTypes.upsert({
  //     //   where: {
  //     //     id: ticket.id,
  //     //   },
  //     //   update: ticket,
  //     //   create: ticket,
  //     // });

  //     await prisma.ticketTypes.update({
  //       where: {
  //         id: ticket.id,
  //       },
  //       data: getPrismaTicketTypeQuery(ticket),
  //     });
  //   });

  //   return response.status(200).json({ error: null, message: "Successfully updated event and tickets" });
  // } else {
  //   return response.status(200).json({ error: null, message: "Successfully updated event" });
  // }

  // } catch (e) {
  //   console.error('Request error', e);
  //   return response.status(500).json({ error: 'Error updating event' });
  // }

  const { body } = request;

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

    let ticketTypes = body.event.ticketTypes;
    for (const ticketType of ticketTypes) {
      await prisma.ticketTypes.upsert({
        where: {
          id: ticketType.id,
        },
        update: getPrismaTicketTypeQuery(ticketType),
        create: getPrismaTicketTypeQuery(ticketType),
      });

      // await prisma.ticketTypes.update({
      //   where: {
      //     id: ticketType.id,
      //   },
      //   data: getPrismaTicketTypeQuery(ticketType),
      // });
    }

    if (body.event.ticketTypes !== undefined) {
      let ticketTypes = body.event.ticketTypes;


      // tickets.forEach(async (ticket) => {
      //   console.log("Ticketes = ", ticket);

      // });

      return response.status(200).json({ error: null, message: "Successfully updated event and tickets" });
    } else {
      return response.status(200).json({ error: null, message: "Successfully updated event" });
    }

  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error updating event' });
  }
}