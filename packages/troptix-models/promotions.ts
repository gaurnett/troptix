import uuid from 'react-native-uuid';

export enum PromotionType {
  PERCENTAGE = 'PERCENTAGE',
  DOLLAR_AMOUNT = 'DOLLAR_AMOUNT',
}

export class Promotion {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  code: string;
  promotionType: PromotionType;
  value: number;
  eventId: string;

  constructor(eventId: string) {
    this.id = String(uuid.v4());
    this.eventId = eventId
    this.promotionType = PromotionType.PERCENTAGE
  }
}