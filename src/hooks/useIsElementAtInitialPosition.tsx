import { useEffect, useRef, useState } from "react";
import { throttle } from "@utils/throttle";

export function useIsElementAtInitialPosition(
  ref: React.RefObject<HTMLElement | null>,
  throttleDelay = 100,
) {
  const [isScrolledPast, setIsScrolledPast] = useState(false);
  const initialOffset = useRef<number>(0);
  useEffect(() => {
    if (ref.current) {
      initialOffset.current = ref.current.offsetTop;
    }
  }, [ref]);

  useEffect(() => {
    const handleScroll = throttle(() => {
      setIsScrolledPast(window.scrollY >= initialOffset.current);
    }, throttleDelay);

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      handleScroll.cancel?.();
    };
  }, [throttleDelay]);

  return isScrolledPast;
}
