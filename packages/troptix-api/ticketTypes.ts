import { TropTixResponse, prodUrl } from "./api";

export async function saveTicketType(ticketType, editTicketType): Promise<TropTixResponse> {
  let tropTixResponse: TropTixResponse = new TropTixResponse();
  let url = prodUrl + `/api/ticketTypes`;
  let method = editTicketType ? "PUT" : "POST";

  const response = await fetch(url, {
    method: method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ticketType: ticketType,
    })
  });

  const json = await response.json();

  return json;
}
