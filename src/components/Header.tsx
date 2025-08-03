import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="w-full bg-background border-b border-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-brand-green rounded-md flex items-center justify-center">
            <span className="text-background font-bold text-lg">n</span>
          </div>
          <span className="text-foreground font-bold text-xl">newlabel</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-foreground hover:text-brand-green transition-colors">
            Home
          </a>
          <a href="#" className="text-muted-foreground hover:text-brand-green transition-colors">
            About us
          </a>
          <a href="#" className="text-muted-foreground hover:text-brand-green transition-colors">
            Subsidiaries
          </a>
          <a href="#" className="text-muted-foreground hover:text-brand-green transition-colors">
            Blog
          </a>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-foreground hover:text-brand-green">
            Log In
          </Button>
          <Button className="bg-brand-green hover:bg-brand-green-hover text-background font-semibold">
            Sign Up
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;