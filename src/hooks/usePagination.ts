import { useState, useCallback } from 'react';
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
  const [refreshing, setRefreshing] = useState(false);
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

  const refresh = useCallback(async ()=>{
    setRefreshing(true);
    setError(null); // reset previous error
    
    try {
      const response = await apiFunction(limit, 0);

      setData(response.products);
      setPage(1);
      setHasMore(response.products.length < response.total);
    } catch (error) {
      const message = getErrorMessage(error);
      setError(message);
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  }, [apiFunction, limit]);

  return { data, loadMore,refresh, refreshing, loading, hasMore, error };
};





/* Explanation of the usePagination hook:
   URL: https://docs.google.com/document/d/1JzEEApKzByfnVi3OebBBZ61Qlx7Lu__W_qoQWf4ryIU/edit?tab=t.0#heading=h.5e2xcnpvuzoz
 */