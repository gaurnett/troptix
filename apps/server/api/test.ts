import { VercelRequest, VercelResponse } from "@vercel/node";
import { allowCors } from '../lib/auth.js';

async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (!request.url) return response.status(400);

  // await verifyUser({})
  const url = new URL(request.url, `http://${request.headers.host}`);
  const { searchParams } = url;
  const hasTitle = searchParams.has('title');
  const title = hasTitle
    ? searchParams.get('title')?.slice(0, 100)
    : `My default title`;

  return response.status(200).json({ title });
}

export default allowCors(handler);
