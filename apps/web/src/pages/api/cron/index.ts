import { invalidateOrders } from '@/server/lib/invalidateOrdersHelper';

const cronJobType = {
  INVALIDATE_ORDERS: 'INVALIDATE_ORDERS',
};

const ORDER_EXPIRATION_LIMIT = 5;

export default async function handler(request, response) {
  try {
    const cronJobName = request.query.cronJob;

    let resultMessage;
    switch (cronJobName) {
      case cronJobType.INVALIDATE_ORDERS:
        const numberOfInvalidatedOrders = await invalidateOrders(
          ORDER_EXPIRATION_LIMIT
        );
        resultMessage = `${numberOfInvalidatedOrders} Expired orders invalidated successfully`;
        break;
      default:
        throw new Error('Invalid cron job name');
    }

    response.status(200).json({ message: resultMessage });
  } catch (error: any) {
    console.error(error);
    response.status(500).json({
      message: `An error occurred while running cron job: ${error.message}`,
    });
  }
}
