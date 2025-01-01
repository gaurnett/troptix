import { VercelRequest, VercelResponse } from '@vercel/node';
import { allowCors } from '../lib/auth.js';

async function handler(request: VercelRequest, response: VercelResponse) {
  if (!request.url) return response.status(400);

  const title = `<h2>Welcome to <a href="https://www.usetroptix.com" target="_blank">TropTix</a></h2><p>TropTix's event management software is more than just a tool; it's a game-changer tailored to the unique needs of the Caribbean event landscape. Our software streamlines all facets of event planning, ensuring cost savings, enhanced communication, robust data protection, and maximized ROI. Distinct from other solutions, TropTix is designed with local event organizers in mind, offering features that resonate with the Caribbean market's nuances.</p>`;

  return response.status(200).send(title);
}

export default allowCors(handler);
