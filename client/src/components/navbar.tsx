import { navigationLinks, organizationInfo } from "@/lib/page-content";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="flex justify-between items-center">
          <Link
            to="/"
            className="flex items-center text-3xl font-semibold space-x-2 text-center"
          >
            <img
              src="./bg-removed-logo.png"
              alt="Logo"
              width={35}
              height={35}
            />
            <span>{organizationInfo.logoText}</span>
          </Link>

          <nav className="hidden sm:flex items-center space-x-1">
            {navigationLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className="group flex items-center gap-x-2 px-4 py-2 rounded-full text-neutral-300 hover:text-white hover:bg-white/10 transition-all duration-300 ease-in-out"
                >
                  {Icon && (
                    <Icon
                      className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-in-out"
                      size={18}
                    />
                  )}
                  <span className="transition-transform duration-300 ease-in-out">
                    {link.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;