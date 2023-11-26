import { useQuery, useQueryClient } from "@tanstack/react-query";

export enum RequestType {
  GET_EVENTS_ALL = "GET_EVENTS_ALL",
  GET_EVENTS_BY_ID = "GET_EVENTS_BY_ID",
  GET_EVENTS_BY_ORGANIZER = "GET_EVENTS_BY_ORGANIZER",
  GET_EVENTS_SCANNABLE_BY_ORGANIZER = "GET_EVENTS_SCANNABLE_BY_ORGANIZER",
}
export type GetEventsRequestType = {
  requestType: keyof typeof RequestType;
  id?: string;
};

export const prodUrl = process.env.NEXT_PUBLIC_VERCEL_URL;

export async function eventFetcher({
  requestType,
  id,
}: GetEventsRequestType): Promise<any> {
  let url = prodUrl + `/api/events?getEventsType=${requestType}`;

  if (requestType !== RequestType.GET_EVENTS_ALL && !id) {
    throw new Error("The appropriate ID is missing");
  } else {
    url += `&id=${id}`;
  }

  return await fetch(url, {
    method: "GET",
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

export function useFetchAllEvents() {
  const queryClient = useQueryClient();

  const { isPending, isError, data, error } = useQuery({
    queryKey: [RequestType.GET_EVENTS_ALL],
    queryFn: () => eventFetcher({ requestType: RequestType.GET_EVENTS_ALL }),
    initialData: () => {
      const events = queryClient.getQueryData([RequestType.GET_EVENTS_ALL]);
      console.log(events);
      return events;
    },
  });

  return { isPending, isError, data, error };
}

export function useFetchEventsById({ requestType, id }: GetEventsRequestType) {
  const { isPending, isError, data, error } = useQuery({
    queryKey: [requestType, id],
    queryFn: () => eventFetcher({ requestType, id }),
  });

  return { isPending, isError, data, error };
}
