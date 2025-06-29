import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { prodUrl } from './constants';

export enum RequestType {
  GET_EVENTS_ALL = 'GET_EVENTS_ALL',
  GET_EVENTS_BY_ID = 'GET_EVENTS_BY_ID',
  GET_EVENTS_BY_ORGANIZER = 'GET_EVENTS_BY_ORGANIZER',
  GET_EVENTS_SCANNABLE_BY_ORGANIZER = 'GET_EVENTS_SCANNABLE_BY_ORGANIZER',
}
export type GetEventsRequestType = {
  id?: string;
};

export const useFetchEventById = (id: string) => {
  return useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const response = await axios.get(prodUrl + `/api/events/${id}`);
      if (response.status !== 200) throw new Error(response.statusText);
      return response.data;
    },
  });
};

export function useFetchScannableEvents({ id }: GetEventsRequestType) {
  return useQuery({
    queryKey: [id],
    queryFn: async () => {
      const response = await axios.get(prodUrl + '/api/events', {
        params: {
          userId: id,
          byOrganizerId: true,
        },
      });

      if (response.status !== 200) throw new Error(response.statusText);
      return response.data;
    },
  });
}
