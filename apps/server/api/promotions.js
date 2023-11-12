import prisma from "../prisma/prisma";
import { getPrismaUpdatePromotionQuery } from "../lib/promotionHelper";

export default async function handler(request, response) {
  const { body, method } = request;

  if (method === undefined) {
    return response.status(500).json({ error: 'No method found for promotion endpoint' });
  }

  switch (method) {
    case "POST":
      return await updatePromotion(body, response);
    case "GET":
      return await getPromotions(request, response);
    case "PUT":
      return await updatePromotion(body, response);
    case "DELETE":
      break;
    case "OPTIONS":
      return response.status(200).end();
    default:
      break;
  }
}

async function getPromotions(request, response) {
  const getPromotionsType = request.query.getPromotionsType;

  switch (String(getPromotionsType)) {
    case 'GET_PROMOTIONS_ALL': // GetPromotionsType.GET_PROMOTIONS_ALL
      return getAllPromotions(request, response);
    case 'GET_PROMOTIONS_BY_EVENT': // GetPromotionsType.GET_PROMOTIONS_BY_EVENT
      return getPromotionByCode(request, response);
    default:
      return response.status(500).json({ error: 'No promotion type set' });
  }
}

async function getAllPromotions(request, response) {
  const eventId = request.query.eventId;

  if (eventId === undefined || eventId === null) {
    return response.status(500).json({ error: 'No event ID set in get promotions' });
  }

  try {
    const promotions = await prisma.promotions.findMany({
      where: {
        eventId: eventId,
      },
    });
    return response.status(200).json(promotions);
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error fetching promotions' });
  }
}

async function getPromotionByCode(request, response) {
  const eventId = request.query.eventId;
  const code = request.query.code;

  try {
    const promotion = await prisma.promotions.findFirst({
      where: {
        eventId: eventId,
        code: code
      },
    });
    return response.status(200).json(promotion);
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error fetching promotion by code' });
  }
}


async function updatePromotion(body, response) {

  if (body === undefined) {
    return response.status(500).json({ error: 'No body found in PUT request' });
  }

  try {
    await prisma.promotions.upsert({
      where: {
        id: body.id,
      },
      update: getPrismaUpdatePromotionQuery(body),
      create: getPrismaUpdatePromotionQuery(body),
    });

    return response.status(200).json({ error: null, message: "Successfully updated promotion" });
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error updating promotion' });
  }
}
