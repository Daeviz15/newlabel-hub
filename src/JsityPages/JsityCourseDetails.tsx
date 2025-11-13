import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HomeHeader } from "@/components/home-header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Play } from "lucide-react";
import { CourseCard } from "@/components/course-card-interactive";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/use-cart";
import { addSaved, isItemSaved, removeSaved } from "@/hooks/use-saved";

import { JHomeHeader } from "./components/home-header";
import { useUserProfile } from "@/hooks/use-user-profile";
import JsityFooter from "./components/JsityFooter";

interface CourseData {
  id: string;
  image: string;
  title: string;
  creator: string;
  price: string;
  lessons?: number;
  date?: string;
  description?: string;
}

export default function VideoDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const profile = useUserProfile();

  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      // If we have data from navigation, use it
      if (location.state) {
        setCourseData(location.state);
        setLoading(false);
        return;
      }

      // Otherwise fetch from database
      // You'd need to pass the product ID in the URL somehow
      const { data } = await supabase
        .from("products")
        .select("*")
        .limit(1)
        .single();

      if (data) {
        setCourseData({
          id: data.id,
          image: data.image_url,
          title: data.title,
          creator: data.instructor,
          price: `₦${data.price}`,
          instructor: data.instructor,
          students: 240,
          rating: 4.8,
        });
      }
      setLoading(false);
    };

    fetchCourse();
  }, [location.state]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!courseData) {
    return <div>Course not found</div>;
  }

  const handleAddToCart = () => {
    addItem({
      id: courseData.id,
      title: courseData.title,
      price: parseFloat(courseData.price.replace(/[^\d.]/g, "")),
      image: courseData.image,
      creator: courseData.creator,
    });
    navigate("/jcart");
  };

  const handleStartLearning = () =>
    navigate("/jsity-video-player", {
      state: {
        courseId: String(courseData.id),  // ✅ Changed from 'id' to 'courseId'
        image: courseData.image,
        title: courseData.title,
        creator: courseData.creator || courseData.instructor,
        price: courseData.price,
        lessons: courseData.lessons,
        date: courseData.date,
        description: courseData.description,
      },
    });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const recommendedCourses = [
    {
      id: "1",
      image: "/assets/dashboard-images/face.jpg",
      title: "The Future Of AI In Everyday Products",
      creator: "Jsify",
      price: "$18",
    },
    {
      id: "2",
      image: "/assets/gospel.png",
      title: "Firm Foundation",
      creator: "Faith Academy",
      price: "$18",
    },
    {
      id: "3",
      image: "/assets/dashboard-images/lady.jpg",
      title: "The Silent Trauma Of Millenials",
      creator: "The House Chronicles",
      price: "$18",
    },
    {
      id: "4",
      image: "/assets/dashboard-images/only.jpg",
      title: "The Future Of AI In Everyday Products",
      creator: "Jsify",
      price: "$18",
    },
  ];

  const curriculum = [
    {
      section: "01",
      title: "Introduction to UI/UX Design",
      lessons: [
        {
          title: "Understanding UI/UX Design Principles",
          duration: "45 Minutes",
        },
        {
          title: "Importance of User-Centered Design",
          duration: "1 Hour",
          highlighted: true,
        },
        {
          title: "The Role of UI/UX Design in Product Development",
          duration: "45 Minutes",
        },
      ],
    },
    {
      section: "02",
      title: "User Research and Analysis",
      lessons: [
        {
          title: "Conducting User Research and Interviews",
          duration: "1 Hour",
        },
        { title: "Analyzing User Needs and Behavior", duration: "1 Hour" },
        {
          title: "Creating User Personas and Scenarios",
          duration: " 45Minutes",
        },
      ],
    },
    {
      section: "03",
      title: "Wireframing and Prototyping",
      lessons: [
        {
          title: "Introduction to Wireframing Tools and Techniques",
          duration: "1 Hour",
        },
        { title: "Creating Low-Fidelity Wireframes", duration: "1 Hour" },
        { title: "Prototyping and Interactive Mockupss", duration: "1 Hour" },
      ],
    },
    {
      section: "04",
      title: "Visual Design and Branding",
      lessons: [
        {
          title: "Color Theory and Typography in UI Design",
          duration: "1 Hour",
        },
        { title: "Visual Hierarchy and Layout Design", duration: "1 Hour" },
        { title: "Creating a Strong Brand Identity", duration: "45 Minutes" },
      ],
    },
    {
      section: "05",
      title: "Usability Testing and Iteration",
      lessons: [
        {
          title: "Usability Testing Methods and Techniques",
          duration: "1 Hour",
        },
        { title: "Analyzing Usability Test Resultsr", duration: "45 Hour" },
        { title: "Iterating and Improving UX Designs", duration: "45 Minutes" },
      ],
    },
  ];

  return (
    <main className="bg-[#0b0b0b] text-white min-h-screen">
      <JHomeHeader
        search=""
        onSearchChange={() => {}}
        userName={profile.userName || "User"}
        userEmail={profile.userEmail || ""}
        avatarUrl={profile.avatarUrl}
        onSignOut={handleSignOut}
      />

      {/* Hero Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-28 pb-12 sm:pb-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Video Player */}
          <div className="relative aspect-video lg:aspect-[4/5] w-full overflow-hidden rounded-xl bg-black/20 border border-white/10">
            <img
              src={courseData.image}
              alt={courseData.title}
              className="h-full w-full object-cover"
            />
            <button
              onClick={() => navigate("/jsity-video-player", { 
                state: {
                  courseId: String(courseData.id),  // ✅ Fixed: passing courseId
                  image: courseData.image,
                  title: courseData.title,
                  creator: courseData.creator || courseData.instructor,
                  price: courseData.price,
                  lessons: courseData.lessons,
                  description: courseData.description,
                }
              })}
              className="absolute inset-0 flex items-center justify-center group"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 sm:w-10 sm:h-10 text-black fill-black ml-1" />
              </div>
            </button>
          </div>

          {/* Course Info */}
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="space-y-3 sm:space-y-4">
              <p className="text-purple-400 text-sm sm:text-base font-semibold">
                {courseData.creator}
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-purple-400 leading-tight">
                {courseData.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-400">
                <span>•</span>
                <span>{courseData.lessons || 32} Lessons</span>
                <span>•</span>
                <span>{courseData.date || "12-08-2025"}</span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              {courseData.description ||
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mt-4">
              <h1 className="font-bold">{courseData.price}</h1>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleAddToCart}
                  className="bg-neutral-800 hover:bg-neutral-700 text-white border border-white/10"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to cart
                </Button>
                <Button className="bg-neutral-800 hover:bg-neutral-700 text-white border border-white/10">
                  <Heart
                    className={`w-4 h-4 mr-2 ${
                      isItemSaved ? "fill-purple-400 text-purple-400" : ""
                    }`}
                  />
                  {isItemSaved ? "Saved" : "Save"}
                </Button>
              </div>
              <Button className="bg-purple-400 hover:bg-purple-500 text-black font-bold w-full">
                Purchase now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* You Might Also Like Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 lg:pb-20">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
          You Might Also Like
        </h2>
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {recommendedCourses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              image={course.image}
              title={course.title}
              creator={course.creator}
              price={course.price}
              accent="purple"
              className="hover:bg-purple-500/20"
              onAddToCart={() => {
                addItem({
                  id: course.id,
                  title: course.title,
                  price: parseFloat(course.price.replace(/[^\d.]/g, "")),
                  image: course.image,
                  creator: course.creator,
                });
                navigate("/cart");
              }}
              onViewDetails={() =>
                navigate("/jsity-course-details", { state: course })
              }
            />
          ))}
        </div>
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mt-4 sm:mt-6">
          {recommendedCourses.map((course, idx) => (
            <CourseCard
              key={`${course.id}-${idx}`}
              id={`${course.id}-${idx}`}
              image={course.image}
              title={course.title}
              creator={course.creator}
              price={course.price}
              accent="purple"
              className="hover:bg-purple-500/20"
              onAddToCart={() => {
                addItem({
                  id: `${course.id}-${idx}`,
                  title: course.title,
                  price: parseFloat(course.price.replace(/[^\d.]/g, "")),
                  image: course.image,
                  creator: course.creator,
                });
                navigate("/cart");
              }}
              onViewDetails={() =>
                navigate("/jsity-course-details", { state: course })
              }
            />
          ))}
        </div>
      </div>

      <JsityFooter />
    </main>
  );
}