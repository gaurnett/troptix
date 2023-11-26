import { TropTixContext } from "@/components/WebNavigator";
import { useContext } from "react";
import { prodUrl } from "./useFetchEvents";
import { useQuery } from "@tanstack/react-query";

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
