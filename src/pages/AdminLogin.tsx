"use client";

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandedSpinner } from "@/components/ui/BrandedSpinner";
import { Shield, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Get redirect path from location state
  const from = (location.state as any)?.from?.pathname || "/admin/courses";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Step 1: Authenticate with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError("Invalid email or password. Please try again.");
        setIsLoading(false);
        return;
      }

      if (!authData.user) {
        setError("Authentication failed. Please try again.");
        setIsLoading(false);
        return;
      }

      // Step 2: Check if user has admin role
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", authData.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (roleError) {
        console.error("Role check error:", roleError);
        setError("An error occurred while verifying your access.");
        await supabase.auth.signOut();
        setIsLoading(false);
        return;
      }

      if (!roleData) {
        // User is not an admin
        setError("You don't have administrator privileges. Access denied.");
        toast({
          title: "Access Denied",
          description: "Your account doesn't have admin permissions.",
          variant: "destructive",
        });
        await supabase.auth.signOut();
        setIsLoading(false);
        return;
      }

      // Step 3: Success - redirect to admin panel
      toast({
        title: "Welcome, Admin! 🎉",
        description: "Successfully authenticated. Redirecting to admin panel...",
      });

      // Navigate to the admin page they were trying to access
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 500);

    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-gray-400">
            Enter your credentials to access the admin panel
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@newlabel.com"
                  required
                  disabled={isLoading}
                  className="pl-11 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  className="pl-11 pr-11 bg-zinc-800/50 border-zinc-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold transition-all duration-200 shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <BrandedSpinner size="sm" />
                  <span>Authenticating...</span>
                </div>
              ) : (
                <>
                  <Shield className="w-5 h-5 mr-2" />
                  Sign in to Admin Panel
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-zinc-900/50 px-2 text-gray-500">
                Restricted Access
              </span>
            </div>
          </div>

          {/* Back to main site */}
          <div className="text-center">
            <button
              onClick={() => navigate("/")}
              className="text-sm text-gray-400 hover:text-purple-400 transition-colors"
            >
              ← Back to main site
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-600 mt-6">
          This is a protected area. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
}
