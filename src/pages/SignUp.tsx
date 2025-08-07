import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { useToast } from "@/hooks/use-toast";
import icon from "/assets/Icon.png";
import logo from "../assets/Logo.png";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.agreeToTerms) {
      toast({
        title: "Error",
        description: "Please agree to the terms and conditions",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            full_name: formData.fullName,
          },
        },
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
        description:
          "Account created successfully! Please check your email for verification.",
      });

      // Redirect to dashboard if sign up was successful
      if (data.user) {
        navigate("/dashboard");
      }
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
            <h1 className="text-3xl font-bold text-foreground">Sign Up</h1>
            <p className="text-muted-foreground">
              Create an account to unlock exclusive features.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSignUp}>
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-foreground">
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your Name"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className="bg-card border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

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
                  placeholder="Create Password"
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter Password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  className="bg-card border-border text-foreground placeholder:text-muted-foreground pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) =>
                  handleInputChange("agreeToTerms", checked as boolean)
                }
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                I agree with{" "}
                <Link to="/terms" className="text-brand-green hover:underline">
                  Terms of Use
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-brand-green hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-green hover:bg-brand/90 text-black font-medium h-12"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-gray-500 border-t border-border" />
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
              Sign Up with Google
            </Button>

            <div className=" flex justify-center items-center gap-2">
              <span className="text-muted-foreground">
                Already have an account?{" "}
              </span>
              <Link to="/login" className="text-[#70E002] hover:underline">
                Login
              </Link>
              <ArrowUpRightIcon width={15} className="text-[#70E002]"/>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SignUp;