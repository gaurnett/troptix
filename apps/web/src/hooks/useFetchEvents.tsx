import { TropTixContext } from '@/components/WebNavigator';
import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';

export enum RequestType {
  GET_EVENTS_ALL = 'GET_EVENTS_ALL',
  GET_EVENTS_BY_ID = 'GET_EVENTS_BY_ID',
  GET_EVENTS_BY_ORGANIZER = 'GET_EVENTS_BY_ORGANIZER',
  GET_EVENTS_SCANNABLE_BY_ORGANIZER = 'GET_EVENTS_SCANNABLE_BY_ORGANIZER',
}
export type GetEventsRequestType = {
  requestType: keyof typeof RequestType;
  id?: string;
  jwtToken?: string;
  userId?: string;
};

export async function eventFetcher({
  requestType,
  id,
  jwtToken,
  userId,
}: GetEventsRequestType): Promise<any> {
  let url = `/api/events?getEventsType=${requestType}`;

  // Uncomment for auth
  // if (requestType === RequestType.GET_EVENTS_ALL || requestType === RequestType.GET_EVENTS_BY_ID) {
  //   const jwtSecretKey = process.env.NEXT_PUBLIC_VERCEL_SECRET;
  //   jwtToken = jwt.sign(generateJwtId(), jwtSecretKey as string);
  // }

  if (
    requestType === RequestType.GET_EVENTS_BY_ID ||
    requestType === RequestType.GET_EVENTS_BY_ORGANIZER
  ) {
    url += `&id=${id}`;
  }

  if (userId) {
    url += `&userId=${userId}`;
  }

  return await fetch(url, {
    method: 'GET',
    // headers: {
    //   Authorization: `Bearer ${jwtToken}`,
    // }
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
  const { user } = useContext(TropTixContext);
  const { isPending, isError, data, error } = useQuery({
    queryKey: [RequestType.GET_EVENTS_ALL],
    queryFn: () =>
      eventFetcher({
        requestType: RequestType.GET_EVENTS_ALL,
        userId: user.id,
      }),
    initialData: initialData,
  });

  return { isPending, isError, data, error };
}

export function useFetchEventsById(
  { requestType, id, jwtToken }: GetEventsRequestType,
  initialData?
) {
  const query = useQuery({
    queryKey: [requestType, id],
    queryFn: () => eventFetcher({ requestType, id, jwtToken }),
    initialData: initialData,
  });

  return { ...query };
}
