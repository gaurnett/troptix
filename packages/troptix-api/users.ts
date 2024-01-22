import { TropTixResponse, prodUrl } from './api';
import { SocialMediaAccount, User } from '../troptix-models';

export enum GetUsersType {
  GET_USERS_BY_ID = 'GET_USERS_BY_ID',
}

export interface GetUsersRequest {
  getUsersType: GetUsersType;
  userId?: string;
}

export enum PutUsersType {
  PUT_USERS_USER_DETAILS = 'PUT_USERS_USER_DETAILS',
  PUT_USERS_SOCIAL_MEDIA = 'PUT_USERS_SOCIAL_MEDIA',
}
export interface PutUsersRequest {
  putUsersType: PutUsersType;
  socialMediaAccount?: SocialMediaAccount;
  user?: User;
}

export async function getUsers(
  request: GetUsersRequest
): Promise<TropTixResponse> {
  const url =
    prodUrl +
    `/api/users?getUsersType=${request.getUsersType}&id=${request.userId}`;

  const response = await fetch(url, {
    method: 'GET',
    cache: 'no-cache',
  });
  const json = await response.json();

  return json;
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
      user: user,
    }),
  });
  const json = await response.text();

  return json;
}

export async function putUsers(request: PutUsersRequest) {
  let url = prodUrl + `/api/users`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  const json = await response.json();

  return json;
}
