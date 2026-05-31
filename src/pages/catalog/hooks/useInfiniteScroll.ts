import { useState, useCallback, useRef, useLayoutEffect, useEffect } from 'react';

interface UseInfiniteScrollOptions<T> {
  items: T[];
  itemsPerPage: number;
  loadingDelay?: number;
}

interface UseInfiniteScrollResult<T> {
  displayedItems: T[];
  loading: boolean;
  hasMore: boolean;
  lastElementRef: (el: HTMLElement | null) => void;
}

export function useInfiniteScroll<T>({
  items,
  itemsPerPage,
  loadingDelay = 10000,
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollResult<T> {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const [lastElement, setLastElement] = useState<HTMLElement | null>(null);
  const loadingTimeoutRef = useRef<number | null>(null);

  const displayedItems = items.slice(0, page * itemsPerPage);

  useEffect(() => {
    setHasMore(displayedItems.length < items.length);
  }, [items, displayedItems]);

  useEffect(() => {
    setPage(1);
    setLoading(false);
  }, [items]);

  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current !== null) {
        window.clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);
    setPage((prev) => prev + 1);

    if (loadingTimeoutRef.current !== null) {
      window.clearTimeout(loadingTimeoutRef.current);
    }

    loadingTimeoutRef.current = window.setTimeout(() => {
      setLoading(false);
    }, loadingDelay);
  }, [loading, hasMore, loadingDelay]);

  const setLastElementRef = useCallback((el: HTMLElement | null) => {
    setLastElement(el);
  }, []);

  useLayoutEffect(() => {
    if (!items.length || !lastElement) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px',
      }
    );

    observerRef.current.observe(lastElement);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [items.length, hasMore, loadMore, loading, lastElement]);

  return {
    displayedItems,
    loading,
    hasMore,
    lastElementRef: setLastElementRef,
  };
}
