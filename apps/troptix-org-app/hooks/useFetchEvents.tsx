import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { prodUrl } from './constants';

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

export function useFetchScannableEvents(jwtToken?: string) {
  return useQuery({
    queryKey: [jwtToken],
    queryFn: async () => {
      if (!jwtToken) {
        throw new Error('JWT token is not available');
      }

      const response = await axios.get(prodUrl + '/api/organizer/events', {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (response.status !== 200) throw new Error(response.statusText);
      return response.data;
    },
  });
}
