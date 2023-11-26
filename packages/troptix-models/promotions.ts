import uuid from 'react-native-uuid';
import { generateId } from './idHelper';

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
    this.id = generateId();
    this.eventId = eventId
    this.promotionType = PromotionType.PERCENTAGE
  }
}