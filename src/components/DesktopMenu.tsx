import { useIsElementAtInitialPosition } from "@hooks/useIsElementAtInitialPosition";
import { useIsScrolled } from "@hooks/useIsScrolled";
import { useRef } from "react";
import clsx from "clsx";

type MenuItem = {
  label: string;
  path: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
};

export type DesktopMenuProps = {
  menuItems?: MenuItem[];
};

const DesktopMenu = ({ menuItems = [] }: DesktopMenuProps) => {
  const menuRef = useRef<HTMLElement>(null);
  const isMenuAtInitialPosition = useIsElementAtInitialPosition(menuRef);
  return (
    <nav
      ref={menuRef}
      className={clsx("px-4 sm:px-6 lg:px-8", {
        ["fixed top-0 z-50 w-full bg-white transition-colors duration-500"]:
          isMenuAtInitialPosition,
      })}
    >
      <ul className="flex items-center justify-end gap-3">
        {menuItems.map((item) => (
          <li>
            <a
              href={item.path}
              target={item.target ?? "_self"}
              className={clsx(
                "block px-4 py-2 text-3xl font-medium transition-colors duration-500 ease-in-out",
                {
                  ["text-primary hover:bg-primary hover:text-white"]:
                    isMenuAtInitialPosition,
                  ["hover:text-primary text-white hover:bg-white"]:
                    !isMenuAtInitialPosition,
                },
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
