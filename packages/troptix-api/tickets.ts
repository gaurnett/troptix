import { TropTixResponse, prodUrl } from "./api";

export async function scanTicket(id): Promise<TropTixResponse> {
  const tropTixResponse: TropTixResponse = new TropTixResponse();
  var url = prodUrl + "/api/scan-ticket";

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
      })
    });
    const json = await response.json();
    tropTixResponse.response = json;
  } catch (error) {
    tropTixResponse.error = error;
  }

  return tropTixResponse;
}