import { onSchedule } from 'firebase-functions/v2/scheduler';
import { logger } from 'firebase-functions';
import { defineString } from 'firebase-functions/params';
import axios from 'axios';

// Set the default URL if there's an error with the url it will default to the development endpoint
const defaultUrl = 'https://troptix-p8zh-git-main-troptix.vercel.app';

// Set the URL based on the environment
const url = defineString('URL') || defaultUrl;
logger.log('URL:', url.value());

export const invalidateOrders = onSchedule('every 30 minutes', async () => {
  logger.log('This will be run every 30 minutes!');

  try {
    const response = await axios.put(
      url.value() + '/api/cron?cronJob=INVALIDATE_ORDERS'
    );

    const data = response.data;

    logger.log(data);
  } catch (err) {
    logger.error('Error hitting cron endpoint:', err);
  }

  logger.log('Order cleanup finished.');
});
