import { TropTixResponse, prodUrl } from "./api";

export async function addDelegatedUser(user): Promise<TropTixResponse> {
  const tropTixResponse: TropTixResponse = new TropTixResponse();
  const url = prodUrl + '/api/add-delegated-user';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "user": user,
      })
    });
    const json = await response.text();
    tropTixResponse.response = json;
  } catch (error) {
    tropTixResponse.error = error;
  }

  return tropTixResponse;
}