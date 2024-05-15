import { useTimeout } from "@/hooks/useTimeout";
import { useCallback, useState, useRef } from "react";

export const useLoading = <EventHandler extends (...args: any[]) => Promise<any>>(
  eventHandler: EventHandler,
  delay: number = 0 // 小于100ms不loading
) => {
  const lockRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [loadingDelayTimer] = useTimeout(() => {
    if (lockRef.current === false) setLoading(true);
  }, delay);
  const _eventHandler = useCallback(
    ((...params) => {
      lockRef.current = false;
      loadingDelayTimer();
      return eventHandler(...params)
        .then(result => {
          lockRef.current = true;
          setLoading(false);
          setError(null);
          return result;
        })
        .catch(e => {
          lockRef.current = true;
          setLoading(false);
          setError(e);
          return Promise.reject(e);
        });
    }) as EventHandler,
    [eventHandler]
  );
  return [_eventHandler, loading, error] as [EventHandler, boolean, Error | null];
};
