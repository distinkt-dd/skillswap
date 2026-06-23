// api/types.ts
import type { TOffer } from '@entities/offers'; // если есть общий тип Offer

export interface Application {
  id: string;
  userFromId: string;
  userToId: string;
  offerId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

// Ответ от GET /applications/received-applications
export interface ReceivedApplication {
  id: string;
  status: 'PENDING';
  createdAt: string;
  userFrom: {
    name: string;
    avatar: string;
  };
  offer: TOffer;
}

// Тип для обновления статуса (тело запроса)
export type UpdateApplicationStatusPayload = {
  status: 'ACCEPTED' | 'REJECTED';
};

// Если у вас нет общего Offer, можно определить минимальный
export type AcceptedOffer = ReceivedApplication; // или свой упрощённый тип
