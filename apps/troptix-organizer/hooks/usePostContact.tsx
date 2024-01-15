import { useMutation } from "@tanstack/react-query";
import { prodUrl } from "./constants";
import { ContactUsForm } from "./types/Contact";

export enum PostContactRequestType {
  CONTACT_US = "CONTACT_US",
}
export type PostContactRequest = {
  requestType: keyof typeof PostContactRequestType;
  contactUsForm?: ContactUsForm;
};

export async function mutateContact(request: PostContactRequest): Promise<any> {
  let url = prodUrl + `/api/contact`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contact: request,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();

    return json;
  } catch (error) {
    console.error("An error occurred while fetching the data.", error);
    throw error;
  }
}

export function useCreateContact() {
  return useMutation({ mutationFn: (request: PostContactRequest) => mutateContact(request) });
}
