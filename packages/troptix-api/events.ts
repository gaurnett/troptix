import { TropTixResponse } from "./api";

export async function getEvents(): Promise<TropTixResponse> {
  const tropTixResponse: TropTixResponse = new TropTixResponse();

  try {
    const response = await fetch('https://troptix-backend.vercel.app/api/get-events');
    const json = await response.json();
    tropTixResponse.response = json;
  } catch (error) {
    tropTixResponse.error = error;
  }

  return tropTixResponse;
}