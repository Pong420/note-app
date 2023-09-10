import { useEffect, useState } from 'react';

export function usePromise<T>(fn: () => Promise<T>): T | undefined;
export function usePromise<T, Args extends unknown[]>(fn: (...args: Args) => Promise<T>, args: Args): T | undefined;
export function usePromise<T, Args extends unknown[]>(fn: (...args: Args) => Promise<T>, args?: Args): T | undefined {
  const [resp, setResp] = useState<T>();

  useEffect(() => {
    let cancel = false;
    fn(...((args || []) as Parameters<typeof fn>))
      .then(resp => {
        if (!cancel) setResp(resp);
      })
      .catch(() => void 0);
    return () => {
      cancel = true;
    };
  }, [fn, args]);

  return resp;
}
