import useSWR from "swr";

export function useFetchEvents() {
  // const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json());
  // const { data, error, isLoading } = useSWR("/api/events?getEventsType=GET_EVENTS_ALL", fetcher);

  return { events: [], isError: false, isLoading: false };
}
