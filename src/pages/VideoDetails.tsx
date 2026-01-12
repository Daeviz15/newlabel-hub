import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { HomeHeader } from "@/components/home-header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Play, Loader2 } from "lucide-react";
import { CourseCard } from "@/components/course-card-interactive";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/use-cart";
import { useSavedItems } from "@/hooks/use-saved-items";
import { useUserProfile } from "@/hooks/use-user-profile";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

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
  const { id } = useParams();
  const { addItem } = useCart();
  const { isItemSaved, toggleSavedItem } = useSavedItems();
  const { userName, userEmail, avatarUrl } = useUserProfile();

  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [recommendedCourses, setRecommendedCourses] = useState<RecommendedCourse[]>([]);
  const [isLoadingRecommended, setIsLoadingRecommended] = useState(true);

  useEffect(() => {
    const initializeCourse = async () => {
      let courseData = location.state as CourseData;

      if (!courseData && id) {
        // Fetch from database if no state provided
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

        if (data && !error) {
          courseData = {
            id: data.id,
            image: data.image_url || "/assets/dashboard-images/face.jpg",
            title: data.title,
            creator: data.instructor || "Unknown",
            price: `₦${data.price?.toLocaleString() || "0"}`,
            lessons: 0, // You might want to fetch this from a lessons table
            date: new Date(data.created_at).toLocaleDateString(),
            description: data.description || "",
          };
        }
      }

      if (courseData) {
        setCourse(courseData);
      }
      setLoading(false);
    };

    initializeCourse();
  }, [id, location.state]);

  // Fetch recommended courses
  useEffect(() => {
    const fetchRecommendedCourses = async () => {
      if (!course?.id) return;

      setIsLoadingRecommended(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("id, title, image_url, instructor, price")
          .neq("id", course.id)
          .limit(4)
          .order("created_at", { ascending: false });

        if (data && !error) {
          setRecommendedCourses(
            data.map((item) => ({
              id: item.id,
              image: item.image_url || "/assets/dashboard-images/face.jpg",
              title: item.title,
              creator: item.instructor || "Unknown",
              price: `₦${item.price?.toLocaleString() || "0"}`,
            }))
          );
        }
      } catch (err) {
        console.error("Error fetching recommendations:", err);
      } finally {
        setIsLoadingRecommended(false);
      }
    };

    fetchRecommendedCourses();
  }, [course?.id]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleAddToCart = () => {
    if (!course) return;
    addItem({
      id: course.id,
      title: course.title,
      price: parseFloat(course.price.replace(/[^\d.]/g, "")),
      image: course.image,
      creator: course.creator,
    });
    toast.success("Added to cart");
  };

  const handlePurchaseNow = () => {
    if (!course) return;
    addItem({
      id: course.id,
      title: course.title,
      price: parseFloat(course.price.replace(/[^\d.]/g, "")),
      image: course.image,
      creator: course.creator,
    });
    navigate("/checkout");
  };

  const handleToggleSave = async () => {
    if (!course?.id) return;
    await toggleSavedItem(course.id);
  };

  const isSaved = course?.id ? isItemSaved(course.id) : false;

  if (loading) {
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
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
        </div>
      </main>
    );
  }

  if (!course) {
    return (
      <main className="bg-[#0b0b0b] text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Course Not Found</h1>
          <p className="text-gray-400 mb-6">The course you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/catalogue")}>
            Back to Catalogue
          </Button>
        </div>
      </main>
    );
  }

  const defaultDescription = "Enhance your skills with this comprehensive course designed to provide you with practical knowledge and hands-on experience. Perfect for beginners and intermediate learners looking to advance their expertise.";

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
              src={course.image}
              alt={course.title}
              className="h-full w-full object-cover"
            />
            <button
              onClick={() => navigate("/video-player", { state: course })}
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
                {course.creator}
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-purple-400 leading-tight">
                {course.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-400">
                <span>{course.creator}</span>
                <span>•</span>
                <span>{course.lessons || "Multiple"} Lessons</span>
                <span>•</span>
                <span>{course.price}</span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              {course.description || defaultDescription}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mt-4">
              <h1 className="font-bold">{course.price}</h1>

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
                    className={`w-4 h-4 mr-2 ${isSaved ? "fill-purple-400 text-purple-400" : ""
                      }`}
                  />
                  {isSaved ? "Saved" : "Save"}
                </Button>
              </div>
              <Button
                onClick={handlePurchaseNow}
                className="bg-purple-400 hover:bg-purple-500 text-black font-bold w-full"
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
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <Skeleton className="aspect-video bg-gray-800 rounded-lg mb-3" />
                <Skeleton className="h-4 bg-gray-800 rounded w-3/4 mb-2" />
                <Skeleton className="h-3 bg-gray-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : recommendedCourses.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No recommendations available yet.</p>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {recommendedCourses.map((rcourse) => (
              <CourseCard
                key={rcourse.id}
                id={rcourse.id}
                image={rcourse.image}
                title={rcourse.title}
                creator={rcourse.creator}
                price={rcourse.price}
                accent="purple"
                className="hover:bg-purple-500/20"
                onAddToCart={() => {
                  addItem({
                    id: rcourse.id,
                    title: rcourse.title,
                    price: parseFloat(rcourse.price.replace(/[^\d.]/g, "")),
                    image: rcourse.image,
                    creator: rcourse.creator,
                  });
                  toast.success("Added to cart");
                }}
                onViewDetails={() =>
                  navigate("/video-details", { state: rcourse })
                }
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}