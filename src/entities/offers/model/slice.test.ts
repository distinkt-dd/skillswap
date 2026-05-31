import { describe, expect, it } from 'vitest';
import type { TOffer } from '../api/types';
import { createOffer, getOfferById, getOffers, removeOffer, updateOffer } from './actions';
import {
  clearCurrentOffer,
  clearOffersError,
  offersSlice,
  selectedCurrentOffer,
  selectedOffers,
  selectedOffersError,
  selectedOffersIsResponse,
} from './slice';

const firstOffer: TOffer = {
  id: '1',
  userId: '1',
  name: 'Уроки английского',
  subcategoryId: '1',
  description: 'Помогу улучшить разговорный английский',
  images: ['image-1.png'],
  userLikedIds: ['3'],
};

const secondOffer: TOffer = {
  id: '2',
  userId: '2',
  name: 'Уроки рисования',
  subcategoryId: '3',
  description: 'Научу рисовать портреты',
  images: ['image-2.png'],
  userLikedIds: [],
};

const createRootState = (state = offersSlice.getInitialState()) => ({ offers: state }) as RootState;

describe('offersSlice', () => {
  it('возвращает начальное состояние', () => {
    const state = offersSlice.reducer(undefined, { type: 'unknown' });

    expect(state).toEqual({
      offers: [],
      currentOffer: null,
      isResponse: false,
      error: null,
    });
  });

  it('очищает currentOffer и ошибку', () => {
    let state = offersSlice.reducer(undefined, {
      type: getOfferById.fulfilled.type,
      payload: firstOffer,
    });

    state = offersSlice.reducer(state, {
      type: getOffers.rejected.type,
      payload: 'Ошибка загрузки',
    });

    state = offersSlice.reducer(state, clearCurrentOffer());
    state = offersSlice.reducer(state, clearOffersError());

    expect(state.currentOffer).toBeNull();
    expect(state.error).toBeNull();
  });

  it('обрабатывает getOffers pending, fulfilled и rejected', () => {
    let state = offersSlice.reducer(undefined, { type: getOffers.pending.type });

    expect(state.isResponse).toBe(true);
    expect(state.error).toBeNull();

    state = offersSlice.reducer(state, {
      type: getOffers.fulfilled.type,
      payload: [firstOffer, secondOffer],
    });

    expect(state.isResponse).toBe(false);
    expect(state.offers).toEqual([firstOffer, secondOffer]);
    expect(selectedOffers(createRootState(state))).toEqual([firstOffer, secondOffer]);
    expect(selectedOffersIsResponse(createRootState(state))).toBe(false);

    state = offersSlice.reducer(state, {
      type: getOffers.rejected.type,
      payload: 'Ошибка загрузки',
    });

    expect(state.error).toBe('Ошибка загрузки');
    expect(selectedOffersError(createRootState(state))).toBe('Ошибка загрузки');
  });

  it('обрабатывает getOfferById fulfilled и rejected', () => {
    let state = offersSlice.reducer(undefined, {
      type: getOfferById.fulfilled.type,
      payload: secondOffer,
    });

    expect(state.currentOffer).toEqual(secondOffer);
    expect(selectedCurrentOffer(createRootState(state))).toEqual(secondOffer);

    state = offersSlice.reducer(state, {
      type: getOfferById.rejected.type,
      payload: 'Ошибка загрузки',
    });

    expect(state.error).toBe('Ошибка загрузки');
  });

  it('обрабатывает getOfferById pending', () => {
    let state = offersSlice.reducer(undefined, {
      type: getOffers.rejected.type,
      payload: 'Старая ошибка',
    });

    state = offersSlice.reducer(state, {
      type: getOfferById.pending.type,
    });

    expect(state.isResponse).toBe(true);
    expect(state.error).toBeNull();
  });

  it('добавляет новое предложение после createOffer.fulfilled', () => {
    const state = offersSlice.reducer(undefined, {
      type: createOffer.fulfilled.type,
      payload: firstOffer,
    });

    expect(state.offers).toEqual([firstOffer]);
  });

  it('обрабатывает createOffer pending и rejected', () => {
    let state = offersSlice.reducer(undefined, {
      type: getOffers.rejected.type,
      payload: 'Старая ошибка',
    });

    state = offersSlice.reducer(state, {
      type: createOffer.pending.type,
    });

    expect(state.isResponse).toBe(true);
    expect(state.error).toBeNull();

    state = offersSlice.reducer(state, {
      type: createOffer.rejected.type,
      payload: 'Ошибка создания',
    });

    expect(state.isResponse).toBe(false);
    expect(state.error).toBe('Ошибка создания');
  });

  it('обновляет предложение в списке и currentOffer', () => {
    const updatedOffer: TOffer = {
      ...firstOffer,
      name: 'Обновлённые уроки английского',
    };

    let state = offersSlice.reducer(undefined, {
      type: getOffers.fulfilled.type,
      payload: [firstOffer, secondOffer],
    });

    state = offersSlice.reducer(state, {
      type: getOfferById.fulfilled.type,
      payload: firstOffer,
    });

    state = offersSlice.reducer(state, {
      type: updateOffer.fulfilled.type,
      payload: updatedOffer,
    });

    expect(state.offers[0]).toEqual(updatedOffer);
    expect(state.currentOffer).toEqual(updatedOffer);
  });

  it('обрабатывает updateOffer pending и rejected', () => {
    let state = offersSlice.reducer(undefined, {
      type: getOffers.rejected.type,
      payload: 'Старая ошибка',
    });

    state = offersSlice.reducer(state, {
      type: updateOffer.pending.type,
    });

    expect(state.isResponse).toBe(true);
    expect(state.error).toBeNull();

    state = offersSlice.reducer(state, {
      type: updateOffer.rejected.type,
      payload: 'Ошибка обновления',
    });

    expect(state.isResponse).toBe(false);
    expect(state.error).toBe('Ошибка обновления');
  });

  it('не меняет currentOffer, если обновили другое предложение', () => {
    const updatedSecondOffer: TOffer = {
      ...secondOffer,
      name: 'Обновлённые уроки рисования',
    };

    let state = offersSlice.reducer(undefined, {
      type: getOffers.fulfilled.type,
      payload: [firstOffer, secondOffer],
    });

    state = offersSlice.reducer(state, {
      type: getOfferById.fulfilled.type,
      payload: firstOffer,
    });

    state = offersSlice.reducer(state, {
      type: updateOffer.fulfilled.type,
      payload: updatedSecondOffer,
    });

    expect(state.offers[1]).toEqual(updatedSecondOffer);
    expect(state.currentOffer).toEqual(firstOffer);
  });

  it('убирает предложение из списка и очищает currentOffer', () => {
    let state = offersSlice.reducer(undefined, {
      type: getOffers.fulfilled.type,
      payload: [firstOffer, secondOffer],
    });

    state = offersSlice.reducer(state, {
      type: getOfferById.fulfilled.type,
      payload: firstOffer,
    });

    state = offersSlice.reducer(state, {
      type: removeOffer.fulfilled.type,
      payload: firstOffer,
    });

    expect(state.offers).toEqual([secondOffer]);
    expect(state.currentOffer).toBeNull();
  });

  it('обрабатывает removeOffer pending и rejected', () => {
    let state = offersSlice.reducer(undefined, {
      type: getOffers.rejected.type,
      payload: 'Старая ошибка',
    });

    state = offersSlice.reducer(state, {
      type: removeOffer.pending.type,
    });

    expect(state.isResponse).toBe(true);
    expect(state.error).toBeNull();

    state = offersSlice.reducer(state, {
      type: removeOffer.rejected.type,
      payload: 'Ошибка удаления',
    });

    expect(state.isResponse).toBe(false);
    expect(state.error).toBe('Ошибка удаления');
  });

  it('не очищает currentOffer, если удалили другое предложение', () => {
    let state = offersSlice.reducer(undefined, {
      type: getOffers.fulfilled.type,
      payload: [firstOffer, secondOffer],
    });

    state = offersSlice.reducer(state, {
      type: getOfferById.fulfilled.type,
      payload: firstOffer,
    });

    state = offersSlice.reducer(state, {
      type: removeOffer.fulfilled.type,
      payload: secondOffer,
    });

    expect(state.offers).toEqual([firstOffer]);
    expect(state.currentOffer).toEqual(firstOffer);
  });
});
