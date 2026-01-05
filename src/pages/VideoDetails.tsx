import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HomeHeader } from "@/components/home-header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Play, Loader2 } from "lucide-react";
import { CourseCard } from "@/components/course-card-interactive";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/use-cart";
import { addSaved, isItemSaved, removeSaved } from "@/hooks/use-saved";
import { useUserProfile } from "@/hooks/use-user-profile";
import { Skeleton } from "@/components/ui/skeleton";

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

interface RecommendedCourse {
  id: string;
  image: string;
  title: string;
  creator: string;
  price: string;
}

export default function VideoDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const courseData = location.state as CourseData;
  const { addItem } = useCart();
  const { userName, userEmail, avatarUrl } = useUserProfile();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [recommendedCourses, setRecommendedCourses] = useState<RecommendedCourse[]>([]);
  const [isLoadingRecommended, setIsLoadingRecommended] = useState(true);

  // Fetch recommended courses from Supabase
  useEffect(() => {
    const fetchRecommendedCourses = async () => {
      setIsLoadingRecommended(true);
      try {
        // Exclude current course and get random selection
        const { data, error } = await supabase
          .from("products")
          .select("id, title, price, image_url, instructor")
          .neq("id", courseData?.id || "")
          .limit(8)
          .order("created_at", { ascending: false });

        if (!error && data) {
          setRecommendedCourses(
            data.map((product) => ({
              id: product.id,
              image: product.image_url || "/assets/dashboard-images/face.jpg",
              title: product.title,
              creator: product.instructor || "Instructor",
              price: `₦${product.price.toLocaleString()}`,
            }))
          );
        }
      } catch (err) {
        console.error("Error fetching recommended courses:", err);
      } finally {
        setIsLoadingRecommended(false);
      }
    };

    fetchRecommendedCourses();
  }, [courseData?.id]);

  useEffect(() => {
    // Initialize saved state for this course
    if (courseData?.id) {
      setIsSaved(isItemSaved(courseData.id));
    }
  }, [courseData?.id]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleAddToCart = () => {
    addItem({
      id: courseData.id,
      title: courseData.title,
      price: parseFloat(courseData.price.replace(/[^\d.]/g, '')),
      image: courseData.image,
      creator: courseData.creator,
    });
    navigate("/cart");
  };

  const handleToggleSave = () => {
    if (!courseData) return;
    if (isSaved) {
      removeSaved(courseData.id);
      setIsSaved(false);
    } else {
      addSaved({
        id: courseData.id,
        title: courseData.title,
        image: courseData.image,
        creator: courseData.creator,
        price: courseData.price,
      });
      setIsSaved(true);
    }
  };

  const handlePurchase = () => {
    navigate("/checkout", { state: { from: "video-details", item: courseData } });
  };

  if (!courseData) {
    return (
      <main className="min-h-screen bg-[#0b0b0b] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Course Not Found</h1>
          <p className="text-gray-400 mb-6">The course you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => navigate("/dashboard")}
            className="bg-lime-500 text-black px-6 py-2 rounded-lg hover:bg-lime-600 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </main>
    );
  }

  // Default description when none provided
  const defaultDescription = `Dive into "${courseData.title}" and expand your knowledge with comprehensive lessons taught by ${courseData.creator}. This course covers essential concepts and practical applications to help you master the subject matter. Perfect for beginners and intermediate learners looking to enhance their skills.`;

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
              src={courseData.image || "/assets/dashboard-images/face.jpg"}
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
                <span>{courseData.creator}</span>
                <span>•</span>
                <span>{courseData.lessons || "Multiple"} Lessons</span>
                <span>•</span>
                <span>{courseData.price}</span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              {courseData.description || defaultDescription}
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
        
        {isLoadingRecommended ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[4/5] w-full rounded-xl bg-neutral-800" />
                <Skeleton className="h-4 w-3/4 bg-neutral-800" />
                <Skeleton className="h-3 w-1/2 bg-neutral-800" />
              </div>
            ))}
          </div>
        ) : recommendedCourses.length > 0 ? (
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
                    price: parseFloat(course.price.replace(/[^\d.]/g, '')),
                    image: course.image,
                    creator: course.creator,
                  });
                  navigate("/cart");
                }}
                onViewDetails={() => navigate("/video-details", { 
                  state: {
                    id: course.id,
                    image: course.image,
                    title: course.title,
                    creator: course.creator,
                    price: course.price,
                  } 
                })}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8">
            No recommendations available at this time.
          </p>
        )}
      </div>

      <Footer />
    </main>
  );
}
