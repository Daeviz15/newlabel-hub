import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile } from "@/hooks/use-user-profile";
import { THomeHeader } from "./components/home-header";
import ThcFooter from "./components/ThcFooter";
import { Badge } from "@/components/ui/badge";

const courseData = [
  {
    id: 1,
    price: "₦18",
    lessons: "32 Lessons",
    title: "The Future Of AI In Everyday Products",
    instructor: "Ada Nwosu",
    role: "Machine Learning Engineer At NovaTech",
    image: "/assets/dashboard-images/face.jpg",
  },
  {
    id: 2,
    price: "₦18",
    lessons: "32 Lessons",
    title: "The Future Of AI In Everyday Products",
    instructor: "Ada Nwosu",
    role: "Machine Learning Engineer At NovaTech",
    image: "/assets/dashboard-images/firm.jpg",
  },
  {
    id: 3,
    price: "₦18",
    lessons: "32 Lessons",
    title: "The Future Of AI In Everyday Products",
    instructor: "Ada Nwosu",
    role: "Machine Learning Engineer At NovaTech",
    image: "/assets/dashboard-images/lady.jpg",
  },
  {
    id: 4,
    price: "₦18",
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
                <p className="text-[15px] sm:text-[15px] text-zinc-300  font-normal font-vietnam leading-[1.5]">
                  Welcome to our online course page, where you can enhance your skills in design and development. Choose from our carefully curated selection of 10 courses designed to provide you with comprehensive knowledge and practical experience. Explore the courses below and find the perfect fit for your learning journey.
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

            {/* Course Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedCourses.map((course, index) => (
                <CourseCard
                  key={`${course.id}-${index}`}
                  course={course}
                  onClick={() =>
                    navigate("/thc-course-details", {
                      state: {
                        id: course.id.toString(),
                        image: course.image,
                        title: course.title,
                        creator: course.instructor,
                        price: course.price,
                        instructor: course.instructor,
                        role: course.role,
                      },
                    })
                  }
                />
              ))}
            </div>

            {/* Load More Button */}
            <div className="mt-10 flex justify-center">
              <button className="w-full max-w-7xl bg-[#1a1a1a] hover:bg-[#222] text-white font-vietnam font-semibold py-3 px-6 rounded-md transition-colors">
                Load More
              </button>
            </div>
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

