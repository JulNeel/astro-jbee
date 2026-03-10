import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { select } from "d3-selection";
import { zoom, zoomIdentity } from "d3-zoom";
import workstationSvgUrl from "@images/jbee_office_workstation_full.svg?url";
import { TOOLTIP_CONTENT } from "./InteractiveDesk.data";

type TooltipState = {
  visible: boolean;
  text: string;
  // anchor: center-x and top-y of the clicked element, relative to container
  anchorX: number;
  anchorY: number;
  anchorH: number;
};

// Isolated so it never re-renders when tooltip state changes (dangerouslySetInnerHTML
// would otherwise destroy the SVG DOM and wipe all event listeners + D3 zoom state)
const SvgContent = memo(({ html }: { html: string }) => (
  <div dangerouslySetInnerHTML={{ __html: html }} />
));

export default function InteractiveDesk() {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const resetZoomRef = useRef<(() => void) | null>(null);
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    text: "",
    anchorX: 0,
    anchorY: 0,
    anchorH: 0,
  });
  // Final clamped position applied after measuring the tooltip DOM
  const [tooltipPos, setTooltipPos] = useState({
    left: 0,
    top: 0,
    below: false,
  });

  useLayoutEffect(() => {
    if (!tooltip.visible || !tooltipRef.current || !containerRef.current)
      return;

    const tip = tooltipRef.current.getBoundingClientRect();
    const container = containerRef.current.getBoundingClientRect();
    const margin = 8;

    // Horizontal: clamp so the tooltip stays within the container
    const rawLeft = tooltip.anchorX;
    const left = Math.min(
      Math.max(rawLeft, tip.width / 2 + margin),
      container.width - tip.width / 2 - margin,
    );

    // Vertical: show above by default, flip below if not enough room
    const spaceAbove = tooltip.anchorY;
    const below = spaceAbove < tip.height + margin;
    const top = below
      ? tooltip.anchorY + tooltip.anchorH + margin
      : tooltip.anchorY - margin;

    setTooltipPos({ left, top, below });
  }, [tooltip]);

  useEffect(() => {
    fetch(workstationSvgUrl)
      .then((r) => r.text())
      .then(setSvgContent);
  }, []);

  useEffect(() => {
    if (!svgContent) return;
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    const svgEl = container.querySelector<SVGSVGElement>("svg");
    if (!svgEl) return;

    svgEl.setAttribute("width", "100%");
    svgEl.style.pointerEvents = "all";

    // Wrap visual children in a <g> so D3 zoom applies transforms in SVG coordinate
    // space (no pixelation). <style>, <defs> and #s-g2 stay as direct SVG children
    // so that the CSS :has(>#s-g2) animation selectors keep working.
    const zoomGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const toMove = Array.from(svgEl.children).filter(
      (el) =>
        el.tagName !== "defs" &&
        el.tagName !== "style" &&
        el.id !== "jbee_office_workstation_full-s-g2",
    );
    toMove.forEach((el) => zoomGroup.appendChild(el));
    const sg2 = svgEl.querySelector("#jbee_office_workstation_full-s-g2");
    svgEl.insertBefore(zoomGroup, sg2 ?? null);

    const containerSelection = select(container);
    const zoomBehavior = zoom<HTMLDivElement, unknown>()
      .scaleExtent([0.5, 8])
      .on("zoom", (event) => {
        zoomGroup.setAttribute("transform", event.transform.toString());
      });
    containerSelection.call(zoomBehavior);
    containerSelection.on("dblclick.zoom", null);

    resetZoomRef.current = () => {
      containerSelection.transition().duration(300).call(zoomBehavior.transform, zoomIdentity);
    };

    const clickElements = container.querySelectorAll<SVGElement>(
      '[id^="jbee_office_workstation_full-u-click"]',
    );
    const cleanups: (() => void)[] = [];

    clickElements.forEach((el) => {
      el.setAttribute("pointer-events", "all");
      el.style.cursor = "pointer";

      const handleMouseLeave = () => {
        setTooltip((prev) => ({ ...prev, visible: false }));
      };
      el.addEventListener("mouseleave", handleMouseLeave);
      cleanups.push(() =>
        el.removeEventListener("mouseleave", handleMouseLeave),
      );
    });

    const handleSvgClick = (e: Event) => {
      let target = e.target as Element | null;
      while (target && target !== (svgEl as Element)) {
        if (target.id?.startsWith("jbee_office_workstation_full-u-click_")) {
          const key = target.id.replace(
            "jbee_office_workstation_full-u-click_",
            "",
          );
          const text = TOOLTIP_CONTENT[key];
          if (text) {
            const rect = target.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            setTooltip({
              visible: true,
              text,
              anchorX: rect.left - containerRect.left + rect.width / 2,
              anchorY: rect.top - containerRect.top,
              anchorH: rect.height,
            });
            return;
          }
        }
        target = target.parentElement;
      }
      setTooltip((prev) => ({ ...prev, visible: false }));
    };

    svgEl.addEventListener("click", handleSvgClick);

    return () => {
      containerSelection.on(".zoom", null);
      svgEl.removeEventListener("click", handleSvgClick);
      cleanups.forEach((fn) => fn());
      resetZoomRef.current = null;
    };
  }, [svgContent]);

  return (
    <div
      ref={containerRef}
      className="border-primary bg-foreground relative w-full overflow-hidden rounded-2xl border-2"
    >
      <div className="pointer-events-none absolute top-3 left-1/2 z-10 flex -translate-x-1/2 flex-wrap items-center justify-center gap-x-4 gap-y-1 rounded-xl bg-black/40 px-4 py-2 text-xs text-white backdrop-blur-sm">
        <span className="hidden sm:inline">🖱️ Clic + glisser pour naviguer</span>
        <span className="hidden sm:inline">🔍 Molette pour zoomer</span>
        <span className="hidden sm:inline">👆 Cliquer sur un objet pour en savoir plus</span>
        <span className="sm:hidden">👆 Toucher pour explorer</span>
        <span className="sm:hidden">🔍 Pincer pour zoomer</span>
      </div>
      <button
        onClick={() => resetZoomRef.current?.()}
        className="absolute top-3 right-3 z-10 cursor-pointer rounded-xl bg-black/40 px-4 py-2 text-xs text-white backdrop-blur-sm transition-colors hover:bg-black/60"
      >
        ⌖ Recentrer
      </button>
      {svgContent ? (
        <div ref={innerRef}>
          <SvgContent html={svgContent} />
        </div>
      ) : (
        <div className="flex aspect-video w-full animate-pulse items-center justify-center bg-black/10">
          <span className="text-sm text-white/50">Chargement du bureau…</span>
        </div>
      )}
      {tooltip.visible && (
        <div
          ref={tooltipRef}
          className="pointer-events-none absolute z-20 max-w-xs rounded-lg bg-gray-900/95 px-3 py-2 text-sm text-white shadow-xl"
          style={{
            left: tooltipPos.left,
            top: tooltipPos.top,
            transform: `translateX(-50%)${tooltipPos.below ? "" : " translateY(-100%)"}`,
          }}
        >
          {tooltip.text}
          {tooltipPos.below ? (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900/95" />
          ) : (
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900/95" />
          )}
        </div>
      )}
    </div>
  );
}
