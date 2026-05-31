import type { TOffer } from '@entities/offers/api/types';
import type { TUser } from '@entities/user/api/types';
import type { CatalogDisplayItem, CatalogSectionId } from './types';

const likesTotalForUser = (userId: string, offers: TOffer[]): number => {
  const uid = String(userId);
  return offers
    .filter((o) => String(o.userId) === uid)
    .reduce((sum, offer) => {
      const n = offer.userLikedIds.filter((id) => id !== undefined && id !== null).length;
      return sum + n;
    }, 0);
};

const newnessScoreForUser = (userId: string, offers: TOffer[]): number => {
  const uid = String(userId);
  const list = offers.filter((o) => String(o.userId) === uid);
  return list.reduce((max, o) => {
    if (o.createdAt) {
      const created = Date.parse(o.createdAt);
      if (!Number.isNaN(created)) {
        return Math.max(max, created);
      }
    }
    const n = parseInt(o.id, 10);
    return Math.max(max, Number.isNaN(n) ? 0 : n);
  }, 0);
};

export type CatalogSectionBuckets = {
  popular: TUser[];
  newUsers: TUser[];
  recommended: TUser[];
};

export const partitionCatalogSections = (
  users: TUser[],
  offers: TOffer[]
): CatalogSectionBuckets => {
  if (!users.length) {
    return { popular: [], newUsers: [], recommended: [] };
  }

  const n = users.length;
  const third = Math.max(1, Math.ceil(n / 3));

  const byLikes = [...users].sort(
    (a, b) => likesTotalForUser(b.id, offers) - likesTotalForUser(a.id, offers)
  );
  const popularUsers = byLikes.slice(0, third);
  const popularIds = new Set(popularUsers.map((u) => u.id));

  const restAfterPopular = users.filter((u) => !popularIds.has(u.id));
  const byNewness = [...restAfterPopular].sort(
    (a, b) => newnessScoreForUser(b.id, offers) - newnessScoreForUser(a.id, offers)
  );
  const newUsersSlice = byNewness.slice(0, Math.min(third, byNewness.length));
  const newIds = new Set(newUsersSlice.map((u) => u.id));

  const recommendedUsers = users.filter((u) => !popularIds.has(u.id) && !newIds.has(u.id));

  return {
    popular: popularUsers,
    newUsers: newUsersSlice,
    recommended: recommendedUsers,
  };
};

export const buildCatalogSectionItems = (
  users: TUser[],
  offers: TOffer[]
): CatalogDisplayItem[] => {
  const { popular, newUsers, recommended } = partitionCatalogSections(users, offers);
  const out: CatalogDisplayItem[] = [];
  const pushSection = (section: CatalogSectionId, list: TUser[]) => {
    list.forEach((user) => {
      out.push({ variant: 'section', section, user });
    });
  };

  pushSection('popular', popular);
  pushSection('new', newUsers);
  pushSection('recommended', recommended);

  return out;
};
