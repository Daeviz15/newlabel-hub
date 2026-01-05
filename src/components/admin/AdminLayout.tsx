"use client";

import { ReactNode, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  BookOpen, 
  PlusCircle, 
  Mic2, 
  BarChart3, 
  LogOut, 
  Menu, 
  X,
  ChevronRight,
  Home,
  Shield
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: ReactNode;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  description?: string;
}

const navItems: NavItem[] = [
  {
    label: "Courses",
    href: "/admin/courses",
    icon: BookOpen,
    description: "Manage all courses",
  },
  {
    label: "Create Course",
    href: "/admin/create-course",
    icon: PlusCircle,
    description: "Add a new course",
  },
  {
    label: "Podcasts",
    href: "/admin/podcasts",
    icon: Mic2,
    description: "Manage THC podcasts",
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
    description: "View platform stats",
  },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin-login");
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="min-h-screen bg-[#0b0b0b] flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-zinc-900/50 border-r border-zinc-800">
        {/* Logo Header */}
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white text-lg">Admin Panel</h1>
              <p className="text-xs text-zinc-500">NewLabel Management</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => navigate(item.href)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 group",
                isActive(item.href)
                  ? "bg-purple-600/20 text-purple-400 border border-purple-500/30"
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-colors",
                isActive(item.href) ? "text-purple-400" : "text-zinc-500 group-hover:text-purple-400"
              )} />
              <div className="flex-1">
                <span className="font-medium">{item.label}</span>
                {item.description && (
                  <p className="text-xs text-zinc-600 group-hover:text-zinc-500 mt-0.5">
                    {item.description}
                  </p>
                )}
              </div>
              <ChevronRight className={cn(
                "w-4 h-4 opacity-0 -translate-x-2 transition-all",
                isActive(item.href) ? "opacity-100 translate-x-0 text-purple-400" : "group-hover:opacity-50 group-hover:translate-x-0"
              )} />
            </button>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-zinc-800 space-y-2">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-zinc-400 hover:bg-zinc-800/50 hover:text-white transition-all duration-200"
          >
            <Home className="w-5 h-5" />
            <span className="text-sm">Back to Site</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={cn(
        "lg:hidden fixed top-0 left-0 h-full w-72 bg-zinc-900 border-r border-zinc-800 z-50 transform transition-transform duration-300",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Close Button */}
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Logo Header */}
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white text-lg">Admin Panel</h1>
              <p className="text-xs text-zinc-500">NewLabel Management</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => {
                navigate(item.href);
                setIsSidebarOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200",
                isActive(item.href)
                  ? "bg-purple-600/20 text-purple-400 border border-purple-500/30"
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-800 space-y-2">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-zinc-400 hover:bg-zinc-800/50 hover:text-white transition-all"
          >
            <Home className="w-5 h-5" />
            <span className="text-sm">Back to Site</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header - Mobile */}
        <header className="lg:hidden sticky top-0 z-30 bg-zinc-900/95 backdrop-blur border-b border-zinc-800 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-500" />
              <span className="font-semibold text-white">Admin Panel</span>
            </div>
            <div className="w-9" /> {/* Spacer for centering */}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
