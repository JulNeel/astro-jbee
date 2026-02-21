import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

type ThemeToggleProps = {
  variant?: "desktop" | "mobile";
  vertical?: boolean;
};

const ThemeToggle = ({ variant = "desktop", vertical = false }: ThemeToggleProps) => {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored === "light" || stored === "dark" || stored === "system") {
      setTheme(stored);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      if (prefersDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const isMobile = variant === "mobile";

  const buttonBase = isMobile
    ? "flex items-center justify-center rounded-lg p-2 transition-colors duration-200"
    : "flex items-center justify-center rounded-md p-1.5 transition-colors duration-200";

  const activeClass = isMobile
    ? "bg-purewhite text-primary-dark"
    : "bg-primary text-purewhite";

  const inactiveClass = isMobile
    ? "text-offwhite hover:bg-primary-light hover:text-purewhite"
    : "text-foreground-nav hover:bg-primary-light hover:text-background";

  const iconSize = isMobile ? 22 : 18;

  const buttons: { mode: Theme; Icon: typeof Sun; label: string }[] = [
    { mode: "light", Icon: Sun, label: "Thème clair" },
    { mode: "dark", Icon: Moon, label: "Thème sombre" },
    { mode: "system", Icon: Monitor, label: "Thème système" },
  ];

  return (
    <div
      className={`flex items-center gap-1 ${vertical ? "flex-col" : ""} ${isMobile ? "rounded-xl bg-primary-contrast p-1" : "rounded-lg border border-border bg-background-nav p-0.5 shadow-sm"}`}
    >
      {buttons.map(({ mode, Icon, label }) => (
        <button
          key={mode}
          type="button"
          onClick={() => setTheme(mode)}
          title={label}
          aria-label={label}
          aria-pressed={theme === mode}
          className={`${buttonBase} ${theme === mode ? activeClass : inactiveClass}`}
        >
          <Icon size={iconSize} strokeWidth={1.75} />
        </button>
      ))}
    </div>
  );
};

export default ThemeToggle;
