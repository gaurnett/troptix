import { PrismaClient } from '@prisma/client';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { allowCors } from '../lib/auth.js';
import {
  getPrismaCreatePromotionQuery,
  getPrismaUpdatePromotionQuery,
} from '../lib/promotionHelper.js';
import prisma from '../prisma/prisma.js';

const prismaClient = prisma as PrismaClient;

async function handler(request: VercelRequest, response: VercelResponse) {
  const { body, method } = request;

  if (method === undefined) {
    return response
      .status(500)
      .json({ error: 'No method found for promotion endpoint' });
  }

  switch (method) {
    case 'POST':
      return await createPromotion(body, response);
    case 'GET':
      return await getPromotions(request, response);
    case 'PUT':
      return await updatePromotion(body, response);
    case 'DELETE':
      break;
    case 'OPTIONS':
      return response.status(200).end();
    default:
      break;
  }
}

export default allowCors(handler);

async function getPromotions(request, response) {
  const getPromotionsType = request.query.getPromotionsType;

  switch (String(getPromotionsType)) {
    case 'GET_ALL_PROMOTIONS_FOR_EVENT': // GetPromotionsType.GET_ALL_PROMOTIONS_FOR_EVENT
      return getAllPromotions(request, response);
    case 'GET_PROMOTIONS_BY_CODE': // GetPromotionsType.GET_PROMOTIONS_BY_CODE
      return getPromotionByCode(request, response);
    default:
      return response.status(500).json({ error: 'No promotion type set' });
  }
}

async function getAllPromotions(request, response) {
  const eventId = request.query.eventId;

  if (eventId === undefined || eventId === null) {
    return response
      .status(500)
      .json({ error: 'No event ID set in get promotions' });
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
        code: code,
      },
    });

    console.log(promotion);
    return response.status(200).json(promotion);
  } catch (e) {
    console.error('Request error', e);
    return response
      .status(500)
      .json({ error: 'Error fetching promotion by code' });
  }
}

async function createPromotion(body, response) {
  if (body === undefined) {
    return response.status(500).json({ error: 'No body found in PUT request' });
  }

  try {
    const promotion = await prismaClient.promotions.create({
      data: getPrismaCreatePromotionQuery(body),
    });

    return response.status(200).json(promotion);
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error updating promotion' });
  }
}

async function updatePromotion(body, response) {
  if (body === undefined) {
    return response.status(500).json({ error: 'No body found in PUT request' });
  }

  try {
    const promotion = await prisma.promotions.upsert({
      where: {
        id: body.id,
      },
      update: getPrismaUpdatePromotionQuery(body),
      create: getPrismaUpdatePromotionQuery(body),
    });

    return response.status(200).json(promotion);
  } catch (e) {
    console.error('Request error', e);
    return response.status(500).json({ error: 'Error updating promotion' });
  }
}
