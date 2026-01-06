import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { InlineLoader } from "@/components/ui/BrandedSpinner";
import logo from "../assets/Logo.png";
import logoOne from "/assets/logos.png";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setEmailSent(true);
      toast({
        title: "Success",
        description: "Password reset link has been sent to your email!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const navigationItems = [
    { name: "Home", path: "/" },
    { name: "About us", path: "/about" },
    { name: "Subsidiaries", path: "/subsidiaries" },
    { name: "Contact", path: "/contact" }
  ];

  return (
    <>
      <div className="min-h-screen bg-background flex flex-col">
        <div className="bg-brand-green text-black text-sm sm:text-base m-4 py-2 text-center font-medium rounded-md">
          <a href="/free-courses" className="hover:underline">
            Free Courses 🌟 Sale Ends Soon, Get It Now →
          </a>
        </div>
        
        <header className="w-full bg-background border-b border-border sticky top-0 z-50 backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
            <div className="hidden lg:flex items-center space-x-2">
              <img 
                src={logo} 
                alt="brand-logo" 
                className="cursor-pointer transition-transform hover:scale-105"
                onClick={() => handleNavigation("/")}
              />
            </div>

            <div className="lg:hidden flex items-center ">
              <img 
                src={logoOne} 
                alt="brand-logo-mobile" 
                className="h-8 cursor-pointer transition-transform hover:scale-105"
                onClick={() => handleNavigation("/")}
              />
            </div>

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

        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Reset Password</h1>
              <p className="text-muted-foreground">
                {emailSent 
                  ? "Check your email for a password reset link"
                  : "Enter your email to receive a password reset link"}
              </p>
            </div>

            {!emailSent ? (
              <form className="space-y-4" onSubmit={handleResetPassword}>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-card border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-green hover:bg-brand-green/90 text-black font-medium h-12 transition-all duration-300 hover:scale-105 hover:shadow-lg rounded-full"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <InlineLoader />
                      <span>Sending...</span>
                    </div>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>

                <div className="text-center">
                  <Link to="/login" className="text-sm text-brand hover:underline">
                    Back to Login
                  </Link>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-card border border-border rounded-lg text-center">
                  <p className="text-foreground">
                    We've sent a password reset link to <strong>{email}</strong>
                  </p>
                  <p className="text-muted-foreground text-sm mt-2">
                    Please check your email and click the link to reset your password.
                  </p>
                </div>

                <Button
                  onClick={() => handleNavigation("/login")}
                  className="w-full bg-brand-green hover:bg-brand-green text-black font-medium h-12 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  Return to Login
                </Button>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>

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
        <div className="flex items-center justify-between p-4 border-b border-border">
          <img src={logoOne} alt="brand-logo-mobile" className="h-8" />
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-xl hover:bg-[#FFFFFF1A] transition-colors"
            aria-label="Close mobile menu"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

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

        <div className="p-4 border-t border-border mt-auto">
          <div className="space-y-3">
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

export default ForgotPassword;
