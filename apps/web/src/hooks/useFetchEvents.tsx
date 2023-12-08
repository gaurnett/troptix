import { useQuery } from "@tanstack/react-query";

import { generateJwtId } from "@/lib/utils";
import jwt from "jsonwebtoken";

export enum RequestType {
  GET_EVENTS_ALL = "GET_EVENTS_ALL",
  GET_EVENTS_BY_ID = "GET_EVENTS_BY_ID",
  GET_EVENTS_BY_ORGANIZER = "GET_EVENTS_BY_ORGANIZER",
  GET_EVENTS_SCANNABLE_BY_ORGANIZER = "GET_EVENTS_SCANNABLE_BY_ORGANIZER",
}
export type GetEventsRequestType = {
  requestType: keyof typeof RequestType;
  id?: string;
  jwtToken?: string;
};

export const prodUrl = process.env.NEXT_PUBLIC_VERCEL_URL;

export async function eventFetcher({
  requestType,
  id,
  jwtToken
}: GetEventsRequestType): Promise<any> {
  let url = prodUrl + `/api/events?getEventsType=${requestType}`;

  if (requestType === RequestType.GET_EVENTS_ALL || requestType === RequestType.GET_EVENTS_BY_ID) {
    const jwtSecretKey = process.env.NEXT_PUBLIC_VERCEL_SECRET;
    jwtToken = jwt.sign(generateJwtId(), jwtSecretKey as string);
  }

  console.log(jwtToken);

  if (requestType !== RequestType.GET_EVENTS_ALL && !id) {
    throw new Error("The appropriate ID is missing");
  } else {
    url += `&id=${id}`;
  }

  return await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    }
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
  const { isPending, isError, data, error } = useQuery({
    queryKey: [RequestType.GET_EVENTS_ALL],
    queryFn: () => eventFetcher({ requestType: RequestType.GET_EVENTS_ALL }),
    initialData: initialData,
  });

  return { isPending, isError, data, error };
}

export function useFetchEventsById(
  { requestType, id }: GetEventsRequestType,
  intialData?
) {
  const { isPending, isError, data, error } = useQuery({
    queryKey: [requestType, id],
    queryFn: () => eventFetcher({ requestType, id }),
    initialData: intialData,
  });

  return { isPending, isError, data, error };
}
