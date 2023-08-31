import { ForwardedRef } from 'react';

/**
 * Utility to setting react refs.
 */

export function setRef<T>(...refs: ForwardedRef<T>[]) {
  return (value: T) => {
    for (const ref of refs) {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref) {
        ref.current = value;
      }
    }
  };
}
