import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HomeHeader } from "@/components/home-header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Play } from "lucide-react";
import { CourseCard } from "@/components/course-card-interactive";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/use-cart";

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
  const courseData = location.state as CourseData;
  const { addItem } = useCart();

  const [searchQuery, setSearchQuery] = useState("");
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const updateFromSession = (session: any) => {
      const user = session?.user || null;
      setUserName(user?.user_metadata?.full_name || null);
      setUserEmail(user?.email || null);
      setAvatarUrl(user?.user_metadata?.avatar_url || null);

      if (user) {
        supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("user_id", user.id)
          .single()
          .then(({ data }) => {
            if (data?.full_name) setUserName(data.full_name);
            if (data?.avatar_url) setAvatarUrl(data.avatar_url);
          });
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      updateFromSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      updateFromSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleAddToCart = () => {
    addItem({
      id: courseData.id,
      title: courseData.title,
      price: courseData.price,
      image: courseData.image,
      creator: courseData.creator,
    });
    navigate("/cart");
  };

  const handleToggleSave = () => {
    setIsSaved(!isSaved);
  };

  const handlePurchase = () => {
    console.log("Purchase:", courseData);
  };

  // Sample recommended courses
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

  if (!courseData) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center">
        <p className="text-white">No course data available</p>
      </div>
    );
  }

  return (
    <main className="bg-[#0b0b0b] text-white min-h-screen">
      <HomeHeader
        search={searchQuery}
        onSearchChange={setSearchQuery}
        userName={userName ?? undefined}
        userEmail={userEmail ?? undefined}
        avatarUrl={avatarUrl ?? undefined}
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
              onClick={() => navigate("/video-player", { state: courseData })}
              className="absolute inset-0 flex items-center justify-center group"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-lime-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 sm:w-10 sm:h-10 text-black fill-black ml-1" />
              </div>
            </button>
          </div>

          {/* Course Info */}
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="space-y-3 sm:space-y-4">
              <p className="text-lime-400 text-sm sm:text-base font-semibold">
                {courseData.creator}
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-lime-400 leading-tight">
                {courseData.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-400">
                <span>{userName || "John Doe"}</span>
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
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleAddToCart}
                  className="bg-neutral-800 hover:bg-neutral-700 text-white border border-white/10"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to cart
                </Button>
                <Button
                  onClick={handleToggleSave}
                  className="bg-neutral-800 hover:bg-neutral-700 text-white border border-white/10"
                >
                  <Heart
                    className={`w-4 h-4 mr-2 ${isSaved ? "fill-lime-400 text-lime-400" : ""}`}
                  />
                  {isSaved ? "Saved" : "Save"}
                </Button>
              </div>
              <Button
                onClick={handlePurchase}
                className="bg-lime-400 hover:bg-lime-500 text-black font-bold w-full"
              >
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
              onAddToCart={() => {
                addItem({
                  id: course.id,
                  title: course.title,
                  price: course.price,
                  image: course.image,
                  creator: course.creator,
                });
                navigate("/cart");
              }}
              onViewDetails={() => navigate("/video-details", { state: course })}
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
              onAddToCart={() => {
                addItem({
                  id: `${course.id}-${idx}`,
                  title: course.title,
                  price: course.price,
                  image: course.image,
                  creator: course.creator,
                });
                navigate("/cart");
              }}
              onViewDetails={() => navigate("/video-details", { state: course })}
            />
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
