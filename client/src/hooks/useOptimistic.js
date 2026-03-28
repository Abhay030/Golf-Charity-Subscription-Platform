import { useCallback, useRef } from 'react';
import toast from 'react-hot-toast';

/**
 * useOptimistic — instant UI updates with API rollback on failure.
 *
 * Usage:
 *   const { optimisticAdd, optimisticRemove, optimisticUpdate } = useOptimistic(items, setItems);
 *   
 *   // Add: instantly show item, rollback if API fails
 *   optimisticAdd(newItem, () => api.addScore(data));
 *   
 *   // Remove: instantly hide item, rollback if API fails
 *   optimisticRemove(id, item, () => api.deleteScore(id));
 */
const useOptimistic = (list, setList) => {
  const prevRef = useRef([]);

  const rollback = useCallback((message) => {
    setList([...prevRef.current]);
    toast.error(message || 'Action failed — reverted');
  }, [setList]);

  const optimisticAdd = useCallback(async (item, apiFn) => {
    prevRef.current = [...list];
    setList(prev => [...prev, item]);
    try {
      const result = await apiFn();
      return result;
    } catch (err) {
      rollback(err.response?.data?.message);
      throw err;
    }
  }, [list, setList, rollback]);

  const optimisticRemove = useCallback(async (id, apiFn) => {
    prevRef.current = [...list];
    setList(prev => prev.filter(item => (item._id || item.id) !== id));
    try {
      const result = await apiFn();
      return result;
    } catch (err) {
      rollback(err.response?.data?.message);
      throw err;
    }
  }, [list, setList, rollback]);

  const optimisticUpdate = useCallback(async (id, updates, apiFn) => {
    prevRef.current = [...list];
    setList(prev => prev.map(item =>
      (item._id || item.id) === id ? { ...item, ...updates } : item
    ));
    try {
      const result = await apiFn();
      return result;
    } catch (err) {
      rollback(err.response?.data?.message);
      throw err;
    }
  }, [list, setList, rollback]);

  return { optimisticAdd, optimisticRemove, optimisticUpdate };
};

export default useOptimistic;
