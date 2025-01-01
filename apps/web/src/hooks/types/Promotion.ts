import { generateId } from '@/lib/utils';

export enum PromotionType {
  PERCENTAGE = 'PERCENTAGE',
  DOLLAR_AMOUNT = 'DOLLAR_AMOUNT',
}

export type Promotion = {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;

  code?: string;
  promotionType?: PromotionType;
  value?: number;
  eventId?: string;
};

export function createPromotion(eventId: string): Promotion {
  const promotion: Promotion = {
    id: generateId(),
    eventId: eventId,
  };

  return promotion;
}
