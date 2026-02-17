import { useState, useCallback, useEffect, useRef } from 'react';
import { getErrorMessage } from '../utils/errorHandler';

interface PaginationResponse<T> {
  products: T[];
  total: number;
}

interface UsePaginationProps<T> {
  apiFunction: (
    limit: number,
    skip: number,
    search?: string,
    signal?: AbortSignal,
  ) => Promise<PaginationResponse<T>>;
  limit?: number;
  search?: string;
}

/**
 * 🔁 Generic Retry Helper
 */
const retryRequest = async <T>(
  requestFun: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000,
): Promise<T> => {
  try {
    return await requestFun();
  } catch (error: any) {
    // ❌ Do not retry aborted requests
    if (error.name === 'CanceledError' || error.name === 'AbortError') {
      throw error;
    }

    if (retries <= 0) {
      throw error;
    }

    // Wait before retrying
    await new Promise<void>(resolve => setTimeout(() => resolve(), delay));

    return retryRequest(requestFun, retries - 1, delay);
  }
};

export const usePagination = <T>({
  apiFunction,
  limit = 10,
  search = '',
}: UsePaginationProps<T>) => {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    // ✅ Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // ✅ Create new controller
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null); // reset previous error

    const skip = page * limit;

    try {
      const response = await retryRequest(() =>
        apiFunction(limit, skip, search, controller.signal),
      );

      setData(prev => [...prev, ...response.products]);

      const totalLoaded = skip + response.products.length;

      if (totalLoaded >= response.total) {
        setHasMore(false);
      }

      setPage(prev => prev + 1);
    } catch (error: any) {
      // ✅ Ignore abort errors
      if (error.name === 'CanceledError' || error.name === 'AbortError') {
        console.log('Request cancelled');
      } else {
        const message = getErrorMessage(error);
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }, [apiFunction, page, limit, loading, hasMore, search]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    setError(null); // reset previous error

    try {
      const response = await retryRequest(() => 
        apiFunction(limit, 0, search)
    );

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

  // 🔥 IMPORTANT: Reset when search changes
  useEffect(() => {
    setData([]);
    setPage(0);
    setHasMore(true);
  }, [search]);

  // Clean Up On Unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { data, loadMore, refresh, refreshing, loading, hasMore, error };
};

/* Explanation of the usePagination hook:
   URL: https://docs.google.com/document/d/1JzEEApKzByfnVi3OebBBZ61Qlx7Lu__W_qoQWf4ryIU/edit?tab=t.0#heading=h.5e2xcnpvuzoz
 */
