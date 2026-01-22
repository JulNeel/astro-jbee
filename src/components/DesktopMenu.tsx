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
    <nav
      ref={menuRef}
      className={clsx("z-50 w-full px-4 sm:px-6 lg:px-8", {
        ["bg-offwhite shadow-primary-dark font-heading flex shadow-md transition-all duration-1000"]:
          !(isHomePage && !hasMenuScrolledPast),
        ["flex"]: !hasMenuScrolledPast,
        ["fixed top-0"]: hasMenuScrolledPast,
      })}
    >
      <a
        href="/"
        className={clsx(
          "flex w-auto py-2 transition-all delay-200 duration-500 ease-in-out",
          {
            ["hidden"]: !hasMenuScrolledPast && isHomePage,
            ["max-h-[130px]"]: !hasMenuScrolledPast,
            ["max-h-[90px]"]: hasMenuScrolledPast,
          },
        )}
      >
        <img src={logoUrl} alt={logoAlt} />
      </a>
      <ul className="my-2 ml-auto flex items-end gap-3">
        {menuItems.map((item) => (
          <li key={item.path}>
            <a
              href={item.path}
              target={item.target ?? "_self"}
              className={twMerge(
                clsx(
                  "text-primary hover:bg-primary hover:text-offwhite block px-4 py-2 text-3xl font-medium whitespace-nowrap transition-colors duration-500 ease-in-out",
                  {
                    ["hover:text-primary-dark hover:bg-offwhite text-purewhite"]:
                      !hasMenuScrolledPast && isHomePage,
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
  );
};

export default DesktopMenu;
