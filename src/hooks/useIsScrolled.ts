// hooks/useIsScrolled.ts
import { useEffect, useState } from "react";
import { throttle } from "@utils/throttle";

export function useIsScrolled(threshold = 1, throttleDelay = 100): boolean {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = throttle(() => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(prev => (prev !== (scrollTop > threshold) ? scrollTop > threshold : prev));
    }, throttleDelay);

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      handleScroll.cancel();
    };
  }, [threshold, throttleDelay]);

  return isScrolled;
}