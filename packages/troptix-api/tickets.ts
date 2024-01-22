import { TropTixResponse, prodUrl } from './api';

export async function getTicketsForUser(userId) {
  const url = prodUrl + `/api/tickets?userId=${userId}`;

  const response = await fetch(url, {
    method: 'GET',
    cache: 'no-cache',
  });

  const json = await response.json();

  return json;
}

export async function scanTicket(id): Promise<TropTixResponse> {
  const tropTixResponse: TropTixResponse = new TropTixResponse();
  var url = prodUrl + '/api/tickets';

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
      }),
    });
    const json = await response.json();
    tropTixResponse.response = json;
  } catch (error) {
    tropTixResponse.error = error;
  }

  return tropTixResponse;
}
