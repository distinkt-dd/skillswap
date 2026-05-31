export interface TOffer {
  id: string;
  userId: string;
  name: string;
  subcategoryId: string;
  description: string;
  images: (string | undefined)[];
  userLikedIds: (string | undefined)[];
  /** ISO-строка даты создания (для сортировки «новые» офферы) */
  createdAt?: string;
  /** ISO-строка даты обновления */
  updatedAt?: string;
}

export type TOfferCreate = Omit<TOffer, 'id' | 'userId' | 'userLikedIds'>;
export type TOfferUpdate = Omit<Partial<Omit<TOffer, 'id'>>, 'userId'> & {
  id: string;
};
