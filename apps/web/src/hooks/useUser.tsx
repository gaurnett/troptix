import { TropTixContext } from '@/components/AuthProvider';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';
import { SocialMediaAccount, User } from './types/User';

enum GetUsersType {
  GET_USERS_BY_ID = 'GET_USERS_BY_ID',
}

type GetUsersRequest = {
  getUsersType: GetUsersType;
  userId?: string;
};

enum PutUsersType {
  PUT_USERS_USER_DETAILS = 'PUT_USERS_USER_DETAILS',
  PUT_USERS_SOCIAL_MEDIA = 'PUT_USERS_SOCIAL_MEDIA',
}

type PutUsersRequest = {
  putUsersType: keyof typeof PutUsersType;
  socialMediaAccount?: SocialMediaAccount;
  user?: User;
};

enum PostUsersType {
  POST_USERS_NEW_USER = 'POST_USERS_NEW_USER',
}

type PostUsersRequest = {
  postUsersType: keyof typeof PostUsersType;
  user?: User;
};

function useFetchUserById(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUserById(userId),
    enabled: !!userId,
  });
}

export function useFetchUser(): {
  user: User;
  isPending: boolean;
  isError: boolean;
} {
  const { user } = useContext(TropTixContext);

  const query = useFetchUserById(user?.id);

  return {
    user: query.data,
    isPending: query.isPending,
    isError: query.isError,
  };
}

async function fetchUserById(userId: string) {
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

function useCreateUser(user: User) {
  const request: PostUsersRequest = {
    postUsersType: PostUsersType.POST_USERS_NEW_USER,
    user: user,
  };
  return useMutation({ mutationFn: () => addUser(request) });
}

async function addUser(request: PostUsersRequest) {
  const url = '/api/users';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to add user');
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (user: User) =>
      putUsers({
        putUsersType: PutUsersType.PUT_USERS_USER_DETAILS,
        user,
      }),
    onSuccess: (user: User) => {
      queryClient.invalidateQueries({ queryKey: [user.id] });
    },
  });
}

async function putUsers({
  putUsersType,
  socialMediaAccount,
  user,
}: PutUsersRequest) {
  let url = `/api/users`;
  const request = {
    putUsersType,
    socialMediaAccount,
    user,
  };

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to update user');
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

function useUpdateUserSocialMedia() {
  return useMutation({
    mutationFn: (socialMediaAccount: SocialMediaAccount) =>
      putUsers({
        putUsersType: PutUsersType.PUT_USERS_SOCIAL_MEDIA,
        socialMediaAccount,
      }),
  });
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
