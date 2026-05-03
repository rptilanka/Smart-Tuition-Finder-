import { useCallback, useEffect, useRef } from "react";

export function useDebouncedCallback(callback, delay = 500) {
  const cbRef = useRef(callback);
  const timerRef = useRef(null);
  const lastArgsRef = useRef(null);

  useEffect(() => {
    cbRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const debounced = useCallback(
    (...args) => {
      lastArgsRef.current = args;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        cbRef.current?.(...args);
      }, delay);
    },
    [delay],
  );

  debounced.cancel = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  debounced.flush = (...args) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const finalArgs = args.length > 0 ? args : (lastArgsRef.current ?? []);
    cbRef.current?.(...finalArgs);
  };

  return debounced;
}
