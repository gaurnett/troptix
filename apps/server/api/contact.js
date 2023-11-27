import { sendContactUsForm } from "../lib/emailHelper";

export default async function handler(request, response) {
  const { body, method } = request;

  if (method === undefined) {
    return response.status(500).json({ error: 'No method found for contact endpoint' });
  }

  switch (method) {
    case "POST":
      return postContact(body.contact, response);
    case "GET":
    case "PUT":
      break;
    case "DELETE":
      break;
    case "OPTIONS":
      return response.status(200).end();
    default:
      return response.status(500).json({ error: 'No contact type set' });
  }
}

function postContact(body, response) {
  if (body === undefined || body.requestType === undefined) {
    return response.status(500).json({ error: 'No body found in post contact request' });
  }

  const postOrderType = body.requestType;

  switch (String(postOrderType)) {
    case 'CONTACT_US':
      return contactUsForm(body, response);
    default:
      return response.status(500).json({ error: 'No post contact type set' });
  }
}

async function contactUsForm(body, response) {
  try {
    const contactFormResponse = await sendContactUsForm(body.contactUsForm);
    console.log(contactFormResponse);
    return response.status(200).json({ message: 'Contact Form Sent' });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error: 'Error sending contact form' });
  }
}