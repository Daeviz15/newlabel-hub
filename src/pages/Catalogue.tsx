import { HomeHeader } from "@/components/home-header";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import Tab from "@/components/Tab";
import { ProductCard } from "@/components/course-card";
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
  id: string;
  title: string;
  price: number;
  image_url: string | null;
  instructor: string | null;
  category: string;
}

const ITEMS_PER_PAGE = 12;

const Catalogue = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  // Fetch products from Supabase with pagination
  const fetchProducts = async (pageNum: number, append = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    const from = pageNum * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    const { data, error } = await supabase
      .from("products")
      .select("id, title, price, image_url, instructor, category")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (!error && data) {
      if (append) {
        setProducts(prev => [...prev, ...data]);
      } else {
        setProducts(data);
        setDisplayedCount(ITEMS_PER_PAGE);
      }
      setHasMore(data.length === ITEMS_PER_PAGE);
    } else {
      setHasMore(false);
    }
    
    setLoading(false);
    setLoadingMore(false);
  };

  // Initial fetch and reset when category or search changes
  useEffect(() => {
    setPage(0);
    setDisplayedCount(ITEMS_PER_PAGE);
    fetchProducts(0);
  }, [selectedCategory, searchQuery]);

  // Map database categories to tab categories
  const getCategoryForTab = (category: string) => {
    const categoryMap: Record<string, string> = {
      course: "For You",
      podcast: "Trending",
      // Add more mappings as needed
    };
    return categoryMap[category] || "New Releases";
  };

  const filteredItems = products.filter(item => {
    const matchesCategory = selectedCategory === "All" || getCategoryForTab(item.category) === selectedCategory;
    const matchesSearch = !searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Display only the first displayedCount items
  const displayedItems = filteredItems.slice(0, displayedCount);
  const hasMoreToShow = displayedCount < filteredItems.length || hasMore;

  const handleLoadMore = async () => {
    // If we have more filtered items to show, just increase displayed count
    if (displayedCount < filteredItems.length) {
      setDisplayedCount(prev => Math.min(prev + ITEMS_PER_PAGE, filteredItems.length));
    } 
    // Otherwise, fetch more from database
    else if (hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      await fetchProducts(nextPage, true);
      // After fetching, increase displayed count to show new items
      setDisplayedCount(prev => prev + ITEMS_PER_PAGE);
    }
  };

  useEffect(() => {
    const updateFromSession = (session: any) => {
      const user = session?.user || null;
      if (user) {
        const meta = user.user_metadata || {};
        setUserEmail(user.email ?? null);
        setUserName(meta.full_name || meta.name || user.email || null);
        setAvatarUrl(meta.avatar_url || meta.picture || null);
        setTimeout(async () => {
          const { data, error } = await supabase
            .from("profiles")
            .select("full_name, avatar_url")
            .eq("user_id", user.id)
            .maybeSingle();
          if (!error && data) {
            if (data.full_name) setUserName(data.full_name);
            if (data.avatar_url) setAvatarUrl(data.avatar_url);
          }
        }, 0);
      }
    };

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        updateFromSession(session);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      updateFromSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <main className="bg-[#0b0b0b] text-white min-h-screen">
      <div className="bg-brand-green text-black text-sm sm:text-base m-4 py-2 text-center font-medium rounded-md sm:hidden">
        <a href="/free-courses" className="hover:underline">
          Free Courses 🌟 Sale Ends Soon, Get It Now →
        </a>
      </div>
      <HomeHeader
        search={searchQuery}
        onSearchChange={setSearchQuery}
        userName={userName ?? undefined}
        userEmail={userEmail ?? undefined}
        avatarUrl={avatarUrl ?? undefined}
        onSignOut={handleSignOut}
      />

      {/* Hero Section - Fully Responsive */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row w-full gap-6 sm:gap-8 lg:gap-12 mt-12 sm:mt-16 lg:mt-20 mb-20 sm:mb-28 lg:mb-40">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold font-vietnam lg:w-[500px] text-[#EDEDED] leading-tight">
            Curated Content From Your Favorite Creators
          </h1>
          <p className="w-full lg:w-1/2 font-light text-sm sm:text-base text-[#EDEDED] font-vietnam leading-relaxed">
            Welcome to our online course page, where you can enhance your skills
            in design and development. Choose from our carefully curated
            selection of courses designed to provide you with comprehensive
            knowledge and practical experience. Explore the courses below and
            find the perfect fit for your learning journey.
          </p>
        </div>
        <div className="w-full h-[1px] bg-[#A3A3A3]/20 mt-12 mb-8"></div>

        {/* Browse Section - Fully Responsive */}
        <div className="flex flex-col gap-6 sm:gap-8 pb-12 sm:pb-16">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-nunito font-bold">
            Browse by category
          </h1>

          {/* Tab Component - Horizontal scroll on mobile */}
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <Tab 
              selectedTab={selectedCategory} 
              onTabChange={setSelectedCategory}
            />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-40 w-full rounded-lg bg-neutral-800" />
                  <Skeleton className="h-4 w-3/4 bg-neutral-800" />
                  <Skeleton className="h-4 w-1/2 bg-neutral-800" />
                </div>
              ))}
            </div>
          )}

          {/* Product Grid - Responsive columns */}
          {!loading && (
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {displayedItems.map((product) => (
                <ProductCard
                  key={product.id}
                  imageSrc={product.image_url || "/assets/dashboard-images/face.jpg"}
                  title={product.title}
                  subtitle={product.instructor || "—"}
                  price={`₦${product.price.toLocaleString()}`}
                  productId={product.id}
                  onClick={() => navigate("/video-details", { 
                    state: { 
                      id: product.id, 
                      image: product.image_url, 
                      title: product.title, 
                      creator: product.instructor, 
                      price: `₦${product.price.toLocaleString()}` 
                    } 
                  })}
                />
              ))}
            </div>
          )}

          {!loading && displayedItems.length === 0 && (
            <p className="text-gray-400 text-center py-8">No items found in this category.</p>
          )}

          {!loading && hasMoreToShow && (
            <button 
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="flex justify-center items-center text-xs sm:text-sm w-full bg-gray-500/25 hover:bg-gray-500/35 transition-colors h-10 sm:h-12 mt-3 mb-6 sm:mb-10 rounded-sm font-nunito font-bold cursor-pointer active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingMore ? "Loading..." : "Load More"}
            </button>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default Catalogue;
