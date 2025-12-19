import { themeAssetsService } from "@content/api/wordpress/services/themeAssets";
import { useHasScrolledPast } from "@hooks/useHasScrolledPast";
import clsx from "clsx";
import { useRef } from "react";

type MenuItem = {
  label: string;
  path: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
};

export type DesktopMenuProps = {
  menuItems?: MenuItem[];
  isHomePage?: boolean;
};
const { custom_logo } = await themeAssetsService.getThemeAssets();

const DesktopMenu = ({
  menuItems = [],
  isHomePage = false,
}: DesktopMenuProps) => {
  const menuRef = useRef<HTMLElement>(null);
  const hasMenuScrolledPast = useHasScrolledPast(menuRef, 100);

  return (
    <nav
      ref={menuRef}
      className={clsx("w-full px-4 sm:px-6 lg:px-8", {
        ["flex bg-white shadow transition-colors duration-500"]: !(
          isHomePage && !hasMenuScrolledPast
        ),
        ["flex"]: !hasMenuScrolledPast,
        ["fixed top-0"]: hasMenuScrolledPast,
      })}
    >
      <a
        href="/"
        className={clsx(
          "flex w-auto py-2 transition-[max-height] delay-200 duration-500 ease-in-out hover:scale-105",
          {
            ["hidden"]: !hasMenuScrolledPast && isHomePage,
            ["max-h-[130px]"]: !hasMenuScrolledPast,
            ["max-h-[90px]"]: hasMenuScrolledPast,
          },
        )}
      >
        <img src={custom_logo.url} alt={custom_logo.alt} />
      </a>
      <ul className="my-2 ml-auto flex items-end gap-3">
        {menuItems.map((item) => (
          <li key={item.path}>
            <a
              href={item.path}
              target={item.target ?? "_self"}
              className={clsx(
                "text-primary hover:bg-primary block px-4 py-2 text-3xl font-medium transition-colors duration-500 ease-in-out hover:text-white",
                {
                  ["hover:text-primary text-white hover:bg-white"]:
                    !hasMenuScrolledPast && isHomePage,
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
