import { TropTixResponse } from "./api";
import { getEvents, saveEvent, GetEventsType, GetEventsRequest, } from "./events";
import { addUser, getUsers, GetUsersType, GetUsersRequest } from "./users";
import { scanTicket, getTicketsForUser } from "./tickets";
import { addDelegatedUser, getDelegatedUsers } from "./delegatedUsers";
import { GetOrdersType, GetOrdersRequest, getOrders, PostOrdersType, PostOrdersRequest, postOrders } from "./orders";
import { saveTicketType } from "./ticketTypes";
import { addPromotion, getPromotions, GetPromotionsRequest, GetPromotionsType } from "./promotion";

const monorepoTest = {
  title: 'Hello TropTix',
  subtitle: 'My great monorepo',
};

export {
  TropTixResponse,
  getEvents,
  saveEvent,
  addDelegatedUser,
  getDelegatedUsers,
  addUser,
  getUsers,
  GetUsersType,
  GetUsersRequest,
  scanTicket,
  getTicketsForUser,
  saveTicketType,
  addPromotion,
  getPromotions,
  GetPromotionsRequest,
  GetPromotionsType,
  GetEventsType,
  GetEventsRequest,
  getOrders,
  GetOrdersType,
  GetOrdersRequest,
  postOrders,
  PostOrdersType,
  PostOrdersRequest,
  monorepoTest
};