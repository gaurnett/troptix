import { useQuery } from '@tanstack/react-query';
import { prodUrl } from './constants';

export enum RequestType {
  GET_EVENTS_ALL = 'GET_EVENTS_ALL',
  GET_EVENTS_BY_ID = 'GET_EVENTS_BY_ID',
  GET_EVENTS_BY_ORGANIZER = 'GET_EVENTS_BY_ORGANIZER',
  GET_EVENTS_SCANNABLE_BY_ORGANIZER = 'GET_EVENTS_SCANNABLE_BY_ORGANIZER',
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

  if (
    requestType === RequestType.GET_EVENTS_BY_ID ||
    requestType === RequestType.GET_EVENTS_BY_ORGANIZER ||
    requestType === RequestType.GET_EVENTS_SCANNABLE_BY_ORGANIZER
  ) {
    url += `&id=${id}`;
  }

  return await fetch(url, {
    method: 'GET',
  })
    .then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    })
    .catch((error) => {
      console.log('Error: ' + error);
      return error;
    });
}

export function useFetchEventsById({ requestType, id }: GetEventsRequestType) {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: [requestType, id],
    queryFn: () => eventFetcher({ requestType, id }),
  });

  return { isLoading, isError, data, error };
}
