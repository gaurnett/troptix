import { TropTixResponse, prodUrl } from "./api";

export async function getEvents(): Promise<TropTixResponse> {
  const tropTixResponse: TropTixResponse = new TropTixResponse();

  try {
    const response = await fetch(prodUrl + '/api/get-events');
    const json = await response.json();
    tropTixResponse.response = json;
  } catch (error) {
    tropTixResponse.error = error;
  }

  return tropTixResponse;
}

export async function getEventsForOrganizer(organizerUserId): Promise<TropTixResponse> {
  const tropTixResponse: TropTixResponse = new TropTixResponse();

  try {
    const response = await fetch(prodUrl + '/api/get-events-for-organizer?id=' + organizerUserId);
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