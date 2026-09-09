import { useState, useEffect, useRef } from 'react';

export function usePersistedList<T extends { id: string }>(
  loader: () => Promise<T[]>,
  saver: (items: T[]) => Promise<void>,
  initialFallback: T[]
): [T[], React.Dispatch<React.SetStateAction<T[]>>, boolean] {
  const [data, setData] = useState<T[]>(initialFallback);
  const [isLoaded, setIsLoaded] = useState(false);
  const isInitialMount = useRef(true);

  // Load from IndexedDB on mount
  useEffect(() => {
    let mounted = true;
    loader()
      .then((stored) => {
        if (!mounted) return;
        if (stored && stored.length > 0) {
          setData(stored);
        } else {
          // If empty, save the default initial data to IndexedDB
          saver(initialFallback).catch(() => {});
        }
        setIsLoaded(true);
      })
      .catch((err) => {
        console.warn('Failed to load from persistent store:', err);
        if (mounted) setIsLoaded(true);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Save changes to IndexedDB (debounced)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (!isLoaded) return;

    const handler = setTimeout(() => {
      saver(data).catch((err) => {
        console.warn('Failed to persist items:', err);
      });
    }, 400);

    return () => clearTimeout(handler);
  }, [data, isLoaded]);

  return [data, setData, isLoaded];
}
