import { useEffect, useState } from "react";

/**
 * Debounce a value with the given delay.
 * @param value The value to debounce
 * @param delay Delay in milliseconds
 */
export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
