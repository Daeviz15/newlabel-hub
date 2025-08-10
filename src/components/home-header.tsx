import {
  ChevronDown,
  Search,
  ShoppingCart,
  Heart,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { BrandMark } from "./brand-mark";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function HomeHeader({
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

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0c0c0c]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0c0c0c]/75 transition-all duration-300">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-2 px-3 sm:h-16 sm:gap-4 sm:px-4 md:px-6 lg:px-8">
        {/* Left: Logo + Desktop Nav */}
        <div className="flex items-center gap-4 md:gap-6">
          <a
            href="/"
            className="flex items-center gap-2 transition-transform duration-200 hover:scale-105"
          >
            <BrandMark />
            <span className="sr-only">Newlabel Home</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-4 text-[13px] text-zinc-300 lg:flex xl:gap-5">
            <a
              className="relative transition-colors duration-200 hover:text-white after:absolute after:bottom-[-2px] after:left-0 after:h-0.5 after:w-0 after:bg-lime-500 after:transition-all after:duration-300 hover:after:w-full"
              href="#"
            >
              Explore
            </a>
            <a
              className="relative transition-colors duration-200 hover:text-white after:absolute after:bottom-[-2px] after:left-0 after:h-0.5 after:w-0 after:bg-lime-500 after:transition-all after:duration-300 hover:after:w-full"
              href="#"
            >
              Catalogue
            </a>
            <a
              className="relative transition-colors duration-200 hover:text-white after:absolute after:bottom-[-2px] after:left-0 after:h-0.5 after:w-0 after:bg-lime-500 after:transition-all after:duration-300 hover:after:w-full"
              href="#"
            >
              My Library
            </a>
            <button className="group inline-flex items-center gap-1 transition-colors duration-200 hover:text-white">
              <span>Subsidiaries</span>
              <ChevronDown
                className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180"
                aria-hidden="true"
              />
            </button>
          </nav>
        </div>

        {/* Center: Search - Desktop */}
        <div
          className={`mx-auto hidden w-full max-w-[480px] items-center rounded-full px-4 py-2 text-[13px] text-zinc-300 transition-all duration-300 lg:flex xl:max-w-[560px] ${
            isSearchFocused
              ? "bg-[#333] ring-2 ring-lime-500/30 shadow-lg shadow-lime-500/10"
              : "bg-[#2a2a2a] hover:bg-[#2f2f2f]"
          }`}
        >
          <Search
            className={`mr-2 h-4 w-4 transition-colors duration-200 ${
              isSearchFocused ? "text-lime-400" : "text-zinc-400"
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

        {/* Right: Icons + Profile */}
        <div className="flex items-center  gap-1 sm:gap-2">
          {/* Search icon for tablet */}

          {/* Cart and Heart icons */}
          <a
            href="/cart"
            aria-label="Cart"
            className="hidden h-8 w-8 items-center justify-center rounded-md bg-[#1a1a1a] text-white ring-1 ring-white/10 transition-all duration-200 hover:bg-[#222] hover:scale-105 sm:inline-flex sm:h-9 sm:w-9"
          >
            <ShoppingCart className="h-4 w-4" />
          </a>
          <button
            aria-label="Favorites"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#1a1a1a] text-white ring-1 ring-white/10 transition-all duration-200 hover:bg-[#222] hover:scale-105 sm:h-9 sm:w-9"
          >
            <Heart className="h-4 w-4" />
          </button>

          {/* Profile section */}
          <div className="ml-1 flex items-center gap-2 sm:ml-2 sm:gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label="Open profile menu"
                  className="relative h-8 w-8 overflow-hidden rounded-full ring-1 ring-white/10 transition-all duration-200 hover:ring-2 hover:ring-lime-500/30 sm:h-9 sm:w-9"
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
                <DropdownMenuItem onClick={() => onSignOut?.()}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* User info - hidden on small screens */}
            <div className="hidden leading-tight lg:block">
              <div className="text-sm font-semibold text-white transition-colors duration-200 hover:text-lime-400">
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
              href="#"
              className="block text-sm text-zinc-300 transition-all duration-200 hover:text-white hover:translate-x-1"
              onClick={() => setIsMenuOpen(false)}
            >
              Explore
            </a>
            <a
              href="#"
              className="block text-sm text-zinc-300 transition-all duration-200 hover:text-white hover:translate-x-1"
              onClick={() => setIsMenuOpen(false)}
            >
              Catalogue
            </a>
            <a
              href="#"
              className="block text-sm text-zinc-300 transition-all duration-200 hover:text-white hover:translate-x-1"
              onClick={() => setIsMenuOpen(false)}
            >
              My Library
            </a>
            <button className="group flex w-full items-center justify-between text-left text-sm text-zinc-300 transition-colors duration-200 hover:text-white">
              <span>Subsidiaries</span>
              <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
            </button>

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
                  className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-[#1a1a1a] text-white ring-1 ring-white/10 transition-all duration-200 hover:bg-[#222] py-2 text-sm"
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
          className={`flex items-center rounded-full px-4 py-2.5 text-[13px] text-zinc-300 transition-all duration-300 ${
            isSearchFocused
              ? "bg-[#333] ring-2 ring-lime-500/30 shadow-lg shadow-lime-500/10"
              : "bg-[#2a2a2a]"
          }`}
        >
          <Search
            className={`mr-2 h-4 w-4 transition-colors duration-200 ${
              isSearchFocused ? "text-lime-400" : "text-zinc-400"
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
