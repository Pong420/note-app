/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */

export const debounce = (fn: (...args: any[]) => any, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: unknown, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

export const debouncePromise = (fn: (...args: any[]) => Promise<any>) => {
  let promise: Promise<any> | undefined;
  return async function (this: unknown, ...args: any[]) {
    if (!promise) {
      promise = fn(...args);
    }
    const resp = await promise;
    promise = undefined;
    return resp;
  };
};
