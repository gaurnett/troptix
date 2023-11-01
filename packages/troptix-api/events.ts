import { TropTixResponse, prodUrl } from "./api";

export enum GetEventsType {
  GET_EVENTS_ALL = 'GET_EVENTS_ALL',
  GET_EVENTS_BY_ID = 'GET_EVENTS_BY_ID',
  GET_EVENTS_BY_ORGANIZER = 'GET_EVENTS_BY_ORGANIZER',
  GET_EVENTS_SCANNABLE_BY_ORGANIZER = 'GET_EVENTS_SCANNABLE_BY_ORGANIZER'
}

export interface GetEventsRequest {
  getEventsType: GetEventsType;
  eventId?: string;
  organizerId?: string;
}

export async function getEvents(request: GetEventsRequest): Promise<any> {
  let url = prodUrl + `/api/events?getEventsType=${request.getEventsType}`;
  switch (request.getEventsType) {
    case GetEventsType.GET_EVENTS_BY_ID:
      url += `&id=${request.eventId}`
      break;
    case GetEventsType.GET_EVENTS_BY_ORGANIZER:
      url += `&id=${request.organizerId}`
      break;
    case GetEventsType.GET_EVENTS_SCANNABLE_BY_ORGANIZER:
      url += `&id=${request.organizerId}`
      break;
  }

  const response = await fetch(url, {
    method: 'GET',
    cache: 'no-cache',
  });

  const json = await response.json();

  return json;
}

export async function saveEvent(event, editEvent): Promise<any> {
  let url = prodUrl + `/api/events`;
  let method = editEvent ? "PUT" : "POST";

  const response = await fetch(url, {
    method: method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      event: event,
    })
  });

  const json = await response.json();

  return json;
}