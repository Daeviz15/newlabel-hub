import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Logo.png";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src={logo} alt="brand-logo" />
        </div>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
          <a
            href="#"
            className="text-foreground hover:text-brand-green transition-colors text-sm xl:text-base"
          >
            Home
          </a>
          <a
            href="#"
            className="text-muted-foreground hover:text-brand-green transition-colors text-sm xl:text-base"
          >
            About us
          </a>
          <a
            href="#"
            className="text-muted-foreground hover:text-brand-green transition-colors text-sm xl:text-base"
          >
            Subsidiaries
          </a>
          <a
            href="#"
            className="text-muted-foreground hover:text-brand-green transition-colors text-sm xl:text-base"
          >
            Blog
          </a>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Button
            onClick={() => navigate("/login")}
            variant="ghost"
            className="text-foreground hover:text-brand-green hover:text-black text-sm sm:text-base px-2 sm:px-4 hidden sm:inline-flex"
          >
            Log In
          </Button>
          <Button
            onClick={() => navigate("/signup")}
            className="bg-brand-green hover:bg-brand-green-hover text-background font-semibold text-sm sm:text-base px-3 sm:px-6 py-2"
          >
            Join Now
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
