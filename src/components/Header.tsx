import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import logo from "../assets/Logo.png";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Enhanced scroll behavior with smooth animation offset for sticky header
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      window.history.replaceState(null, "", `#${id}`);
    } else {
      // If element not found yet, retry after a short delay
      setTimeout(() => {
        const elRetry = document.getElementById(id);
        if (elRetry) {
          const headerOffset = 80;
          const elementPosition = elRetry.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
          window.history.replaceState(null, "", `#${id}`);
        }
      }, 200);
    }
  };

  const handleNavigation = (path: string) => {
    // If it's a hash link (e.g. "#channels"), scroll to the element instead of using react-router navigate
    if (path.startsWith("#")) {
      const id = path.slice(1);
      setIsMobileMenuOpen(false);
      // Small delay to ensure mobile menu closes smoothly before scroll
      setTimeout(() => {
        scrollToSection(id);
      }, 100);
      return;
    }

    // If on home page and navigating to home, scroll to top
    if (path === "/" && location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setIsMobileMenuOpen(false);
      return;
    }

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
    { name: "Channels", path: "#channels" },
    { name: "Contact", path: "/contact" }
  ];

  return (
    <>
      <header className="w-full bg-background border-b border-border sticky top-0 z-50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.img
              src={logo}
              alt="brand-logo"
              className="cursor-pointer"
              onClick={() => handleNavigation("/")}
              whileHover={{ scale: 1.05, rotate: [0, -5, 5, -5, 0] }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400 }}
            />
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navigationItems.map((item, index) => {
              const isActive = location.pathname === item.path || 
                               (item.path === "/" && location.pathname === "/");
              return (
                <motion.button
                  key={item.name}
                  onClick={() => handleNavigation(item.path)}
                  className={`${
                    isActive ? "text-white" : "text-muted-white"
                  } hover:bg-[#FFFFFF1A] rounded-xl p-2 relative text-sm xl:text-base font-vietnam bg-transparent border-none cursor-pointer hover:text-white overflow-hidden`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.1,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10">{item.name}</span>
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-[#70E002]/20 rounded-xl"
                      layoutId="activeNav"
                      initial={false}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#70E002]"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              );
            })}
          </nav>

          {/* Desktop Auth Buttons */}
          <motion.div
            className="hidden lg:flex items-center space-x-2 sm:space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => navigate("/login")}
                variant="ghost"
                className="text-white hover:bg-brand-green rounded-xl p-2 hover:text-black text-sm sm:text-base px-2 sm:px-4 transition-all duration-300"
              >
                Log In
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => navigate("/signup")}
                className="bg-brand-green hover:bg-brand-green-hover text-background font-semibold text-sm sm:text-base px-3 sm:px-6 py-2 transition-all duration-300 hover:shadow-lg"
              >
                Join Now
              </Button>
            </motion.div>
          </motion.div>

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
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-background border-l border-border z-50 lg:hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
              {navigationItems.map((item, index) => {
                const isActive = location.pathname === item.path || 
                                 (item.path === "/" && location.pathname === "/");
                return (
                  <motion.button
                    key={item.name}
                    onClick={() => handleNavigation(item.path)}
                    className={`${
                      isActive ? "text-white bg-[#FFFFFF1A]" : "text-muted-white"
                    } hover:bg-[#FFFFFF1A] rounded-xl p-4 text-left font-vietnam bg-transparent border-none cursor-pointer hover:text-white relative overflow-hidden`}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.1,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                    whileHover={{ x: 8, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10">{item.name}</span>
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 bg-[#70E002]/20 rounded-xl"
                        layoutId="activeMobileNav"
                        initial={false}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </nav>

            {/* Mobile Auth Buttons */}
            <motion.div
              className="p-4 border-t border-border mt-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <div className="space-y-3">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={() => {
                      navigate("/login");
                      setIsMobileMenuOpen(false);
                    }}
                    variant="ghost"
                    className="w-full text-white hover:bg-brand-green rounded-xl p-3 hover:text-black transition-all duration-300"
                  >
                    Log In
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={() => {
                      navigate("/signup");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-brand-green hover:bg-brand-green-hover text-background font-semibold px-6 py-3 transition-all duration-300 hover:shadow-lg"
                  >
                    Join Now
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


    </>
  );
};

export default Header;