"use client";

import {
  ChevronDown,
  Search,
  ShoppingCart,
  Heart,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getSaved, onSavedChange } from "@/hooks/use-saved";
import { useNavigate } from "react-router-dom";
import logo from "/assets/Thc.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function THomeHeader({
  search,
  onSearchChange,
  userName,
  userEmail,
  avatarUrl,
  onSignOut,
}: {
  search: string;
  onSearchChange: (q: string) => void;
  userName?: string;
  userEmail?: string;
  avatarUrl?: string;
  onSignOut?: () => void;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileChannelsOpen, setIsMobileChannelsOpen] = useState(false);
  const [savedCount, setSavedCount] = useState<number>(getSaved().length);
  const navigate = useNavigate();

  useEffect(() => {
    setSavedCount(getSaved().length);
    return onSavedChange(() => setSavedCount(getSaved().length));
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0c0c0c]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0c0c0c]/75 transition-all duration-300">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-2 px-3 sm:h-16 sm:gap-4 sm:px-4 md:px-6 lg:px-8">
        {/* Left: Logo + Desktop Nav */}
        <div className="flex items-center gap-4 md:gap-6">
          <button
            aria-label="Newlabel Home"
            className="flex items-center gap-2 transition-transform duration-200 hover:scale-105"
          >
            <img
              src={logo || "/placeholder.svg"}
              alt="newlabel"
              className="h-6 sm:h-7 lg:h-8 xl:h-9 w-auto cursor-pointer"
            />
            <span className="sr-only">Newlabel Home</span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-4 text-[13px] text-zinc-300 lg:flex xl:gap-5">
            <a
              className="relative transition-colors font-vietnam duration-200 hover:text-white after:absolute after:bottom-[-2px] after:left-0 after:h-0.5 after:w-0 after:bg-[#70E002] after:transition-all after:duration-300 hover:after:w-full"
              href="/thc-dashboard"
            >
              Home
            </a>
            <a
              className="relative font-vietnam transition-colors duration-200 hover:text-white after:absolute after:bottom-[-2px] after:left-0 after:h-0.5 after:w-0 after:bg-[#70E002]  after:transition-all after:duration-300 hover:after:w-full"
              href="/thc-courses"
            >
              Courses
            </a>
            <a
              className="relative font-vietnam transition-colors duration-200 hover:text-white after:absolute after:bottom-[-2px] after:left-0 after:h-0.5 after:w-0 after:bg-[#70E002]  after:transition-all after:duration-300 hover:after:w-full"
              href="/thc-about"
            >
              About
            </a>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="group inline-flex items-center gap-1 font-vietnam transition-colors duration-200 hover:text-white">
                  <span>Thc</span>
                  <ChevronDown
                    className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180"
                    aria-hidden="true"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="bg-gradient-to-b from-[#4d7a00] to-[#2d4600] text-white border border-[#70E002]/30"
              >
                <DropdownMenuItem
                  onClick={() => navigate("/jdashboard")}
                  className="hover:bg-[#70E002]/20 focus:bg-[#70E002] cursor-pointer"
                >
                  Jsity
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/gospel-dashboard")}
                  className="hover:bg-[#70E002]/20 focus:bg-[#70E002] cursor-pointer"
                >
                  Gospeline
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/dashboard")}
                  className="hover:bg-[#70E002]/20 focus:bg-[#70E002] cursor-pointer"
                >
                  NLTV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        {/* Center: Search - Desktop */}
        <div
          className={`mx-auto hidden w-[500px] max-w-[480px] items-center rounded-full font-vietnam px-4 py-2 text-[13px] text-zinc-300 transition-all duration-300 lg:flex xl:max-w-[560px] ${
            isSearchFocused
              ? "bg-[#333] ring-2 ring-[#70E002]/30 shadow-lg shadow-[rgba(112,224,2,0.1)]"
              : "bg-[#2a2a2a] hover:bg-[#2f2f2f]"
          }`}
        >
          <Search
            className={`mr-2 h-4 w-4 font-vietnam transition-colors duration-200 ${
              isSearchFocused ? "text-[#70E002]" : "text-zinc-400"
            }`}
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Search courses, episodes, topics"
            className="w-full bg-transparent placeholder:text-zinc-500 focus:outline-none"
            aria-label="Search"
            value={search}
            onChange={(e) => onSearchChange(e.currentTarget.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
        </div>
        <div className="flex gap-2">

        <a
          href="/thc-cart"
          aria-label="Cart"
          className="hidden h-8 w-8 items-center justify-center font-vietnam rounded-md bg-[#1a1a1a] text-white ring-1 ring-white/10 transition-all duration-200 hover:bg-[#222] hover:scale-105 sm:inline-flex sm:h-9 sm:w-9"
        >
          <ShoppingCart className="h-4 w-4" />
        </a>
        <button
          aria-label="Favorites"
          onClick={() => navigate("/mylibrary?tab=saved")}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#1a1a1a] text-white ring-1 ring-white/10 transition-all duration-200 hover:bg-[#222] hover:scale-105 sm:h-9 sm:w-9"
        >
          <div className="relative">
            <Heart
              className={
                savedCount > 0
                  ? "h-4 w-4 fill-[#70E002] text-[#70E002]"
                  : "h-4 w-4"
              }
            />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-[#70E002] text-black text-[10px] font-bold h-4 min-w-4 px-1">
                {savedCount > 99 ? "99+" : savedCount}
              </span>
            )}
          </div>
        </button>
        </div>
        {/* Right: Icons + Profile */}
        <div className="flex items-center  gap-1 sm:gap-2">
          {/* Search icon for tablet */}

          {/* Profile section */}
          <div className="ml-1 flex items-center gap-2 sm:ml-2 sm:gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label="Open profile menu"
                  className="relative h-8 w-8 overflow-hidden rounded-full ring-1 ring-white/10 transition-all duration-200 hover:ring-2 hover:ring-[#70E002]/30 sm:h-9 sm:w-9"
                >
                  <img
                    src={avatarUrl || "/assets/dashboard-images/face.jpg"}
                    alt={userName ? `${userName} avatar` : "User avatar"}
                    className="h-full w-full object-cover transition-transform duration-200 hover:scale-110"
                    loading="lazy"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="text-sm font-semibold">
                    {userName ?? "Guest"}
                  </div>
                  {userEmail && (
                    <div className="text-xs text-zinc-400">{userEmail}</div>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/mylibrary")}>
                  My Library
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => onSignOut?.()}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* User info - hidden on small screens */}
            <div className="hidden leading-tight lg:block">
              <div className="text-sm font-semibold text-white font-vietnam transition-colors duration-200 hover:text-[#70E002]">
                {userName ?? "Guest"}
              </div>
              <div className="text-[11px] text-zinc-400">{userEmail ?? ""}</div>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            aria-label="Menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="ml-1 inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#1a1a1a] text-white ring-1 ring-white/10 transition-all duration-200 hover:bg-[#222] hover:scale-105 lg:hidden"
          >
            {isMenuOpen ? (
              <X className="h-4 w-4 transition-transform duration-200" />
            ) : (
              <Menu className="h-4 w-4 transition-transform duration-200" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out lg:hidden ${
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="border-t border-white/10 bg-[#0c0c0c] px-4 py-4">
          <div className="space-y-3">
            <a
              href="/thc-dashboard"
              className="block text-sm text-zinc-300 font-vietnam transition-all duration-200 hover:text-white hover:translate-x-1"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </a>
            <a
              href="/thc-courses"
              className="block text-sm text-zinc-300 font-vietnam transition-all duration-200 hover:text-white hover:translate-x-1"
              onClick={() => setIsMenuOpen(false)}
            >
              Courses
            </a>
            <a
              href="/thc-about"
              className="block text-sm text-zinc-300 font-vietnam transition-all duration-200 hover:text-white hover:translate-x-1"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </a>
            <button
              className="group flex w-full items-center font-vietnam justify-between text-left text-sm text-zinc-300 transition-colors duration-200 hover:text-white"
              onClick={() => setIsMobileChannelsOpen(!isMobileChannelsOpen)}
              aria-expanded={isMobileChannelsOpen}
              aria-controls="mobile-nltv-submenu"
            >
              <span>Thc</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  isMobileChannelsOpen ? "rotate-180" : "group-hover:rotate-180"
                }`}
              />
            </button>
            <div
              id="mobile-nltv-submenu"
              className={`overflow-hidden pl-3 ${
                isMobileChannelsOpen ? "mt-2 max-h-40" : "max-h-0"
              } transition-[max-height] duration-300 ease-in-out`}
            >
              <button
                className="block w-full text-left py-2 text-sm text-zinc-300 hover:text-white"
                onClick={() => {
                  navigate("/jdashboard");
                  setIsMenuOpen(false);
                  setIsMobileChannelsOpen(false);
                }}
              >
                Jsity
              </button>
              <button
                className="block w-full text-left py-2 text-sm text-zinc-300 hover:text-white"
                onClick={() => {
                  navigate("/gospel-dashboard");
                  setIsMenuOpen(false);
                  setIsMobileChannelsOpen(false);
                }}
              >
                Gospeline
              </button>
              <button
                className="block w-full text-left py-2 text-sm text-zinc-300 hover:text-white"
                onClick={() => {
                  navigate("/dashboard");
                  setIsMenuOpen(false);
                  setIsMobileChannelsOpen(false);
                }}
              >
                NLTV
              </button>
            </div>

            {/* User info for mobile */}
            <div className="pt-3 border-t border-white/10">
              <div className="text-sm font-semibold text-white">
                {userName ?? "Guest"}
              </div>
              {userEmail && (
                <div className="text-xs text-zinc-400">{userEmail}</div>
              )}
              {onSignOut && (
                <button
                  onClick={() => {
                    onSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="mt-3 inline-flex w-full items-center font-vietnam justify-center rounded-md bg-[#1a1a1a] text-white ring-1 ring-white/10 transition-all duration-200 hover:bg-[#222] py-2 text-sm"
                >
                  Sign out
                </button>
              )}
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Search Bar */}
      <div className="block w-full px-3 pb-3 sm:px-4 lg:hidden">
        <div
          className={`flex items-center rounded-full font-vietnam px-4 py-2.5 text-[13px] text-zinc-300 transition-all duration-300 ${
            isSearchFocused
              ? "bg-[#333] ring-2 ring-[#70E002]/30 shadow-lg shadow-[rgba(112,224,2,0.1)]"
              : "bg-[#2a2a2a]"
          }`}
        >
          <Search
            className={`mr-2 h-4 w-4 transition-colors duration-200 ${
              isSearchFocused ? "text-[#70E002]" : "text-zinc-400"
            }`}
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Search courses, episodes, topics"
            className="w-full bg-transparent placeholder:text-zinc-500 focus:outline-none"
            aria-label="Search"
            value={search}
            onChange={(e) => onSearchChange(e.currentTarget.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
        </div>
      </div>
    </header>
  );
}
