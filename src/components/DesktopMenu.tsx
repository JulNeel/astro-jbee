import { useHasScrolledPast } from "@hooks/useHasScrolledPast";
import clsx from "clsx";
import { useRef } from "react";
import { twMerge } from "tailwind-merge";

type MenuItem = {
  label: string;
  path: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
};

export type DesktopMenuProps = {
  menuItems?: MenuItem[];
  isHomePage?: boolean;
  logoUrl?: string;
  logoAlt?: string;
};

const DesktopMenu = ({
  menuItems = [],
  isHomePage = false,
  logoUrl = "/logo.svg",
  logoAlt = "Logo",
}: DesktopMenuProps) => {
  const menuRef = useRef<HTMLElement>(null);
  const hasMenuScrolledPast = useHasScrolledPast(menuRef, 100);

  return (
    <>
      <div
        className={clsx("h-[70px]", {
          ["hidden"]: !hasMenuScrolledPast,
          ["block"]: hasMenuScrolledPast,
        })}
      ></div>
      <div
        className={clsx(
          "font-heading z-50 mx-auto w-full px-4 sm:px-6 lg:px-8",
          {
            ["bg-background-desktop-menu-sticked shadow-primary-dark flex shadow-md transition-all duration-1000"]:
              !(isHomePage && !hasMenuScrolledPast),
            ["flex"]: !hasMenuScrolledPast,
            ["fixed top-0"]: hasMenuScrolledPast,
          },
        )}
      >
        <nav
          ref={menuRef}
          className="mx-auto flex w-full max-w-7xl items-center justify-between"
        >
          <a
            href="/"
            className={clsx(
              "flex h-full w-auto py-2 transition-all delay-200 duration-500 ease-in-out",
              {
                ["hidden"]: !hasMenuScrolledPast && isHomePage,
                ["max-h-[130px]"]: !hasMenuScrolledPast,
                ["max-h-[70px]"]: hasMenuScrolledPast,
              },
            )}
          >
            <img src={logoUrl} alt={logoAlt} className="h-full w-auto" />
          </a>
          <ul className="my-2 ml-auto flex items-end gap-3">
            {menuItems.map((item) => (
              <li key={item.path}>
                <a
                  href={item.path}
                  target={item.target ?? "_self"}
                  className={twMerge(
                    clsx(
                      "text-foreground-desktop-menu-sticked hover:bg-foreground-desktop-menu-sticked hover:text-background-desktop-menu-sticked block px-4 py-2 text-3xl font-medium whitespace-nowrap transition-colors duration-500 ease-in-out",
                      {
                        ["text-foreground-desktop-menu hover:text-background-desktop-menu hover:bg-foreground-desktop-menu"]:
                          isHomePage && !hasMenuScrolledPast,
                      },
                    ),
                  )}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default DesktopMenu;
