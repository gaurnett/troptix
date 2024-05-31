import { TropTixContext } from '@/components/WebNavigator';
import { FetchEventOptions } from '@/pages/api/events/[[...slug]]';
import { Prisma } from '@prisma/client';
import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useContext } from 'react';

// Fetch all events
export function useEvents(
  intialData,
  options?: Omit<FetchEventOptions, 'userId'> // Omit userId from FetchEventOptions since userId is already provided by the context
) {
  const { user } = useContext(TropTixContext);

  const userId = user?.id;
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const response = await axios.get('/api/events', {
        params: {
          userId: userId,
          ...options,
        },
      });
      if (response.status !== 200) throw new Error(response.statusText);
      return response.data;
    },
    initialData: intialData,
  });
}

// Fetch event by id
export const useEvent = (id: string, intialData) => {
  return useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const response = await axios.get(`/api/events/${id}`);
      if (response.status !== 200) throw new Error(response.statusText);
      return response.data;
    },
    // initialData: initialData,
  });
};

// Create a new event
export const useCreateEvent = () => {
  const queryClient = new QueryClient();
  return useMutation({
    mutationFn: async (event: Prisma.EventsCreateInput) => {
      const response = await axios.post('/api/events', event, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status !== 200) throw new Error(response.statusText);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

// Update an event
export const useUpdateEvent = () => {
  const queryClient = new QueryClient();
  return useMutation({
    mutationFn: async (event: Prisma.EventsUpdateInput) => {
      const response = await axios.put(`/api/events/${event.id}`, event, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status !== 200) throw new Error(response.statusText);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', data.id] });
    },
  });
};

// Delete an event
export const useDeleteEvent = () => {
  const queryClient = new QueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`/api/events/${id}`);
      if (response.status !== 200) throw new Error(response.statusText);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};
