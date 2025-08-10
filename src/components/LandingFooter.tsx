import footerLogo from "/assets/logo.png";
import facebook from "/assets/facebook.png";
import twitter from "/assets/twitter.png";
import instagram from "/assets/instagram.png";

const LandingFooter = () => {
  return (
    <footer className="w-full bg-[#70E002] text-black py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Left Section - Logo and Description */}
          <div className="lg:col-span-2 space-y-8">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <img src={footerLogo} alt="footerLogo" />
              <h1 className="font-bold font-montserrat text-4xl">newlabel</h1>
            </div>

            {/* Description */}
            <div className="w-[270px]">
              <p className="text-black text-[14px] leading-loose max-w-md font-poppins font-light ">
                Newlabel is your go-to platform for a world of entertainment,
                offering a vast library of films, TV shows, and exclusive
                content.
              </p>
            </div>

            {/* Social Media Icons */}
            <div className="flex space-x-6">
              <a
                href="#"
                className="w-10 h-10  rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
              >
                <img src={facebook}  width={38} alt="facebook" />
              </a>

              <a
                href="#"
                className="w-10 h-10  rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
              >
                <img src={twitter} width={38} alt="twitter" />
              </a>

              <a
                href="#"
                className="w-10 h-10  rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
              >
                <img src={instagram} width={38} alt="instagram" />
              </a>
            </div>
          </div>

          {/* Company Column */}
          <div className="space-y-8">
            <h3 className="text-black font-semibold text-lg font-poppins">
              Company
            </h3>
            <ul className="space-y-8 text-[14px] font-light">
              <li>
                <a
                  href="#"
                  className="text-black hover:text-gray-700 transition-colors underline  font-poppins"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-black hover:text-gray-700 transition-colors underline  font-poppins"
                >
                  Brands
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-black hover:text-gray-700 transition-colors underline  font-poppins"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-black hover:text-gray-700 transition-colors underline  font-poppins"
                >
                  Investors
                </a>
              </li>
            </ul>
          </div>

          {/* Help & Support Column */}
          <div className="space-y-8">
            <h3 className="text-black font-semibold text-lg">Help & Support</h3>
            <ul className="space-y-8 text-[14px] font-light">
              <li>
                <a
                  href="#"
                  className="text-black hover:text-gray-700 transition-colors underline font-poppins"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-black hover:text-gray-700 transition-colors underline font-poppins"
                >
                  FAQs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-black hover:text-gray-700 transition-colors underline font-poppins"
                >
                  Support
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-black hover:text-gray-700 transition-colors underline font-poppins"
                >
                  Account & Payments
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="space-y-8">
            <h3 className="text-black font-semibold text-lg">Legal</h3>
            <ul className="space-y-8 text-[14px] font-light">
              <li>
                <a
                  href="#"
                  className="text-black hover:text-gray-700 transition-colors underline font-poppins"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-black hover:text-gray-700 transition-colors underline font-poppins"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-black hover:text-gray-700 transition-colors underline font-poppins"
                >
                  Cookie Preferences
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-black hover:text-gray-700 transition-colors underline font-poppins"
                >
                  Accessibility
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-8 border-t border-black/20">
          <p className="text-black text-center font-poppins">
            ©All Rights Reserved. 2025 Newlabel TV
          </p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
