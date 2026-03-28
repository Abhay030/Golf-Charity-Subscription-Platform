import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useApi — generic data-fetching hook with loading/error/refetch.
 * 
 * Usage:
 *   const { data, loading, error, refetch } = useApi(getScores);
 *   const { data, loading } = useApi(() => getCharities({ category }), [category]);
 */
const useApi = (fetchFn, deps = [], options = {}) => {
  const { initialData = null, skip = false } = options;
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    if (skip) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetchFn();
      if (mountedRef.current) {
        setData(response.data);
        setLoading(false);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err.response?.data?.message || err.message || 'Something went wrong');
        setLoading(false);
      }
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    mountedRef.current = true;
    fetchData();
    return () => { mountedRef.current = false; };
  }, [fetchData]);

  const refetch = useCallback(() => fetchData(), [fetchData]);

  return { data, loading, error, refetch, setData };
};

export default useApi;
