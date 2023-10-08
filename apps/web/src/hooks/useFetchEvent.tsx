import { EventType } from "@/types/Event";
import useSWR from "swr";

export function useFetchEvent(index: number): {
  event: EventType;
  isError: boolean;
  isLoading: boolean;
} {
  const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json());
  const { data, error, isLoading } = useSWR("/api/events", fetcher);

  return { event: data[index], isError: error, isLoading };
}
