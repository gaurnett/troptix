import { useQuery } from '@tanstack/react-query';

export enum GetUsersType {
  GET_USERS_BY_ID = 'GET_USERS_BY_ID',
}

export async function fetchUserById(userId: string) {
  const url = `/api/users?getUsersType=${GetUsersType.GET_USERS_BY_ID}&id=${userId}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      cache: 'no-cache',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

export function useOrganizerStatus(userId: string | undefined) {
  return useQuery<boolean, Error>({
    queryKey: ['organizerStatus', userId],
    queryFn: () => {
      if (!userId)
        throw new Error('User ID is required to fetch organizer status.');
      return fetchUserById(userId).then((user) => user.role === 'ORGANIZER');
    },

    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: true,
  });
}
