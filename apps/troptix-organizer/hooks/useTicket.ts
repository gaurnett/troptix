import { useMutation, useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { TropTixContext } from "../App";
import { prodUrl } from "./constants";
import { Ticket } from "./types/Ticket";

export enum PostTicketType {
  UPDATE_STATUS = "UPDATE_STATUS",
  UPDATE_NAME = "UPDATE_NAME",
  SCAN_TICKET = "SCAN_TICKET",
}

export interface PostTicketRequest {
  type: keyof typeof PostTicketType;
  ticket?: Ticket;
  id?: string;
  eventId?: string;
  jwtToken?: string
}

export async function mutateTicket(request: PostTicketRequest): Promise<any> {
  let url = prodUrl + `/api/tickets`;

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${request.jwtToken}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();

    return json;
  } catch (error) {
    console.error("An error occurred while fetching the data.", error);
    throw error;
  }
}

export function useCreateTicket() {
  return useMutation({
    mutationFn: (
      request: PostTicketRequest
    ) => mutateTicket(request)
  });
}


export async function fetchUserTickets(userId: string): Promise<any> {
  const url = prodUrl + `/api/tickets?userId=${userId}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      cache: "no-cache",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();

    return json;
  } catch (error) {
    console.error("An error occurred while fetching the tickets.", error);
    throw error;
  }
}

export function useFetchUserTickets() {
  const { user } = useContext(TropTixContext);
  const userId = user.id;
  return useQuery({
    queryKey: ["tickets"],
    queryFn: () => fetchUserTickets(userId),
    enabled: !!userId,
  });
}
