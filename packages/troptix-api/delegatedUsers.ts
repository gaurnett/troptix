import { json } from "stream/consumers";
import { TropTixResponse, prodUrl } from "./api";

export async function addDelegatedUser(user, isEditUser) {
  const url = prodUrl + '/api/delegatedUsers';

  const response = await fetch(url, {
    method: isEditUser ? 'PUT' : 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user)
  });
  const json = await response.json();

  return json;
}

export async function getDelegatedUsers(eventId) {
  const url = prodUrl + `/api/delegatedUsers?eventId=${eventId}`;

  const response = await fetch(url, {
    method: 'GET'
  });

  const json = await response.json();

  return json;
}