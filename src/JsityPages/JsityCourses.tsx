import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile } from "@/hooks/use-user-profile";
import { JHomeHeader } from "./components/home-header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";

const courseData = [
  {
    id: 1,
    price: "$18",
    lessons: "32 Lessons",
    title: "The Future Of AI In Everyday Products",
    instructor: "Ada Nwosu",
    role: "Machine Learning Engineer At NovaTech",
    image: "/assets/dashboard-images/face.jpg",
  },
  {
    id: 2,
    price: "$18",
    lessons: "32 Lessons",
    title: "The Future Of AI In Everyday Products",
    instructor: "Ada Nwosu",
    role: "Machine Learning Engineer At NovaTech",
    image: "/assets/dashboard-images/firm.jpg",
  },
  {
    id: 3,
    price: "$18",
    lessons: "32 Lessons",
    title: "The Future Of AI In Everyday Products",
    instructor: "Ada Nwosu",
    role: "Machine Learning Engineer At NovaTech",
    image: "/assets/dashboard-images/lady.jpg",
  },
  {
    id: 4,
    price: "$18",
    lessons: "32 Lessons",
    title: "The Future Of AI In Everyday Products",
    instructor: "Ada Nwosu",
    role: "Machine Learning Engineer At NovaTech",
    image: "/assets/dashboard-images/only.jpg",
  },
];

const categories = ["All", "For You", "Trending", "New Releases"];

export default function JsityCourses() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("For You");
  const { userName, userEmail, avatarUrl } = useUserProfile();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  // Display 12 courses (3 rows x 4 columns)
  const displayedCourses = [...courseData, ...courseData, ...courseData];

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
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-vietnam leading-tight">
                  Curated Courses From Your Favorite Instructors
                </h1>
              </div>
              <div>
                <p className="text-sm sm:text-base text-zinc-300 font-vietnam leading-relaxed">
                  Welcome to our online course page, where you can enhance your skills in design and development. Choose from our carefully curated selection of 10 courses designed to provide you with comprehensive knowledge and practical experience. Explore the courses below and find the perfect fit for your learning journey.
                </p>
              </div>
            </div>
          </section>

          {/* Browse by category */}
          <section className="pb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 font-vietnam">
              Browse by category
            </h2>

            {/* Category Tabs */}
            <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all font-vietnam ${
                    activeCategory === category
                      ? "bg-[linear-gradient(269.56deg,_rgba(161,54,255,1)_0.05%,_rgba(149,44,242,1)_20.26%,_rgba(123,37,199,1)_49.47%,_rgba(98,17,169,1)_82.66%)] text-white"
                      : "bg-[#1a1a1a] text-zinc-300 hover:bg-[#222]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedCourses.map((course, index) => (
                <CourseCard
                  key={`${course.id}-${index}`}
                  course={course}
                  onClick={() =>
                    navigate("/video-details", {
                      state: {
                        id: course.id.toString(),
                        image: course.image,
                        title: course.title,
                        creator: course.instructor,
                        price: course.price,
                      },
                    })
                  }
                />
              ))}
            </div>

            {/* Load More Button */}
            <div className="mt-10 flex justify-center">
              <button className="w-full max-w-2xl bg-[#1a1a1a] hover:bg-[#222] text-white font-vietnam font-semibold py-3 px-6 rounded-md transition-colors">
                Load More
              </button>
            </div>
          </section>

          <div className="h-16" />
        </div>

        <Footer />
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
