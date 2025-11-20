import React, { useEffect, useState } from "react";

type MenuItem = {
  label: string;
  path: string;
  isExternalLink?: boolean;
};

export type ResponsiveMenuProps = {
  menuItems: MenuItem[];
  theme: "whiteBackgroundMenu" | "transparentBackgroundMenu";
};

const ResponsiveMenu: React.FC<ResponsiveMenuProps> = ({ menuItems, theme }) => {
  const [isMenuOpened, setIsMenuOpened] = useState(false);

  useEffect(() => {
    if (isMenuOpened) {
      document.body.classList.add();
    } else {
      document.body.classList.remove();
    }
  }, [isMenuOpened]);

  return (
    <>
      <button
        className=""
        onClick={() => setIsMenuOpened(!isMenuOpened)}
        aria-expanded={isMenuOpened}
        aria-label="Menu"
        aria-controls="main-menu"
        role="button"
      >
        <span className=""></span>
      </button>
      <nav id="main-menu" className="">
        <ul className="">
          {menuItems.map((menuItem) => (
            <li className="" key={menuItem.path}>
              {menuItem.isExternalLink ? (
                <a className="" href={menuItem.path} target="_blank" rel="noopener noreferrer">
                  {menuItem.label}
                </a>
              ) : (
                <a className="">{menuItem.label}</a>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default ResponsiveMenu;
