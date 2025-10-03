import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Menu, X } from "lucide-react";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";

import { useToast } from "@/hooks/use-toast";
import logo from "../assets/Logo.png";
import logoOne from "/assets/logos.png";
import icon from "/assets/Icon.png";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Logged in successfully!",
      });

      // Redirect to dashboard
      navigate("/dashboard");
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

  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;
      if (data?.url) {
        if (window.top) {
          window.top.location.href = data.url;
        } else {
          window.location.href = data.url;
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Google sign-in failed. Please try again.",
        variant: "destructive",
      });
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
            {/* Desktop Logo */}
            <div className="hidden lg:flex items-center space-x-2">
              <img 
                src={logo} 
                alt="brand-logo" 
                className="cursor-pointer transition-transform hover:scale-105"
                onClick={() => handleNavigation("/")}
              />
            </div>

            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center ">
              <img 
                src={logoOne} 
                alt="brand-logo-mobile" 
                className="h-8 cursor-pointer transition-transform hover:scale-105"
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

        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Login</h1>
              <p className="text-muted-foreground">
                Welcome back! Please log in to access your account.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleLogin}>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your Email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="bg-card border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your Password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="bg-card border-border text-foreground placeholder:text-muted-foreground pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <div className="text-right">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-brand hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) =>
                    handleInputChange("rememberMe", checked)
                  }
                />
                <label htmlFor="remember" className="text-sm text-foreground">
                  Remember Me
                </label>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-green hover:bg-brand-green text-black font-medium h-12 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                {loading ? "Logging in..." : "Login"}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    OR
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
                className="w-full h-12 bg-card border-border text-foreground hover:bg-card hover:text-foreground hover:border-border transition-all duration-300 hover:scale-105"
              >
                <img src={icon} width={20} alt="Google sign-in icon" />
                Login with Google
              </Button>

              <div className="flex items-center justify-center gap-2">
                <span className="text-muted-foreground">
                  Don't have an account?{" "}
                </span>
                <Link to="/signup" className="text-[#70E002] hover:underline">
                  Sign Up
                </Link>
                <ArrowUpRightIcon width={15} className="text-[#70E002]" />
              </div>
            </form>
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
        {/* Mobile Menu Header */}
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

export default Login;