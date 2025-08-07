import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";

import { useToast } from "@/hooks/use-toast";
import logo from "../assets/Logo.png";
import icon from "/assets/Icon.png";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="bg-brand-green text-black text-sm sm:text-base m-4 py-2 text-center font-medium rounded-md">
        <a href="/free-courses" className="hover:underline">
          Free Courses 🌟 Sale Ends Soon, Get It Now →
        </a>
      </div>
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
              Contact
            </a>
          </nav>
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
                  handleInputChange("rememberMe", checked as boolean)
                }
              />
              <label htmlFor="remember" className="text-sm text-foreground">
                Remember Me
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-green hover:bg-brand-green text-black font-medium h-12"
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
              className="w-full h-12 bg-card border-border text-foreground hover:bg-card hover:text-foreground hover:border-border"
            >
              <img src={icon} width={20} alt="Google icon" />
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
  );
};

export default Login;
