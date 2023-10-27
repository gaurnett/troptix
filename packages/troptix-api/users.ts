import { TropTixResponse, prodUrl } from "./api";

export enum GetUsersType {
  GET_USERS_BY_ID,
}

export interface GetUsersRequest {
  getUsersType: GetUsersType;
  userId?: string;
}

export async function getUsers(request: GetUsersRequest): Promise<TropTixResponse> {
  const tropTixResponse: TropTixResponse = new TropTixResponse();
  const url = prodUrl + `/api/users?getUsersType=${request.getUsersType}&id=${request.userId}`;

  try {
    const response = await fetch(url, { method: 'GET' });
    const json = await response.json();
    tropTixResponse.response = json;
  } catch (error) {
    tropTixResponse.error = error;
  }

  return tropTixResponse;
}

export async function addUser(user) {
  const url = prodUrl + '/api/users';

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

  console.log("Add user: " + json);

  return json;
}
