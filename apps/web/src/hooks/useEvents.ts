import { TropTixContext } from '@/components/AuthProvider';
import { FetchEventOptions } from '@/pages/api/events/[[...slug]]';
import { Prisma } from '@prisma/client';
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
import { useContext } from 'react';

interface UseEventsOptions extends Omit<FetchEventOptions, 'userId'> {
  intialData?: any;
}

// Fetch all events
export function useEvents(options?: UseEventsOptions) {
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
    ...(options?.intialData ? { initialData: options.intialData } : {}),
  });
}

interface UseEventOptions {
  intialData?: any;
}

// Fetch event by id
export const useEvent = (id: string, options?: UseEventOptions) => {
  return useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const response = await axios.get(`/api/events/${id}`);
      if (response.status !== 200) throw new Error(response.statusText);
      return response.data;
    },
    ...(options?.intialData ? { initialData: options.intialData } : {}),
  });
};

// Create a new event
export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (event: Prisma.EventsCreateInput) => {
      const response = await axios.post('/api/events', event, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status !== 201) throw new Error(response.statusText);
      return response.data;
    },
    onError: (error) => {
      console.error('Create event error:', error);
      throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

// Update an event
export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

// Delete an event
const useDeleteEvent = () => {
  const queryClient = useQueryClient();
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
