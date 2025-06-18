import { navigationLinks, organizationInfo } from "@/lib/page-content";

const Navbar = () => {
  return (
    <header>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="flex justify-between items-center">
          <a
            href="/"
            className="flex items-center text-3xl font-semibold space-x-2 text-center"
          >
            <img
              src="./bg-removed-logo.png"
              alt="Logo"
              width={35}
              height={35}
            />
            <span>{organizationInfo.logoText}</span>
          </a>

          <nav className="hidden sm:block space-x-6">
            {navigationLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target={link?.href === "#" ? "_self" : "_blank"}
                className="text-neutral-300 hover:text-white transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
