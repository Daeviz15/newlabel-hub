import { ChevronDown, Search, ShoppingCart, Heart } from "lucide-react"
import { BrandMark } from "./brand-mark"

export function HomeHeader({
  search,
  onSearchChange,
  userName,
  userEmail,
  avatarUrl,
}: {
  search: string
  onSearchChange: (q: string) => void
  userName?: string
  userEmail?: string
  avatarUrl?: string
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0c0c0c]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0c0c0c]/75">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 sm:px-6 md:px-8">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-6">
          <a href="/" className="flex items-center gap-2">
            <BrandMark />
            <span className="sr-only">Newlabel Home</span>
          </a>

          <nav className="hidden items-center gap-5 text-[13px] text-zinc-300 md:flex">
            <a className="hover:text-white" href="#">
              Explore
            </a>
            <a className="hover:text-white" href="#">
              Catalogue
            </a>
            <a className="hover:text-white" href="#">
              My Library
            </a>
            <button className="inline-flex items-center gap-1 hover:text-white">
              <span>Subsidiaries</span>
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </button>
          </nav>
        </div>

        {/* Center: Search */}
        <div className="mx-auto hidden w-full max-w-[560px] items-center rounded-full bg-[#2a2a2a] px-4 py-2 text-[13px] text-zinc-300 md:flex">
          <Search className="mr-2 h-4 w-4 text-zinc-400" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search courses, episodes, topics"
            className="w-full bg-transparent placeholder:text-zinc-500 focus:outline-none"
            aria-label="Search"
            value={search}
            onChange={(e) => onSearchChange(e.currentTarget.value)}
          />
        </div>

        {/* Right: Icons + Profile */}
        <div className="ml-auto flex items-center gap-2">
          <button
            aria-label="Cart"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[#1a1a1a] text-white ring-1 ring-white/10 hover:bg-[#222]"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
          <button
            aria-label="Favorites"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[#1a1a1a] text-white ring-1 ring-white/10 hover:bg-[#222]"
          >
            <Heart className="h-4 w-4" />
          </button>

          <div className="ml-2 flex items-center gap-3">
            <div className="relative h-9 w-9 overflow-hidden rounded-full ring-1 ring-white/10">
              <img
                src={avatarUrl || "/assets/dashboard-images/face.jpg"}
                alt={userName ? `${userName} avatar` : "User avatar"}
                className="h-9 w-9 object-cover"
                loading="lazy"
              />
            </div>
            <div className="hidden leading-tight md:block">
              <div className="text-sm font-semibold text-white">{userName ?? "Guest"}</div>
              <div className="text-[11px] text-zinc-400">{userEmail ?? ""}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="mx-auto block w-full max-w-7xl px-4 pb-3 sm:px-6 md:hidden">
        <div className="flex items-center rounded-full bg-[#2a2a2a] px-4 py-2 text-[13px] text-zinc-300">
          <Search className="mr-2 h-4 w-4 text-zinc-400" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search courses, episodes, topics"
            className="w-full bg-transparent placeholder:text-zinc-500 focus:outline-none"
            aria-label="Search"
            value={search}
            onChange={(e) => onSearchChange(e.currentTarget.value)}
          />
        </div>
      </div>
    </header>
  )
}
