import { TropTixResponse, prodUrl } from "./api";

export enum GetUsersType {
  GET_USERS_BY_ID,
}

export interface GetUsersRequest {
  getUsersType: GetUsersType;
  userId?: string;
}

const allowedOrigins = [
  'http://localhost:3000',
];

export async function getUsers(request: GetUsersRequest): Promise<TropTixResponse> {
  const tropTixResponse: TropTixResponse = new TropTixResponse();
  const url = prodUrl + `/api/users?getUsersType=${request.getUsersType}&id=${request.userId}`;

  let header = new Headers();
  // header.append
  let headers: {
    'Accept': 'application/json',
    'Access-Control-Allow-Credentials': "true",
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Allow-Origin': "*",
    'Access-Control-Allow-Headers':
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
    'Content-Type': 'application/json',
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      cache: 'no-cache',
      headers: headers
    });
    const json = await response.json();
    tropTixResponse.response = json;
  } catch (error) {
    tropTixResponse.error = error;
  }

  return tropTixResponse;
}

export async function addUser(user) {
  const url = prodUrl + '/api/users';

  let headers: {
    Accept: 'application/json',
    'Access-Control-Allow-Credentials': "true",
    'Access-Control-Allow-Methods': 'GET,DELETE,PATCH,POST,PUT',
    'Access-Control-Allow-Headers':
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
    'Content-Type': 'application/json',
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      "user": user,
    })
  });
  const json = await response.text();

  console.log("Add user: " + json);

  return json;
}
