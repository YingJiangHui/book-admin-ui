import { useCallback, useEffect, useRef } from "react";

export const useTimeout = <T extends (...args: any[]) => any>(
  _fn: T,
  timeout: number
) => {
  const timerRef = useRef<number>();
  const timerFn = useRef<T>();
  const close = useCallback(() => window.clearTimeout(timerRef.current), []);
  const fnWithTimeout = (...args: Parameters<T>) => {
    return new Promise<ReturnType<T>>((resolve) => {
      timerRef.current = window.setTimeout(async () => {
        const result = await timerFn.current?.(...args);
        resolve(result!);
      }, timeout);
    });
  };
  useEffect(() => {
    return () => {
      close();
    };
  }, []);
  useEffect(() => {
    timerFn.current = _fn;
  }, [_fn]);

  return [fnWithTimeout, close] as [typeof fnWithTimeout, typeof close];
};
