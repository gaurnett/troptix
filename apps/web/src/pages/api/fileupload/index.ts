import { VercelRequest, VercelResponse } from '@vercel/node';
import { allowCors } from '@/server/lib/auth';

async function handler(request: VercelRequest, response: VercelResponse) {
  return response.status(200).send('fileupload');
}

export default allowCors(handler);
