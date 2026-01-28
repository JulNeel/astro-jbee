import React, { useEffect, useRef } from "react";

const Giscus: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";

    script.setAttribute("data-repo", "JulNeel/astro-jbee");
    script.setAttribute("data-repo-id", "R_kgDOQWpBag");
    script.setAttribute("data-category", "Jbee comments");
    script.setAttribute("data-category-id", "DIC_kwDOQWpBas4C1i2U");
    script.setAttribute("data-mapping", "og:title");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-theme", "light");
    script.setAttribute("data-lang", "fr");
    script.setAttribute("data-loading", "lazy");
    script.setAttribute("data-input-position", "top");

    containerRef.current?.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  return <div ref={containerRef} className="w-full" />;
};

export default Giscus;
