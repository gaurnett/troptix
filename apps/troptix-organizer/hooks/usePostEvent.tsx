import { useMutation } from '@tanstack/react-query';
import { prodUrl } from './constants';

export async function mutateEvent(event, editEvent): Promise<any> {
  let url = prodUrl + `/api/events`;
  let method = editEvent ? 'PUT' : 'POST';

  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: event,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();

    return json;
  } catch (error) {
    console.error('An error occurred while fetching the data.', error);
    throw error;
  }
}

export function useCreateEvent() {
  return useMutation({ mutationFn: (e) => mutateEvent(e, false) });
}

export function useEditEvent() {
  return useMutation({ mutationFn: (e) => mutateEvent(e, true) });
}
