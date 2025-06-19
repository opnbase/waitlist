import { footerInfo } from "@/lib/page-content";
import { Link } from 'react-router-dom'; 

const Footer = () => {
  return (
    <footer>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <div className="flex justify-center items-center space-x-4">
          <p className="text-sm text-neutral-400">
            &copy; {new Date().getFullYear()} {footerInfo.companyName}. All rights
            reserved.
          </p>
          <span className="text-neutral-400">|</span>
          <Link to="/privacy-notice" className="text-sm text-neutral-400 hover:text-white">
            Privacy Notice
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;