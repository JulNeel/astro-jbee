import { memo, useEffect, useLayoutEffect, useRef, useState } from "react";
import { select } from "d3-selection";
import { zoom } from "d3-zoom";
import workstationSvg from "@images/jbee_office_workstation_full.svg?raw";

const TOOLTIP_CONTENT: Record<string, string> = {
  dundie:
    "🏢 The Office ! La version US, ne serait-ce que pour Steve Carrell !",
  luffy: "🏴‍☠️ One Piece — Bientôt 20 ans que je suis l'anime !",
  controller:
    "🎮 Sans être un gamer et malgré le manque de temps, un trio me suit depuis longtemps : Fifa, Zelda et Mario Kart !",
  spider:
    "🕷️ Chaque fois que je me fais mordre par une araignée, je me dis qu'avec un peu de chance, demain matin...",
  snk: "⚔️ Shingeki no Kyojin (L'Attaque des Titans) — L'anime est une GROSSE GROSSE claque !",
  kaamelott:
    "👑 Kaamelott — bien placé, un 'j'ai ma chemise, mais c'est mou' peut me faire éclater de rire !",
  books: "📚 Queques bouquins qui m'ont marqué...",
  pasta: "🍝 S'il ne devait restait qu'un ingrédient !",
  bicycle: "🚴 Jamais sans mon gravel !",
  hunter: "Hunter x Hunter — une pépite !",
  losc: "🐕‍🦺 Nous sommes le enfants de la Déesse, nous sommes les enfants de Lille !",
  posters: "🎸 Quelques artistes que j'affectionne particulièrement.",
  run: "🫣 1er Marathon le 25/10 à Lille...",
  triforce: "🔺 La Triforce — Zelda forever !",
  drumsticks: "🥁 On pourrait se croiser dans les jams lilloises...",
  chess:
    "♟️ Je joue beaucoup trop lentement, alors je perds souvent... mais j'adore ça !",
  brel: "Brel par le street artiste Roubaisien B.KLUCK 👩‍🎨",
  "belle-ile": "Belle île la bien nommée... ♥️",
  music:
    "🎵 \"I like pleasure spiked w/pain Music is my aeroplaneIt's my aeroplane Songbird sweet and sour Jane Music is my aeroplane It's my aeroplane \"",
  ci: "CI - J'offre une bouteille  de champagne 🍾 à qui devine cette réf de niche ! (on cherche une série TV des années 80... je veux également l'épisode ! ",
  claude:
    "🤖 Mon assistant ! Volontaire, souvent très efficace, il nécessite cependant pour l'instant une surveillance de tous les instants ! ",
};

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
const SvgContent = memo(() => (
  <div dangerouslySetInnerHTML={{ __html: workstationSvg }} />
));

export default function InteractiveDesk() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
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
    const container = containerRef.current;
    if (!container) return;

    const svgEl = container.querySelector<SVGSVGElement>("svg");
    if (!svgEl) return;

    svgEl.setAttribute("width", "100%");
    svgEl.removeAttribute("height");
    svgEl.style.pointerEvents = "all";

    // Zoom via viewBox — preserves SVG DOM so CSS animations (:has(>...) selectors) keep working
    const vbSize = 550;
    const svgSelection = select(svgEl);
    const zoomBehavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 8])
      .on("zoom", (event) => {
        const { x, y, k } = event.transform;
        const w = svgEl.clientWidth || vbSize;
        const newW = vbSize / k;
        const newX = (-x / k) * (vbSize / w);
        const newY = (-y / k) * (vbSize / w);
        svgEl.setAttribute("viewBox", `${newX} ${newY} ${newW} ${newW}`);
      });
    svgSelection.call(zoomBehavior);
    svgSelection.on("dblclick.zoom", null);

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
      svgSelection.on(".zoom", null);
      svgEl.removeEventListener("click", handleSvgClick);
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="border-primary bg-foreground relative w-full overflow-hidden rounded-2xl border-2"
    >
      <div className="pointer-events-none absolute top-3 left-1/2 z-10 flex -translate-x-1/2 flex-wrap items-center justify-center gap-x-4 gap-y-1 rounded-xl bg-black/40 px-4 py-2 text-xs text-white backdrop-blur-sm">
        <span>🖱️ Clic + glisser pour naviguer</span>
        <span>🔍 Molette pour zoomer</span>
        <span>👆 Cliquer sur un objet pour en savoir plus</span>
      </div>
      <SvgContent />
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
