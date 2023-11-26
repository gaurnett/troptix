import { prodUrl } from "./useFetchEvents";
import { SocialMediaAccount, User } from "./types/User";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { TropTixContext } from "@/components/WebNavigator";

export enum GetUsersType {
  GET_USERS_BY_ID = "GET_USERS_BY_ID",
}

export type GetUsersRequest = {
  getUsersType: GetUsersType;
  userId?: string;
};

export enum PutUsersType {
  PUT_USERS_USER_DETAILS = "PUT_USERS_USER_DETAILS",
  PUT_USERS_SOCIAL_MEDIA = "PUT_USERS_SOCIAL_MEDIA",
}
export type PutUsersRequest = {
  putUsersType: keyof typeof PutUsersType;
  socialMediaAccount?: SocialMediaAccount;
  user?: User;
};

export function useFetchUserById(userId: string) {
  return useQuery({
    queryKey: ["user", userId],
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

export async function fetchUserById(userId: string) {
  const url =
    prodUrl +
    `/api/users?getUsersType=${GetUsersType.GET_USERS_BY_ID}&id=${userId}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      cache: "no-cache",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export function useCreateUser(user: User) {
  return useMutation({ mutationFn: () => addUser(user) });
}

export async function addUser(user: User) {
  const url = prodUrl + "/api/users";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: user,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to add user");
    }

    const json = await response.text();
    return json;
  } catch (error) {
    console.error("Error adding user:", error);
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

export async function putUsers({
  putUsersType,
  socialMediaAccount,
  user,
}: PutUsersRequest) {
  let url = prodUrl + `/api/users`;
  const request = {
    putUsersType,
    socialMediaAccount,
    user,
  };

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error("Failed to update user");
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

export function useUpdateUserSocialMedia() {
  return useMutation({
    mutationFn: (socialMediaAccount: SocialMediaAccount) =>
      putUsers({
        putUsersType: PutUsersType.PUT_USERS_SOCIAL_MEDIA,
        socialMediaAccount,
      }),
  });
}