import { useQuery } from "@tanstack/react-query";

export enum RequestType {
  GET_EVENTS_ALL = "GET_EVENTS_ALL",
  GET_EVENTS_BY_ID = "GET_EVENTS_BY_ID",
  GET_EVENTS_BY_ORGANIZER = "GET_EVENTS_BY_ORGANIZER",
  GET_EVENTS_SCANNABLE_BY_ORGANIZER = "GET_EVENTS_SCANNABLE_BY_ORGANIZER",
}
export type GetEventsRequest = {
  requestType: keyof typeof RequestType;
  id?: string;
  jwtToken?: string;
};

export const prodUrl = process.env.NEXT_PUBLIC_VERCEL_URL;

export async function eventFetcher({
  requestType,
  id,
  jwtToken
}: GetEventsRequest): Promise<any> {
  console.log(jwtToken);
  let url = prodUrl + `/api/events?getEventsType=${requestType}`;

  // if (!jwtToken) {
  //   throw new Error("Auth token is missing");
  // }

  if (requestType === RequestType.GET_EVENTS_BY_ID) {
    url += `&id=${id}`
  }

  return await fetch(url, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${jwtToken}`
    }
  })
    .then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    })
    .catch((error) => {
      throw new Error(error);
    });
}

export function useFetchAllEvents(initialData?) {
  const { isPending, isError, data, error } = useQuery({
    queryKey: [RequestType.GET_EVENTS_ALL],
    queryFn: () => eventFetcher({ requestType: RequestType.GET_EVENTS_ALL }),
    initialData: initialData,
  });

  return { isPending, isError, data, error };
}

export function useFetchEventsById(
  { requestType, id, jwtToken }: GetEventsRequest,
  initialData?
) {
  const { isPending, isError, data, error } = useQuery({
    queryKey: [requestType, id],
    queryFn: () => eventFetcher({ requestType, id, jwtToken }),
    initialData: initialData,
  });

  return { isPending, isError, data, error };
}
