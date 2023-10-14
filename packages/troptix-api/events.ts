import { TropTixResponse, prodUrl } from "./api";

export enum GetEventsType {
  GET_EVENTS_ALL,
  GET_EVENTS_BY_ID,
  GET_EVENTS_BY_ORGANIZER
}

export interface GetEventsRequest {
  getEventsType: GetEventsType;
  eventId?: string;
  organizerId?: string;
}

export async function getEvents(request: GetEventsRequest): Promise<TropTixResponse> {
  let url = prodUrl + `/api/events?getEventsType=${request.getEventsType}`;
  switch (request.getEventsType) {
    case GetEventsType.GET_EVENTS_BY_ID:
      url += `&id=${request.eventId}`
      break;
    case GetEventsType.GET_EVENTS_BY_ORGANIZER:
      url += `&id=${request.organizerId}`
      break;
  }

  const tropTixResponse: TropTixResponse = new TropTixResponse();

  try {
    const response = await fetch(url, {
      method: 'GET'
    });
    const json = await response.json();
    tropTixResponse.response = json;
  } catch (error) {
    tropTixResponse.error = error;
  }

  return tropTixResponse;
}

export async function saveEvent(event, editEvent): Promise<TropTixResponse> {
  const tropTixResponse: TropTixResponse = new TropTixResponse();
  var url = prodUrl;

  if (editEvent) {
    url += '/api/update-event';
  } else {
    url += '/api/add-event';
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: event,
      })
    });
    const json = await response.json();
    tropTixResponse.response = json;
  } catch (error) {
    tropTixResponse.error = error;
  }

  return tropTixResponse;
}