import { TropTixResponse, prodUrl } from "./api";

export async function addUser(user): Promise<TropTixResponse> {
  const tropTixResponse: TropTixResponse = new TropTixResponse();
  const url = prodUrl + '/api/add-user';

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

export async function getUser(id: String): Promise<TropTixResponse> {
  const tropTixResponse: TropTixResponse = new TropTixResponse();

  try {
    const response = await fetch(prodUrl + '/api/get-user?id=' + id);
    const json = await response.json();
    tropTixResponse.response = json;
  } catch (error) {
    tropTixResponse.error = error;
  }

  return tropTixResponse;
}