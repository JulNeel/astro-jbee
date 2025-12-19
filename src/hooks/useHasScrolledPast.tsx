import { useEffect, useRef, useState } from "react";
import { throttle } from "@utils/throttle";

export function useHasScrolledPast(
  ref: React.RefObject<HTMLElement | null>,
  throttleDelay = 100,
) {
  const [isScrolledPast, setIsScrolledPast] = useState(false);
  const initialOffset = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = throttle(() => {
      if (initialOffset.current === null && ref.current) {
        initialOffset.current = ref.current.offsetTop;
      }

      if (initialOffset.current !== null) {
        setIsScrolledPast(window.scrollY > initialOffset.current);
      }
    }, throttleDelay);

    if (initialOffset.current === null && ref.current) {
      initialOffset.current = ref.current.offsetTop;
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      handleScroll.cancel?.();
    };
  }, [ref, throttleDelay]);

  return isScrolledPast;
}
