import { TropTixResponse, prodUrl } from "./api";

export enum GetTicketTypesType {
  GET_TICKET_TYPES_BY_EVENT = 'GET_TICKET_TYPES_BY_EVENT'
}

export interface GetTicketTypesRequest {
  getTicketTypesType: GetTicketTypesType;
  eventId?: string;
}

export async function getTicketTypes(request: GetTicketTypesRequest) {
  let url = prodUrl + `/api/ticketTypes?getTicketTypesType=${request.getTicketTypesType}`

  switch (request.getTicketTypesType) {
    case GetTicketTypesType.GET_TICKET_TYPES_BY_EVENT:
      url += `&eventId=${request.eventId}`
      break;
  }

  const response = await fetch(url, {
    method: 'GET',
    cache: 'no-cache',
  });

  const json = await response.json();

  return json;
}

export async function saveTicketType(ticketType, editTicketType): Promise<TropTixResponse> {
  let tropTixResponse: TropTixResponse = new TropTixResponse();
  let url = prodUrl + `/api/ticketTypes`;
  let method = editTicketType ? "PUT" : "POST";

  return await fetch(url, {
    method: method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ticketType: ticketType,
    })
  }).then(async response => {
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  }).catch(error => {
    return error;
  })
}
