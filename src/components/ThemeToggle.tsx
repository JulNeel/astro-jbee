import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

type ThemeToggleProps = {
  vertical?: boolean;
};

const ThemeToggle = ({ vertical = false }: ThemeToggleProps) => {
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

  const buttons: { mode: Theme; Icon: typeof Sun; label: string }[] = [
    { mode: "light", Icon: Sun, label: "Thème clair" },
    { mode: "dark", Icon: Moon, label: "Thème sombre" },
    { mode: "system", Icon: Monitor, label: "Thème système" },
  ];

  return (
    <div
      className={`flex items-center gap-1 border-border bg-background-nav rounded-lg border p-0.5 shadow-sm ${vertical ? "flex-col" : ""}`}
    >
      {buttons.map(({ mode, Icon, label }) => (
        <button
          key={mode}
          type="button"
          onClick={() => setTheme(mode)}
          title={label}
          aria-label={label}
          aria-pressed={theme === mode}
          className={`flex items-center justify-center rounded-md p-1.5 transition-colors duration-200 ${theme === mode ? "bg-primary text-purewhite" : "text-foreground-nav hover:bg-primary-light hover:text-background"}`}
        >
          <Icon size={18} strokeWidth={1.75} />
        </button>
      ))}
    </div>
  );
};

export default ThemeToggle;
