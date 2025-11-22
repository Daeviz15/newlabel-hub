import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import logo from "../assets/Logo.png";

const Header = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const navigationItems = [
    { name: "Home", path: "/" },
    { name: "About us", path: "/about" },
    { name: "Channels", path: "/channels" },
    { name: "Contact", path: "/contact" }
  ];

  return (
    <>
      <header className="w-full bg-background border-b border-border sticky top-0 z-50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img 
              src={logo} 
              alt="brand-logo" 
              className="cursor-pointer transition-transform hover:scale-105"
              onClick={() => handleNavigation("/")}
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navigationItems.map((item, index) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                className={`${
                  item.path === "/" ? "text-white" : "text-muted-white"
                } hover:bg-[#FFFFFF1A] rounded-xl p-2 transition-all duration-300 ease-in-out text-sm xl:text-base font-vietnam bg-transparent border-none cursor-pointer hover:scale-105 hover:text-white`}
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-2 sm:space-x-4">
            <Button
              onClick={() => navigate("/login")}
              variant="ghost"
              className="text-white hover:bg-brand-green rounded-xl p-2 hover:text-black text-sm sm:text-base px-2 sm:px-4 transition-all duration-300 hover:scale-105"
            >
              Log In
            </Button>
            <Button
              onClick={() => navigate("/signup")}
              className="bg-brand-green hover:bg-brand-green-hover text-background font-semibold text-sm sm:text-base px-3 sm:px-6 py-2 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Join Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl hover:bg-[#FFFFFF1A] transition-all duration-300 ease-in-out"
            aria-label="Toggle mobile menu"
          >
            <div className="relative w-6 h-6">
              <Menu 
                className={`absolute top-0 left-0 w-6 h-6 text-white transition-all duration-300 ease-in-out ${
                  isMobileMenuOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'
                }`}
              />
              <X 
                className={`absolute top-0 left-0 w-6 h-6 text-white transition-all duration-300 ease-in-out ${
                  isMobileMenuOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'
                }`}
              />
            </div>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300 ease-in-out ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-background border-l border-border z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Mobile Menu Header */}
        
        <div className="flex items-center justify-between p-4 border-b border-border">
          <img src={logo} alt="brand-logo" className="h-8" />
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-xl hover:bg-[#FFFFFF1A] transition-colors"
            aria-label="Close mobile menu"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex flex-col p-4 space-y-2">
          {navigationItems.map((item, index) => (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.path)}
              className={`${
                item.path === "/" ? "text-white bg-[#FFFFFF1A]" : "text-muted-white"
              } hover:bg-[#FFFFFF1A] rounded-xl p-4 transition-all duration-300 ease-in-out text-left font-vietnam bg-transparent border-none cursor-pointer hover:text-white hover:translate-x-2 transform`}
              style={{
                animationDelay: `${index * 0.1}s`,
                animation: isMobileMenuOpen ? `slideInFromRight 0.3s ease-out ${index * 0.1}s both` : 'none'
              }}
            >
              {item.name}
            </button>
          ))}
        </nav>

        {/* Mobile Auth Buttons */}
        <div className="p-4 border-t border-border mt-auto">
          <div className="space-y-3">
            <Button
              onClick={() => {
                navigate("/login");
                setIsMobileMenuOpen(false);
              }}
              variant="ghost"
              className="w-full text-white hover:bg-brand-green rounded-xl p-3 hover:text-black transition-all duration-300 hover:scale-105"
            >
              Log In
            </Button>
            <Button
              onClick={() => {
                navigate("/signup");
                setIsMobileMenuOpen(false);
              }}
              className="w-full bg-brand-green hover:bg-brand-green-hover text-background font-semibold px-6 py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Join Now
            </Button>
          </div>
        </div>
      </div>


    </>
  );
};

export default Header;