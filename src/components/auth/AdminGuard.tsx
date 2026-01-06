"use client";

import { useState, useEffect, ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PageLoader } from "@/components/ui/BrandedSpinner";
import { Shield, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminGuardProps {
  children: ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        // Check if user is logged in
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          setIsAuthenticated(false);
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        setIsAuthenticated(true);

        // Check if user has admin role
        const { data: roleData, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .eq("role", "admin")
          .maybeSingle();

        if (error) {
          console.error("Error checking admin role:", error);
          setIsAdmin(false);
        } else {
          setIsAdmin(!!roleData);
        }
      } catch (error) {
        console.error("Admin check error:", error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAccess();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAdminAccess();
    });

    return () => subscription.unsubscribe();
  }, []);

  // Show loading spinner while checking
  if (isLoading) {
    return <PageLoader message="Verifying admin access..." />;
  }

  // Redirect to admin login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          {/* Access Denied Icon */}
          <div className="mx-auto w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center">
            <Shield className="w-10 h-10 text-red-500" />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">Access Denied</h1>
            <p className="text-gray-400">
              You don't have permission to access the admin panel. 
              This area is restricted to authorized administrators only.
            </p>
          </div>

          {/* Lock Icon with Animation */}
          <div className="flex justify-center gap-2 text-gray-500">
            <Lock className="w-4 h-4" />
            <span className="text-sm">Protected Area</span>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-4">
            <Button
              onClick={() => window.location.href = "/dashboard"}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Go to Dashboard
            </Button>
            <Button
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = "/admin-login";
              }}
              variant="outline"
              className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Sign in with different account
            </Button>
          </div>

          {/* Help Text */}
          <p className="text-xs text-gray-600 pt-4">
            If you believe you should have admin access, please contact the system administrator.
          </p>
        </div>
      </div>
    );
  }

  // User is authenticated and is an admin
  return <>{children}</>;
}

export default AdminGuard;
