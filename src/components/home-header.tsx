import {
  ChevronDown,
  Search,
  ShoppingCart,
  Heart,
  Menu,
  X,
  Bell,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getSaved, onSavedChange } from "@/hooks/use-saved";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/hooks/use-notifications";
import logo from "../assets/Logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [isMobileChannelsOpen, setIsMobileChannelsOpen] = useState(false);
  const [savedCount, setSavedCount] = useState<number>(getSaved().length);
  const { unreadCount } = useNotifications();
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
              src={logo}
              alt="newlabel"
              className="h-6 sm:h-7 lg:h-8 xl:h-9 w-auto cursor-pointer"
            />
            <span className="sr-only">Newlabel Home</span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-4 text-[13px] text-zinc-300 lg:flex xl:gap-5">
            <a
              className="relative transition-colors font-vietnam duration-200 hover:text-white after:absolute after:bottom-[-2px] after:left-0 after:h-0.5 after:w-0 after:bg-lime-500 after:transition-all after:duration-300 hover:after:w-full"
              href="/dashboard"
            >
              Explore
            </a>
            <a
              className="relative font-vietnam transition-colors duration-200 hover:text-white after:absolute after:bottom-[-2px] after:left-0 after:h-0.5 after:w-0 after:bg-lime-500 after:transition-all after:duration-300 hover:after:w-full"
              href="/catalogue"
            >
              Catalogue
            </a>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="group inline-flex items-center gap-1 font-vietnam transition-colors duration-200 hover:text-white">
                  <span>NLTV</span>
                  <ChevronDown
                    className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180"
                    aria-hidden="true"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="bg-[#E1FDC5] text-black"
              >
                <DropdownMenuItem onClick={() => navigate("/jdashboard")}>
                  Jsity
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/thc-dashboard")}>
                  Thc
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/gospel-dashboard")}>
                  Gospeline
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        {/* Center: Search - Desktop */}
        <div
          className={`mx-auto hidden w-full max-w-[480px] items-center rounded-full font-vietnam px-4 py-2 text-[13px] text-zinc-300 transition-all duration-300 lg:flex xl:max-w-[400px] ${
            isSearchFocused
              ? "bg-[#333] ring-2 ring-lime-500/30 shadow-lg shadow-lime-500/10"
              : "bg-[#2a2a2a] hover:bg-[#2f2f2f]"
          }`}
        >
          <Search
            className={`mr-2 h-4 w-4 font-vietnam transition-colors duration-200 ${
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
            className="hidden h-8 w-8 items-center justify-center font-vietnam rounded-md bg-[#1a1a1a] text-white ring-1 ring-white/10 transition-all duration-200 hover:bg-[#222] hover:scale-105 sm:inline-flex sm:h-9 sm:w-9"
          >
            <ShoppingCart className="h-4 w-4" />
          </a>
          <a
            href="/notifications"
            aria-label="Notification"
            className="p-2 items-center justify-center rounded-md bg-[#1a1a1a] text-white ring-1 ring-white/10 transition-all duration-200 hover:bg-[#222] hover:scale-105 sm:inline-flex sm:h-9 sm:w-9 relative"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold h-4 min-w-4 px-1">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
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
                    ? "h-4 w-4 fill-lime-400 text-lime-400"
                    : "h-4 w-4"
                }
              />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-lime-400 text-black text-[10px] font-bold h-4 min-w-4 px-1">
                  {savedCount > 99 ? "99+" : savedCount}
                </span>
              )}
            </div>
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
                <DropdownMenuItem onClick={() => navigate("/mylibrary")}>
                  My Library
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/accountsetting")}>
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuItem>Contact Us</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSignOut?.()}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* User info - hidden on small screens */}
            <div className="hidden leading-tight lg:block">
              <div className="text-sm font-semibold text-white font-vietnam transition-colors duration-200 hover:text-lime-400">
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
              href="/dashboard"
              className="block text-sm text-zinc-300 font-vietnam transition-all duration-200 hover:text-white hover:translate-x-1"
              onClick={() => setIsMenuOpen(false)}
            >
              Explore
            </a>
            <a
              href="/catalogue"
              className="block text-sm text-zinc-300 font-vietnam transition-all duration-200 hover:text-white hover:translate-x-1"
              onClick={() => setIsMenuOpen(false)}
            >
              Catalogue
            </a>
            <a
              href="/mylibrary"
              className="block text-sm text-zinc-300 font-vietnam transition-all duration-200 hover:text-white hover:translate-x-1"
              onClick={() => setIsMenuOpen(false)}
            >
              My Library
            </a>
            <button
              className="group flex w-full items-center font-vietnam justify-between text-left text-sm text-zinc-300 transition-colors duration-200 hover:text-white"
              onClick={() => setIsMobileChannelsOpen(!isMobileChannelsOpen)}
              aria-expanded={isMobileChannelsOpen}
              aria-controls="mobile-channels-submenu"
            >
              <span>NLTV</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  isMobileChannelsOpen ? "rotate-180" : "group-hover:rotate-180"
                }`}
              />
            </button>
            <div
              id="mobile-channels-submenu"
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
                  navigate("/thc-dashboard");
                  setIsMenuOpen(false);
                  setIsMobileChannelsOpen(false);
                }}
              >
                Thc
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
