import { HomeHeader } from "@/components/home-header";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import Tab from "@/components/Tab";
import { ProductCard } from "@/components/course-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserProfile } from "@/hooks/use-user-profile";
import { InlineLoader } from "@/components/ui/BrandedSpinner";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";

interface Product {
  id: string;
  title: string;
  price: number;
  image_url: string | null;
  instructor: string | null;
  category: string;
  brand: string | null;
  description: string | null;
}

const ITEMS_PER_PAGE = 12;

const Catalogue = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { userName, userEmail, avatarUrl } = useUserProfile();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const fetchProducts = async ({ pageParam = 0 }) => {
    const from = pageParam * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    let query = supabase
      .from("products")
      .select("id, title, price, image_url, instructor, category, brand, description", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    // Apply Search Filter
    if (searchQuery) {
      query = query.ilike("title", `%${searchQuery}%`);
    }

    // Apply Category Filter
    if (selectedCategory !== "All") {
      if (selectedCategory === "For You") {
        query = query.eq("category", "course");
      } else if (selectedCategory === "Trending") {
        query = query.eq("category", "podcast");
      } else if (selectedCategory === "New Releases") {
        query = query.neq("category", "course").neq("category", "podcast");
      }
    }

    const { data, error, count } = await query;
    if (error) throw error;

    return {
      data: data || [],
      nextPage: (data?.length || 0) === ITEMS_PER_PAGE ? pageParam + 1 : undefined,
      totalCount: count || 0,
    };
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["products", selectedCategory, searchQuery],
    queryFn: fetchProducts,
    initialPageParam: 0,
    getNextPageParam: (lastPage: any) => lastPage.nextPage,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const products = data?.pages.flatMap((page) => page.data) || [];
  const loading = isLoading;
  const loadingMore = isFetchingNextPage;
  const hasMore = !!hasNextPage;

  const handleLoadMore = () => {
    fetchNextPage();
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image_url || "/assets/dashboard-images/face.jpg",
      creator: product.instructor || "Unknown",
    });
    toast.success("Added to cart");
  };

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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-nunito font-bold">
              Browse by category
            </h1>
            {!loading && (
              <span className="text-gray-400 text-sm">
                Showing {products.length} courses
              </span>
            )}
          </div>

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
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  imageSrc={product.image_url || "/assets/dashboard-images/face.jpg"}
                  title={product.title}
                  subtitle={product.instructor || "—"}
                  price={`₦${product.price ? product.price.toLocaleString() : "0"}`}
                  productId={product.id}
                  onAddToCart={(e) => handleAddToCart(e, product)}
                  onClick={() => {
                    if (product.brand === 'thc') {
                      navigate("/thc-video-player", {
                        state: {
                          id: product.id,
                          image: product.image_url,
                          title: product.title,
                          host: product.instructor,
                          episodeCount: 1,
                          description: product.description || "",
                        }
                      });
                    } else if (product.brand === 'jsity') {
                      navigate("/jsity-course-details", {
                        state: {
                          id: product.id,
                          image: product.image_url,
                          title: product.title,
                          creator: product.instructor,
                          price: `₦${product.price.toLocaleString()}`,
                          instructor: product.instructor,
                          role: "Instructor"
                        }
                      });
                    } else {
                      navigate("/video-details", {
                        state: {
                          id: product.id,
                          image: product.image_url,
                          title: product.title,
                          creator: product.instructor,
                          price: `₦${product.price ? product.price.toLocaleString() : "0"}`
                        }
                      });
                    }
                  }}
                />
              ))}
            </div>
          )}

          {!loading && products.length === 0 && (
            <p className="text-gray-400 text-center py-8">No items found in this category.</p>
          )}

          {/* Load More Button with proper functionality */}
          {!loading && hasMore && (
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="flex justify-center items-center text-xs sm:text-sm w-full bg-gray-500/25 hover:bg-gray-500/35 transition-colors h-10 sm:h-12 mt-3 mb-6 sm:mb-10 rounded-sm font-nunito font-bold cursor-pointer active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingMore ? (
                <>
                  <span className="mr-2"><InlineLoader /></span>
                  Loading...
                </>
              ) : (
                "Load More"
              )}
            </button>
          )}

          {/* Show message when all items loaded */}
          {!loading && products.length > 0 && !hasMore && (
            <p className="text-gray-500 text-center text-sm py-4">
              You've reached the end of the catalogue
            </p>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default Catalogue;