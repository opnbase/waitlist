import { footerInfo } from "@/lib/page-content";

const Footer = () => {
  return (
    <footer>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <p className="text-sm text-neutral-400">
          &copy; {new Date().getFullYear()} {footerInfo.companyName}. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
