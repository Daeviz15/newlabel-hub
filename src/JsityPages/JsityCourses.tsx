import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile } from "@/hooks/use-user-profile";
import { JHomeHeader } from "./components/home-header";
import JsityFooter from "./components/JsityFooter";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

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

export default function JsityCourses() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { userName, userEmail, avatarUrl } = useUserProfile();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("id, title, price, image_url, instructor, instructor_role, category, duration")
        .eq("brand", "jsity")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setProducts(data);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const getCategoryForTab = (category: string) => {
    const categoryMap: Record<string, string> = {
      course: "For You",
      podcast: "Trending",
    };
    return categoryMap[category] || "New Releases";
  };

  const filteredItems = products.filter(item => {
    const matchesCategory = activeCategory === "All" || getCategoryForTab(item.category) === activeCategory;
    const matchesSearch = !searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
                {filteredItems.map((product) => (
                  <CourseCard
                    key={product.id}
                    course={{
                      price: `₦${product.price.toLocaleString()}`,
                      lessons: product.duration || "—",
                      title: product.title,
                      instructor: product.instructor || "—",
                      role: product.instructor_role || "",
                      image: product.image_url || "/assets/dashboard-images/face.jpg",
                    }}
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

            {!loading && filteredItems.length === 0 && (
              <p className="text-gray-400 text-center py-8">No items found in this category.</p>
            )}

            {/* Load More Button */}
            {!loading && filteredItems.length > 0 && (
              <div className="mt-10 flex justify-center">
                <button className="w-full max-w-7xl bg-[#1a1a1a] hover:bg-[#222] text-white font-vietnam font-semibold py-3 px-6 rounded-md transition-colors">
                  Load More
                </button>
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
      className="group relative overflow-hidden rounded-2xl bg-[#151515] border border-white/10 cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all"
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
          <Badge className="bg-[linear-gradient(269.56deg,_rgba(161,54,255,1)_0.05%,_rgba(149,44,242,1)_20.26%,_rgba(123,37,199,1)_49.47%,_rgba(98,17,169,1)_82.66%)] text-white text-xs font-semibold px-3 py-1 rounded-full border-none hover:bg-[linear-gradient(269.56deg,_rgba(161,54,255,1)_0.05%,_rgba(149,44,242,1)_20.26%,_rgba(123,37,199,1)_49.47%,_rgba(98,17,169,1)_82.66%)]">
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
