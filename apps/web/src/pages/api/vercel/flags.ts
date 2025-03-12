import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyAccess } from 'flags';
import { getProviderData } from 'flags/next';
import * as flags from '../../../flags';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const access = await verifyAccess(request.headers['authorization'] as string);
  if (!access) return response.status(401).json(null);

  const providerData = getProviderData(flags);
  return response.json(providerData);
}
