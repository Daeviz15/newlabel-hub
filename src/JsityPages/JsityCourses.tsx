import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile } from "@/hooks/use-user-profile";
import { JHomeHeader } from "./components/home-header";
import JsityFooter from "./components/JsityFooter";
import { ProductCard } from "@/components/course-card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { InlineLoader } from "@/components/ui/BrandedSpinner";
import { BookOpen } from "lucide-react";

interface Product {
  id: string;
  title: string;
  price: number;
  image_url: string | null;
  instructor: string | null;
  instructor_role: string | null;
  category: string;
  duration: string | null;
}

const categories = ["All", "For You", "Trending", "New Releases"];

const ITEMS_PER_PAGE = 12;

export default function JsityCourses() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  /* import { useInfiniteQuery } from "@tanstack/react-query"; */

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
      .select("id, title, price, image_url, instructor, instructor_role, category, duration", { count: "exact" })
      .eq("brand", "jsity")
      .order("created_at", { ascending: false })
      .range(from, to);

    // Apply Search Filter
    if (searchQuery) {
      query = query.ilike("title", `%${searchQuery}%`);
    }

    // Apply Category Filter
    if (activeCategory !== "All") {
      if (activeCategory === "For You") {
        query = query.eq("category", "course");
      } else if (activeCategory === "Trending") {
        query = query.eq("category", "podcast");
      } else if (activeCategory === "New Releases") {
        query = query.neq("category", "course").neq("category", "podcast");
      }
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      data: data || [],
      nextPage: data.length === ITEMS_PER_PAGE ? pageParam + 1 : undefined,
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
    queryKey: ["jsity_courses", activeCategory, searchQuery],
    queryFn: fetchProducts,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 1000 * 60 * 5,
  });

  const products = data?.pages.flatMap((page) => page.data) || [];
  const loading = isLoading;
  const loadingMore = isFetchingNextPage;
  const hasMore = !!hasNextPage;

  const handleLoadMore = () => {
    fetchNextPage();
  };

  const getCategoryForTab = (category: string) => {
    const categoryMap: Record<string, string> = {
      course: "For You",
      podcast: "Trending",
    };
    return categoryMap[category] || "New Releases";
  };

  // Removed local filtering as it is now handled server-side


  return (
    <main className="bg-[#0b0b0b] text-white min-h-screen">
      <div className="flex flex-col">
        {/* Top Banner - Desktop only */}
        <div className="hidden sm:block bg-[linear-gradient(269.56deg,_rgba(161,54,255,1)_0.05%,_rgba(149,44,242,1)_20.26%,_rgba(123,37,199,1)_49.47%,_rgba(98,17,169,1)_82.66%)] text-white text-sm py-3 text-center font-vietnam font-medium">
          Free Courses 🌟 Sale Ends Soon. Get It Now →
        </div>

        <JHomeHeader
          search={searchQuery}
          onSearchChange={setSearchQuery}
          userName={userName ?? undefined}
          userEmail={userEmail ?? undefined}
          avatarUrl={avatarUrl ?? undefined}
          onSignOut={handleSignOut}
        />

        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-8">
          {/* Hero Section */}
          <section className="py-12 sm:py-16 md:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
              <div>
                <h1 className="text-3xl sm:text-4xl sm:leading-[1.5] md:text-[36px] font-semibold text-white font-vietnam leading-[1.5]">
                  Curated Courses From Your Favorite Instructors
                </h1>
              </div>
              <div>
                <p className="text-[15px] sm:text-[15px] text-zinc-300 font-normal font-vietnam leading-[1.5]">
                  Welcome to our online course page, where you can enhance your skills in design and development. Choose from our carefully curated selection of courses designed to provide you with comprehensive knowledge and practical experience.
                </p>
              </div>
            </div>
          </section>

          {/* Browse by category */}
          <section className="pb-12">
            <h2 className="text-[18px] sm:text-[28px] font-bold text-white mb-6 font-nunito">
              Browse by category
            </h2>

            {/* Category Tabs */}
            <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-5 py-2 rounded-sm text-sm font-medium whitespace-nowrap transition-all font-vietnam ${
                    activeCategory === category
                      ? "bg-[linear-gradient(269.56deg,_rgba(161,54,255,1)_0.05%,_rgba(149,44,242,1)_20.26%,_rgba(123,37,199,1)_49.47%,_rgba(98,17,169,1)_82.66%)] text-white"
                      : "bg-[#1a1a1a] text-zinc-300 hover:bg-[#222]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-[3/4] w-full rounded-2xl bg-neutral-800" />
                    <Skeleton className="h-4 w-3/4 bg-neutral-800" />
                    <Skeleton className="h-4 w-1/2 bg-neutral-800" />
                  </div>
                ))}
              </div>
            )}

            {/* Course Grid */}
            {!loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    price={`₦${product.price.toLocaleString()}`}
                    imageSrc={product.image_url || "/assets/dashboard-images/face.jpg"}
                    title={product.title}
                    subtitle={product.instructor || "Instructor"}
                    priceAccent="purple"
                    bgColor="ring-purple-500"
                    brand="jsity"
                    onClick={() =>
                      navigate("/jsity-course-details", {
                        state: {
                          id: product.id,
                          image: product.image_url,
                          title: product.title,
                          creator: product.instructor,
                          price: `₦${product.price.toLocaleString()}`,
                          instructor: product.instructor,
                          role: product.instructor_role,
                        },
                      })
                    }
                  />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && products.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-white/5 p-4 rounded-full mb-4">
                  <BookOpen className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No courses found</h3>
                <p className="text-gray-400 max-w-md">
                  We couldn't find any courses matching your criteria. Try adjusting your filters or search query.
                </p>
              </div>
            )}

            {/* Load More Button */}
            {!loading && products.length > 0 && hasMore && (
              <div className="flex justify-center mt-12 mb-20">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="flex items-center gap-2 px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-medium transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingMore ? (
                    <>
                      <InlineLoader /> Loading...
                    </>
                  ) : (
                    "Load More Courses"
                  )}
                </button>
              </div>
            )}

            {/* End of List Message */}
            {!loading && products.length > 0 && !hasMore && (
              <div className="text-center py-10 text-gray-500">
                You've reached the end of the list
              </div>
            )}
          </section>

          <div className="h-16" />
        </div>

        <JsityFooter />
      </div>
    </main>
  );
}
