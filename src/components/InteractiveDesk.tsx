import { memo, useEffect, useLayoutEffect, useRef, useState } from "react";
import { select } from "d3-selection";
import { zoom, zoomIdentity } from "d3-zoom";
import "d3-transition";
import confetti from "canvas-confetti";
import workstationSvgUrl from "@images/jbee_office_animated.svg?url";
import { TOOLTIP_CONTENT, TOOLTIP_LABELS } from "./InteractiveDesk.data";

// Maps a clickable element's id in the SVG to its tooltip key in InteractiveDesk.data.
const ELEMENT_ID_TO_TOOLTIP_KEY: Record<string, string> = {
  "the-office": "dundie",
  CI: "ci",
  "click-cci": "cci",
  "click-tour-lille": "tour-lille",
  sneakers: "sneakers",
  click_playstation: "playstation",
  "click-spider": "spider",
  "snk-anime": "snk",
  kaamelott: "kaamelott",
  platon: "platon",
  kant: "kant",
  "romain-gary": "romain-gary",
  cyrano: "cyrano",
  camus: "camus",
  sherlock: "sherlock",
  bicycle: "bicycle",
  "losc-sticker": "losc",
  nirvana: "nirvana",
  radiohead: "radiohead",
  marathon: "run",
  snare: "snare",
  chess: "chess",
  brel: "brel",
  "belle-ile": "belle-ile",
  music: "music",
  bass: "bass",
  ara: "ara",
  "claude-icon": "claude",
  wcag: "wcag",
  click_frameworks: "frameworks",
  "web-design": "ui",
  "water-bottle": "water",
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
const SvgContent = memo(({ html }: { html: string }) => (
  <div dangerouslySetInnerHTML={{ __html: html }} />
));

export default function InteractiveDesk() {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const resetZoomRef = useRef<(() => void) | null>(null);
  const svgElRef = useRef<SVGSVGElement | null>(null);
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [showPerfHint, setShowPerfHint] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isFullscreenRef = useRef(isFullscreen);
  isFullscreenRef.current = isFullscreen;
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
    if (!tooltipRef.current || !containerRef.current) return;
    if (!tooltip.visible) return;

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
    const KONAMI = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "b",
      "a",
    ];
    let buffer: string[] = [];

    const handleKeydown = (e: KeyboardEvent) => {
      // Ignore keystrokes from interactive desk items (they handle their own keyboard events)
      if ((e.target as Element)?.hasAttribute?.("data-interactive-desk-item"))
        return;
      buffer.push(e.key);
      if (buffer.length > KONAMI.length) buffer.shift();
      if (buffer.join(",") === KONAMI.join(",")) {
        buffer = [];
        const colors = ["#4d7c94", "#ffc100"];
        const end = Date.now() + 5000;
        (function frame() {
          confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors,
          });
          confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors,
          });
          if (Date.now() < end) requestAnimationFrame(frame);
        })();
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

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
    svgElRef.current = svgEl;

    svgEl.setAttribute("width", "100%");
    svgEl.setAttribute("height", "auto");
    svgEl.style.pointerEvents = "all";

    // Accessible name for screen readers. Deliberately aria-label (not a <title>
    // element): an SVG <title> triggers a native hover tooltip on every descendant,
    // showing this same generic text regardless of which object is hovered.
    svgEl.setAttribute("aria-label", "Bureau interactif de J.B.");
    svgEl.setAttribute("role", "img");

    // Focus styles injected into the SVG (CSS overrides presentation attributes)
    const focusStyle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "style",
    );
    focusStyle.textContent = `
      [data-interactive-desk-item]:focus { outline: none; }
      [data-interactive-desk-item]:focus-visible {
        fill: rgba(255, 193, 0, 0.25);
        stroke: var(--color-secondary);
        stroke-width: 3;
      }
    `;
    svgEl.insertBefore(focusStyle, svgEl.firstChild);

    // The SVG runs several always-on CSS animations (smoke, spider, clock hands,
    // logos, night overlay/stars/moons, claude icon). Repainting them every frame
    // competes with the pan/zoom transform for the frame budget, which is most
    // noticeable on mobile. Pausing them while a gesture is active frees that
    // budget so panning/zooming stays smooth.
    const pauseAnimationsStyle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "style",
    );
    pauseAnimationsStyle.textContent = `
      svg.is-panning #smoke-1,
      svg.is-panning #smoke-2,
      svg.is-panning #smoke-3,
      svg.is-panning #spider-orbit,
      svg.is-panning #night-overlay-light,
      svg.is-panning #moon-1,
      svg.is-panning #moon-2,
      svg.is-panning #moon-3,
      svg.is-panning #moon-4,
      svg.is-panning #react-logo,
      svg.is-panning #vue-logo,
      svg.is-panning #svelte-logo,
      svg.is-panning #astro-logo,
      svg.is-panning #clock_hour,
      svg.is-panning #clock_minute,
      svg.is-panning #claude-icon {
        animation-play-state: paused;
      }
      svg.reduced-motion #smoke-1,
      svg.reduced-motion #smoke-2,
      svg.reduced-motion #smoke-3,
      svg.reduced-motion #spider-orbit,
      svg.reduced-motion #night-overlay-light,
      svg.reduced-motion #moon-1,
      svg.reduced-motion #moon-2,
      svg.reduced-motion #moon-3,
      svg.reduced-motion #moon-4,
      svg.reduced-motion #react-logo,
      svg.reduced-motion #vue-logo,
      svg.reduced-motion #svelte-logo,
      svg.reduced-motion #astro-logo,
      svg.reduced-motion #clock_hour,
      svg.reduced-motion #clock_minute,
      svg.reduced-motion #claude-icon {
        animation: none !important;
      }
    `;
    svgEl.insertBefore(pauseAnimationsStyle, svgEl.firstChild);

    // Apply the pan/zoom transform to the HTML wrapper (not an SVG-internal <g>):
    // d3-zoom computes x/y in the container's CSS pixel space, and the SVG's
    // viewBox (5000x3200) is rendered much smaller than that, so a translate
    // applied inside the SVG's own coordinate system would move the image by only
    // a fraction of the pointer's actual movement. Transforming the wrapper keeps
    // both in the same coordinate space.
    inner.style.willChange = "transform";
    inner.style.transformOrigin = "0 0";

    const containerSelection = select(container);
    let rafId: number | null = null;
    let pendingTransform: string | null = null;
    const zoomBehavior = zoom<HTMLDivElement, unknown>()
      .scaleExtent([1, 16])
      // On touch, only engage pan/zoom for two-finger gestures (like Google
      // Maps embeds) so a one-finger swipe still scrolls the page normally
      // instead of dragging the desk. Mouse/wheel/trackpad behavior is
      // untouched — this mirrors d3-zoom's own default filter for those.
      .filter((event: Event) => {
        if (event.type.startsWith("touch")) {
          // Fullscreen has no competing page scroll to protect, so a
          // single finger is fine there — only require two fingers when
          // embedded in the page.
          const minTouches = isFullscreenRef.current ? 1 : 2;
          return (event as TouchEvent).touches.length >= minTouches;
        }
        const mouseEvent = event as MouseEvent;
        return (
          (!mouseEvent.ctrlKey || event.type === "wheel") &&
          !mouseEvent.button
        );
      })
      .on("start", () => {
        svgEl.classList.add("is-panning");
      })
      .on("zoom", (event) => {
        const { x, y, k } = event.transform;
        pendingTransform = `translate(${x}px, ${y}px) scale(${k})`;
        if (rafId === null) {
          rafId = requestAnimationFrame(() => {
            if (pendingTransform !== null) {
              inner.style.transform = pendingTransform;
            }
            rafId = null;
          });
        }
      })
      .on("end", () => {
        svgEl.classList.remove("is-panning");
      });
    containerSelection.call(zoomBehavior);
    containerSelection.on("dblclick.zoom", null);

    resetZoomRef.current = () => {
      containerSelection
        .transition()
        .duration(300)
        .call(zoomBehavior.transform, zoomIdentity);
    };

    const clickElements = Object.keys(ELEMENT_ID_TO_TOOLTIP_KEY)
      .map((id) => container.querySelector<SVGElement>(`#${CSS.escape(id)}`))
      .filter((el): el is SVGElement => el !== null);
    const cleanups: (() => void)[] = [];

    clickElements.forEach((el) => {
      const key = ELEMENT_ID_TO_TOOLTIP_KEY[el.id];
      const labelText = TOOLTIP_LABELS[key] ?? TOOLTIP_CONTENT[key] ?? key;

      el.setAttribute("tabindex", "0");
      el.setAttribute("role", "button");
      el.setAttribute("aria-label", labelText);
      el.setAttribute("aria-describedby", "interactive-desk-tooltip");
      el.setAttribute("pointer-events", "all");
      el.setAttribute("data-interactive-desk-item", "");
      el.style.cursor = "pointer";

      // Keyboard: Enter/Space activates, Escape closes
      const handleKeydown = (e: KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          el.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        }
        if (e.key === "Escape") {
          setTooltip((prev) => ({ ...prev, visible: false }));
          (e.currentTarget as SVGElement).blur();
        }
      };
      el.addEventListener("keydown", handleKeydown as EventListener);
      cleanups.push(() =>
        el.removeEventListener("keydown", handleKeydown as EventListener),
      );

      // Blur: close tooltip only when leaving the interactive group
      const handleBlur = (e: FocusEvent) => {
        const related = e.relatedTarget as Element | null;
        if (!related?.hasAttribute("data-interactive-desk-item")) {
          setTooltip((prev) => ({ ...prev, visible: false }));
        }
      };
      el.addEventListener("blur", handleBlur as EventListener);
      cleanups.push(() =>
        el.removeEventListener("blur", handleBlur as EventListener),
      );

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
        const key = target.id
          ? ELEMENT_ID_TO_TOOLTIP_KEY[target.id]
          : undefined;
        if (key) {
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
      if (rafId !== null) cancelAnimationFrame(rafId);
      containerSelection.on(".zoom", null);
      svgEl.removeEventListener("click", handleSvgClick);
      cleanups.forEach((fn) => fn());
      resetZoomRef.current = null;
    };
  }, [svgContent]);

  useEffect(() => {
    svgElRef.current?.classList.toggle("reduced-motion", reducedMotion);
  }, [reducedMotion, svgContent]);

  // The "disable animations" hint is only useful when it's likely to apply:
  // touch devices (weaker GPUs, more animation-related jank) show it right
  // away; everything else only sees it if we actually measure a low frame
  // rate, rather than guessing from screen size alone.
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      setShowPerfHint(true);
      return;
    }

    const SAMPLE_DURATION_MS = 2000;
    const FPS_THRESHOLD = 50;
    const start = performance.now();
    let frameCount = 0;
    let rafId: number;

    const sample = () => {
      frameCount++;
      const elapsed = performance.now() - start;
      if (elapsed < SAMPLE_DURATION_MS) {
        rafId = requestAnimationFrame(sample);
        return;
      }
      const fps = frameCount / (elapsed / 1000);
      if (fps < FPS_THRESHOLD) {
        setShowPerfHint(true);
      }
    };
    rafId = requestAnimationFrame(sample);

    return () => cancelAnimationFrame(rafId);
  }, []);

  // Safari still needs the webkit-prefixed fullscreen API.
  useEffect(() => {
    const getFullscreenElement = () =>
      document.fullscreenElement ??
      (document as unknown as { webkitFullscreenElement?: Element })
        .webkitFullscreenElement;

    const handleFullscreenChange = () => {
      setIsFullscreen(getFullscreenElement() === containerRef.current);
      // The container's dimensions just changed drastically; any existing
      // pan/zoom offset no longer makes sense.
      resetZoomRef.current?.();
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange,
      );
    };
  }, []);

  const handleToggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    const doc = document as unknown as {
      fullscreenElement?: Element;
      webkitFullscreenElement?: Element;
      exitFullscreen?: () => Promise<void>;
      webkitExitFullscreen?: () => Promise<void>;
    };
    const el = container as unknown as {
      requestFullscreen?: () => Promise<void>;
      webkitRequestFullscreen?: () => Promise<void>;
    };

    // iOS Safari has no Fullscreen API for arbitrary elements (only
    // <video> gets a native fullscreen) — simulate it with a fixed-position
    // overlay instead, toggled entirely through React state.
    if (!(el.requestFullscreen ?? el.webkitRequestFullscreen)) {
      setIsFullscreen((prev) => !prev);
      resetZoomRef.current?.();
      return;
    }

    if (doc.fullscreenElement ?? doc.webkitFullscreenElement) {
      (doc.exitFullscreen ?? doc.webkitExitFullscreen)?.call(document);
    } else {
      (el.requestFullscreen ?? el.webkitRequestFullscreen)?.call(container);
    }
  };

  // Escape closes the simulated (non-native) fullscreen overlay; native
  // fullscreen already handles Escape itself via the browser.
  useEffect(() => {
    if (!isFullscreen) return;
    const doc = document as unknown as {
      fullscreenElement?: Element;
      webkitFullscreenElement?: Element;
    };
    if (doc.fullscreenElement ?? doc.webkitFullscreenElement) return;

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFullscreen(false);
        resetZoomRef.current?.();
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [isFullscreen]);

  // Simulated fullscreen is a fixed overlay, not a real browser fullscreen —
  // lock page scroll behind it so the desk is the only thing that moves.
  useEffect(() => {
    if (!isFullscreen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isFullscreen]);

  return (
    <>
      <div className="bg-primary-dark text-offwhite dark:bg-offwhite dark:text-offblack border-primary/20 mb-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 rounded-xl border px-4 py-2 text-xs">
        <span className="hidden sm:inline">
          🖱️ Clic + glisser pour naviguer
        </span>
        <span className="hidden sm:inline">🔍 Molette pour zoomer</span>
        <span className="hidden sm:inline">
          👆 Cliquer sur un objet pour en savoir plus
        </span>
        <span className="hidden sm:inline">
          ⌨️ Tab pour naviguer · Entrée/Espace pour activer · Échap pour fermer
        </span>
        <span className="sm:hidden">👆 Toucher pour explorer</span>
        <span className="sm:hidden">
          ✌️ Deux doigts pour déplacer/zoomer
        </span>
      </div>
      {showPerfHint && (
        <label className="bg-primary-dark text-offwhite dark:bg-offwhite dark:text-offblack border-primary/20 mb-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-2 text-xs">
          <span>
            🚀 En cas de souci d'affichage de l'image, désactivez les animations
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={!reducedMotion}
            onClick={() => setReducedMotion((prev) => !prev)}
            className={`relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
              reducedMotion
                ? "bg-offwhite/30 dark:bg-offblack/30"
                : "bg-secondary"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                reducedMotion ? "translate-x-0" : "translate-x-5"
              }`}
            />
          </button>
        </label>
      )}
      <div
        ref={containerRef}
        role="application"
        aria-label="Bureau interactif — explorez les objets pour en savoir plus"
        aria-describedby="interactive-desk-instructions"
        className={`bg-foreground relative w-full overflow-hidden ${
          isFullscreen
            ? "fixed inset-0 z-100 h-screen w-screen touch-none"
            : "touch-pan-y rounded-2xl"
        }`}
      >
        <div className="absolute top-3 right-3 z-10 flex gap-2">
          <button
            onClick={() => resetZoomRef.current?.()}
            className="cursor-pointer rounded-xl bg-black/40 px-4 py-2 text-xs text-white backdrop-blur-sm transition-colors hover:bg-black/60"
          >
            ⌖ Recentrer
          </button>
          <button
            onClick={handleToggleFullscreen}
            className="cursor-pointer rounded-xl bg-black/40 px-4 py-2 text-xs text-white backdrop-blur-sm transition-colors hover:bg-black/60"
          >
            {isFullscreen ? "⤡ Quitter le plein écran" : "⛶ Plein écran"}
          </button>
        </div>
        {svgContent ? (
          <div ref={innerRef}>
            <SvgContent html={svgContent} />
          </div>
        ) : (
          <div className="flex aspect-video w-full animate-pulse items-center justify-center bg-black/10">
            <span className="text-sm text-white/50">Chargement du bureau…</span>
          </div>
        )}
        <div
          id="interactive-desk-tooltip"
          role="tooltip"
          ref={tooltipRef}
          className="pointer-events-none absolute z-20 max-w-xs rounded-lg bg-gray-900/95 px-3 py-2 text-sm text-white shadow-xl"
          style={{
            left: tooltipPos.left,
            top: tooltipPos.top,
            transform: `translateX(-50%)${tooltipPos.below ? "" : " translateY(-100%)"}`,
            visibility: tooltip.visible ? "visible" : "hidden",
          }}
          aria-hidden={!tooltip.visible}
        >
          {tooltip.text}
          {tooltipPos.below ? (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900/95" />
          ) : (
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900/95" />
          )}
        </div>
        {/* Instructions for screen readers */}
        <div id="interactive-desk-instructions" className="sr-only">
          Cette illustration contient 32 objets interactifs qui révèlent des
          informations sur J.B. : ses séries, ses passions, ses outils, sa vie
          de musicien… Naviguez entre les objets avec la touche Tab, puis
          appuyez sur Entrée ou Espace pour en savoir plus. Le contenu s'affiche
          et est lu automatiquement. Appuyez sur Échap pour fermer.
        </div>
        {/* Live region for screen readers */}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {tooltip.visible ? tooltip.text : ""}
        </div>
      </div>
    </>
  );
}
