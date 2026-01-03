import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile } from "@/hooks/use-user-profile";
import { THomeHeader } from "./components/home-header";
import ThcFooter from "./components/ThcFooter";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { InlineLoader } from "@/components/ui/BrandedSpinner";

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

export default function ThcCourses() {
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
      .eq("brand", "thc")
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
    queryKey: ["thc_courses", activeCategory, searchQuery],
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

  // Removed local filtering


  return (
    <main className="bg-[#0b0b0b] text-white min-h-screen">
      <div className="flex flex-col">
        {/* Top Banner */}
        <div className="block bg-[#70E002] text-black text-sm py-3 text-center font-vietnam font-medium rounded-md">
          Free Courses 🌟 Sale Ends Soon. Get It Now →
        </div>
        <THomeHeader
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
                      ? "bg-[linear-gradient(269.56deg,_#70E002_0.05%,_#61C802_20.26%,_#58B402_49.47%,_#4BA600_82.66%)] text-black"
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
                {products.map((item) => (
                  <CourseCard
                    key={item.id}
                    course={{
                      price: `₦${item.price.toLocaleString()}`,
                      lessons: item.duration || "—",
                      title: item.title,
                      instructor: item.instructor || "—",
                      role: item.instructor_role || "",
                      image: item.image_url || "/assets/dashboard-images/face.jpg",
                    }}
                    onClick={() =>
                      navigate("/thc-course-details", {
                        state: {
                          id: item.id,
                          image: item.image_url,
                          title: item.title,
                          creator: item.instructor,
                          price: `₦${item.price.toLocaleString()}`,
                          instructor: item.instructor,
                          role: item.instructor_role,
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
                <h3 className="text-xl font-semibold mb-2">No content found</h3>
                <p className="text-gray-400 max-w-md">
                  We couldn't find any content matching your criteria. Try adjusting your filters.
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
                    "Load More Content"
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

        <ThcFooter />
      </div>
    </main>
  );
}

function CourseCard({
  course,
  onClick,
}: {
  course: {
    price: string;
    lessons: string;
    title: string;
    instructor: string;
    role: string;
    image: string;
  };
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl bg-[#151515] border border-white/10 cursor-pointer hover:ring-2 hover:ring-[#70E002] transition-all"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/20">
        <img
          src={course.image}
          alt={course.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <Badge className="bg-white/90 text-black text-xs font-semibold px-2 py-1 rounded-md hover:bg-white/90">
            {course.price}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge className="bg-[linear-gradient(269.56deg,_#70E002_0.05%,_#61C802_20.26%,_#58B402_49.47%,_#4BA600_82.66%)] text-black text-xs font-semibold px-3 py-1 rounded-full border-none hover:bg-[linear-gradient(269.56deg,_#70E002_0.05%,_#61C802_20.26%,_#58B402_49.47%,_#4BA600_82.66%)]">
            {course.lessons}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="text-base font-semibold text-white line-clamp-2 leading-snug font-vietnam">
          {course.title}
        </h3>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-white font-vietnam">{course.instructor}</p>
          <p className="text-xs text-zinc-400 font-vietnam">{course.role}</p>
        </div>
      </div>
    </div>
  );
}
