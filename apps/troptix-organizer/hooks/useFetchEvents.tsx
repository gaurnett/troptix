import { useQuery } from "react-query";
import { prodUrl } from "./constants";

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

  console.log(url);

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

export function useFetchAllEvents(initialData?) {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: [RequestType.GET_EVENTS_ALL],
    queryFn: () => eventFetcher({ requestType: RequestType.GET_EVENTS_ALL }),
    initialData: initialData,
  });

  return { isLoading, isError, data, error };
}

export function useFetchEventsById(
  { requestType, id }: GetEventsRequestType,
  intialData?
) {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: [requestType, id],
    queryFn: () => eventFetcher({ requestType, id }),
    initialData: intialData,
  });

  return { isLoading, isError, data, error };
}
