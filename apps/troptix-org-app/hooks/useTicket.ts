import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { prodUrl } from './constants';

export function scanTicketApi() {
  return useMutation({
    mutationFn: async ({
      ticketId,
      eventId,
      jwtToken,
    }: {
      ticketId: string;
      eventId: string;
      jwtToken?: string;
    }) => {
      const response = await axios.put(
        prodUrl + `/api/organizer/tickets/scan`,
        {
          ticketId,
          eventId,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (response.status !== 200) throw new Error(response.statusText);
      return response.data;
    },
  });
}

export function checkInTicket() {
  return useMutation({
    mutationFn: async ({
      ticketId,
      jwtToken,
    }: {
      ticketId: string;
      jwtToken?: string;
    }) => {
      const response = await axios.put(
        prodUrl + `/api/organizer/tickets/check-in`,
        {
          ticketId,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (response.status !== 200) throw new Error(response.statusText);
      return response.data;
    },
  });
}
