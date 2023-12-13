import { useState, useEffect } from 'react';

export const STORAGE_KEY = 'sortableList';

/**
 * Hook for handling provided list order and saving it to localStorage.
 * Used for drag and drop order functionality in Dashboard component.
 *
 * @param initialList
 */

const useSortableList = <T>(initialList: T[]) => {
  const [list, setList] = useState(initialList);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }, [list]);

  const moveItem = (from: number, to: number) => {
    const updatedList = [...list];
    const [movedItem] = updatedList.splice(from, 1);
    updatedList.splice(to, 0, movedItem);
    setList(updatedList);
  };

  return { list, moveItem, setList };
};

export default useSortableList;
