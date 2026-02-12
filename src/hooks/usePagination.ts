import { useState, useCallback, use } from 'react';
import { getErrorMessage } from '../utils/errorHandler';

interface PaginationResponse<T> {
  products: T[];
  total: number;
}

interface UsePaginationProps<T> {
  apiFunction: (limit: number, skip: number) => Promise<PaginationResponse<T>>;
  limit?: number;
}

export const usePagination = <T>({
  apiFunction,
  limit = 10,
}: UsePaginationProps<T>) => {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null); // reset previous error

    const skip = page * limit;

    try {
      const response = await apiFunction(limit, skip);

      setData(prev => [...prev, ...response.products]);

      const totalLoaded = skip + response.products.length;

      if (totalLoaded >= response.total) {
        setHasMore(false);
      }

      setPage(prev => prev + 1);
    } catch (error) {
      const message = getErrorMessage(error);
      setError(message);
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, [apiFunction, page, limit, loading, hasMore]);

  return { data, loadMore, loading, hasMore, error };
};
