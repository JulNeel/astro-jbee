import { useEffect, useState } from "react";
import logo from "@images/logo_jbee_blanc.svg";

type MenuItem = {
  label: string;
  path: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
};

export type MobileMenuProps = {
  menuItems?: MenuItem[];
};

const MobileMenu = ({ menuItems = [] }: MobileMenuProps) => {
  const [isMenuOpened, setIsMenuOpened] = useState(false);

  // Bloque le scroll du body quand le menu mobile est ouvert
  useEffect(() => {
    if (isMenuOpened) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpened]);

  const toggleMenu = () => {
    setIsMenuOpened((prev) => !prev);
  };

  const handleLinkClick = () => {
    setIsMenuOpened(false);
  };

  return (
    <>
      {/* Bouton hamburger - visible uniquement en mobile */}
      <button
        className="shadow-primary focus:ring-primary-light fixed bottom-4 left-1/2 z-50 h-20 w-20 -translate-x-1/2 rounded-full bg-white shadow-md transition-transform focus:ring-2 focus:ring-offset-2 focus:outline-none"
        onClick={toggleMenu}
        aria-expanded={isMenuOpened}
        aria-label={isMenuOpened ? "Fermer le menu" : "Ouvrir le menu"}
        aria-controls="main-menu"
        type="button"
      >
        <span
          className={`hamburger relative inline-block h-10 w-10 ${isMenuOpened ? "open" : ""}`}
          aria-hidden="true"
        >
          <span className="connector bg-primary-dark absolute top-1/2 left-1/2 block h-1 w-10" />
          <span className="connector bg-primary-dark absolute top-1/2 left-1/2 block h-1 w-10" />
          <span className="connector bg-primary-dark absolute top-1/2 left-1/2 block h-1 w-10" />
        </span>
      </button>

      {/* Overlay mobile avec logo et menu */}
      <div
        className={`bg-primary-dark fixed inset-0 z-40 flex flex-col items-center justify-between px-8 py-12 backdrop-blur transition-all duration-300 ${
          isMenuOpened
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isMenuOpened}
      >
        <img
          src={logo.src}
          alt="Logo JBEE"
          width={250}
          height={80}
          className="mt-auto object-contain"
        />

        <nav id="main-menu" className="font-heading mt-auto mb-auto">
          <h2 className="sr-only">Menu principal</h2>
          <ul className="text-offwhite flex flex-col items-center justify-center gap-8">
            {menuItems.map((menuItem) => {
              const isExternal =
                menuItem.target === "_blank" ||
                menuItem.path.startsWith("http");

              return (
                <li key={menuItem.path}>
                  <a
                    className="text-4xl font-medium transition-colors hover:text-gray-200 focus:underline focus:outline-none"
                    href={menuItem.path}
                    target={menuItem.target ?? "_self"}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    onClick={handleLinkClick}
                  >
                    {menuItem.label}
                    {isExternal && (
                      <span className="sr-only">
                        {" "}
                        (ouvre dans un nouvel onglet)
                      </span>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto" />
      </div>

      <style>{`
        .hamburger .connector {
          transform-origin: center center;
          transition:
            transform 320ms cubic-bezier(0.2, 0.9, 0.2, 1),
            opacity 200ms linear;
        }
        .hamburger .connector:nth-child(1) {
          transform: translate(-50%, -14px);
        }
        .hamburger .connector:nth-child(2) {
          transform: translate(-50%, -50%);
        }
        .hamburger .connector:nth-child(3) {
          transform: translate(-50%, 10px);
        }
        .hamburger.open .connector:nth-child(1) {
          transform: translate(-50%, -50%) rotate(45deg);
        }
        .hamburger.open .connector:nth-child(2) {
          transform: translate(-50%, -50%) scaleX(0);
          opacity: 0;
        }
        .hamburger.open .connector:nth-child(3) {
          transform: translate(-50%, -50%) rotate(-45deg);
        }
      `}</style>
    </>
  );
};

export default MobileMenu;
