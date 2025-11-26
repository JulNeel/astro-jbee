export function throttle<T extends (...args: any[]) => void>(fn: T, delay: number): T & { cancel: () => void } {
  let lastCall = 0;
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const throttled = function (this: any, ...args: any[]) {
    const now = Date.now();
    const remaining = delay - (now - lastCall);

    if (remaining <= 0) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      lastCall = now;
      fn.apply(this, args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        lastCall = Date.now();
        timeout = null;
        fn.apply(this, args);
      }, remaining);
    }
  };

  throttled.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return throttled as T & { cancel: () => void };
}
