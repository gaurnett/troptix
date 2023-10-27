import { Prisma } from '@prisma/client';

export function getPrismaUpdatePromotionQuery(promo) {
  let promotion: Prisma.PromotionsUpdateInput;

  promotion = {
    id: promo.id,
    promotionType: promo.promotionType,
    value: promo.value,
    code: promo.code,
    event: {
      connect: {
        id: promo.eventId
      }
    }
  }

  return promotion;
}