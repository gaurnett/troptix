import { useMutation, useQuery } from '@tanstack/react-query';
import { DelegatedUser } from './types/DelegatedUser';

export interface PostDelegatedUserRequest {
  user?: DelegatedUser;
  jwtToken?: string;
  editingUser?: boolean;
}

export interface DeleteDelegatedUserRequest {
  id?: string;
  jwtToken?: string;
}

export async function mutateDelegatedUser(
  request: PostDelegatedUserRequest
): Promise<any> {
  const url = '/api/delegatedUsers';

  return await fetch(url, {
    method: request.editingUser ? 'PUT' : 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${request.jwtToken}`,
    },
    body: JSON.stringify(request.user),
  })
    .then(async (response) => {
      const message = await response.json();
      if (!response.ok) {
        throw new Error(message.error);
      }

      return message;
    })
    .catch((error) => {
      throw error;
    });
}

export async function deleteDelegatedUser(
  request: DeleteDelegatedUserRequest
): Promise<any> {
  const url = `/api/delegatedUsers?id=${request.id}`;

  return await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${request.jwtToken}`,
    },
    body: JSON.stringify({ id: request.id }),
  })
    .then(async (response) => {
      const message = await response.json();
      if (!response.ok) {
        throw new Error(message.error);
      }

      return message;
    })
    .catch((error) => {
      throw error;
    });
}

export function usePostDelegatedUser() {
  return useMutation({
    mutationFn: (request: PostDelegatedUserRequest) =>
      mutateDelegatedUser(request),
  });
}

export function useDeleteDelegatedUser() {
  return useMutation({
    mutationFn: (request: DeleteDelegatedUserRequest) =>
      deleteDelegatedUser(request),
  });
}

export async function delegatedUserFetcher(
  eventId: string,
  jwtToken: string
): Promise<any> {
  const url = `/api/delegatedUsers?eventId=${eventId}`;

  return await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  })
    .then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    })
    .catch((error) => {
      return error;
    });
}

export function useFetchDelegatedUsers(eventId, jwtToken) {
  const { isPending, isError, data, error } = useQuery({
    queryKey: [eventId],
    queryFn: () => delegatedUserFetcher(eventId, jwtToken),
  });

  return { isPending, isError, data, error };
}
