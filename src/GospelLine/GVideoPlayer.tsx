import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { THomeHeader } from "./components/home-header";
import { CourseCard } from "@/components/course-card-interactive";
import { supabase } from "@/integrations/supabase/client";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Maximize,
  Settings,
  Lock,
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import GFooter from "./components/GFooter";

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

export default function GVideoPlayer() {
  const location = useLocation();
  const navigate = useNavigate();
  const courseData = location.state as CourseData;
  const { addItem } = useCart();

  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [allLessons, setAllLessons] = useState<any[]>([]);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [isLoadingAccess, setIsLoadingAccess] = useState(true);

  useEffect(() => {
    const updateFromSession = (session: any) => {
      const user = session?.user || null;
      setUserName(user?.user_metadata?.full_name || null);
      setUserEmail(user?.email || null);
      setAvatarUrl(user?.user_metadata?.avatar_url || null);
      setUserId(user?.id || null);

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

  // Fetch lessons and check purchase status
  useEffect(() => {
    const fetchAccessData = async () => {
      if (!courseData?.id) return;
      
      setIsLoadingAccess(true);
      
      try {
        // Fetch all lessons for this course
        const { data: lessonsData } = await supabase
          .from('course_lessons')
          .select('id, title, video_url, order_number, is_preview, duration')
          .eq('course_id', courseData.id)
          .order('order_number', { ascending: true });

        if (lessonsData) {
          setAllLessons(lessonsData);
          
          // Set current lesson - prefer preview for unpurchased users
          if (lessonsData.length > 0) {
            const initialLesson = lessonsData.find(l => l.is_preview) || lessonsData[0];
            setCurrentLesson(initialLesson);
          }
        }

        // Check if user has purchased this course
        if (userId) {
          const { data: purchaseData } = await supabase
            .from("purchases")
            .select("id")
            .eq("user_id", userId)
            .eq("product_id", courseData.id)
            .maybeSingle();

          setHasPurchased(!!purchaseData);
        } else {
          setHasPurchased(false);
        }
      } catch (err) {
        console.error("Error fetching access data:", err);
      } finally {
        setIsLoadingAccess(false);
      }
    };

    fetchAccessData();
  }, [courseData?.id, userId]);

  // Handle lesson selection with access control
  const handleLessonSelect = (lesson: any) => {
    const canAccess = hasPurchased || lesson.is_preview;
    
    if (!canAccess) {
      toast({
        title: "Content Locked 🔒",
        description: "Purchase this course to unlock all lessons.",
        variant: "destructive",
      });
      return;
    }
    
    setCurrentLesson(lesson);
  };

  const [recommendedCourses, setRecommendedCourses] = useState<any[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(true);

  // Fetch similar Gospel courses
  useEffect(() => {
    const fetchRecommendedCourses = async () => {
      if (!courseData?.id) return;
      
      setIsLoadingRecommendations(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("id, title, image_url, instructor, price")
          .eq("brand", "gospeline")
          .neq("id", courseData.id)
          .limit(4)
          .order("created_at", { ascending: false });

        if (data && !error) {
          setRecommendedCourses(
            data.map((item) => ({
              id: item.id,
              image: item.image_url || "/assets/gospel.png",
              title: item.title,
              creator: item.instructor || "Gospeline",
              price: `₦${item.price}`,
            }))
          );
        }
      } catch (err) {
        console.error("Error fetching recommendations:", err);
      } finally {
        setIsLoadingRecommendations(false);
      }
    };

    fetchRecommendedCourses();
  }, [courseData?.id]);

  if (!courseData) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center">
        <p className="text-white">No course data available</p>
      </div>
    );
  }

  return (
    <main className="bg-[#0b0b0b] text-white min-h-screen">
      <THomeHeader
        search={searchQuery}
        onSearchChange={setSearchQuery}
        userName={userName ?? undefined}
        userEmail={userEmail ?? undefined}
        avatarUrl={avatarUrl ?? undefined}
        onSignOut={handleSignOut}
      />

      {/* Video Player Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-28 pb-8 sm:pb-12">
        {/* Video Player */}
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black border border-white/10 group">
          <img
            src={courseData.image}
            alt={courseData.title}
            className="h-full w-full object-cover"
          />

          {/* Play/Pause Overlay */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors"
          >
            {!isPlaying && (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 sm:w-10 sm:h-10 text-black fill-black ml-1" />
              </div>
            )}
          </button>

          {/* Video Title Overlay (Bottom Left) */}
          <div className="absolute bottom-14 sm:bottom-16 left-4 sm:left-6 text-white">
            <p className="text-xs sm:text-sm font-medium opacity-90">
              {courseData.title}
            </p>
          </div>

          {/* Video Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3 sm:p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Progress Bar */}
            <div className="mb-3 sm:mb-4">
              <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-[#70E002] rounded-full"></div>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <button className="text-white hover:text-[#70E002] transition-colors">
                  <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button className="text-white hover:text-[#70E002] transition-colors">
                  <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button className="text-white hover:text-[#70E002] transition-colors">
                  <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <button className="text-white hover:text-[#70E002] transition-colors">
                  <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button className="text-white hover:text-[#70E002] transition-colors">
                  <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button className="text-white hover:text-[#70E002] transition-colors">
                  <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Course Info Section */}
        <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
            {courseData.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base text-gray-400">
            <span className="font-semibold text-white">
              {userName || "John Doe"}
            </span>
            <span>•</span>
            <span>{allLessons.length || courseData.lessons || 0} Lessons</span>
            <span>•</span>
            <span>{courseData.date || "12-08-2025"}</span>
          </div>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-4xl">
            {courseData.description || "No description available for this course."}
          </p>
        </div>

        {/* Lessons List */}
        {allLessons.length > 0 && (
          <div className="mt-8 space-y-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Course Lessons</h2>
              {hasPurchased && (
                <span className="text-xs text-[#70E002] bg-[#70E002]/10 px-2 py-1 rounded-full">
                  Purchased ✓
                </span>
              )}
            </div>
            {isLoadingAccess ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#70E002]"></div>
              </div>
            ) : (
              <div className="space-y-2">
                {allLessons.map((lesson: any, index: number) => {
                  const canAccess = hasPurchased || lesson.is_preview;
                  const isActive = currentLesson?.id === lesson.id;
                  
                  return (
                    <div
                      key={lesson.id}
                      onClick={() => handleLessonSelect(lesson)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        isActive
                          ? "border-[#70E002] bg-[#70E002]/10"
                          : "border-gray-800 hover:bg-gray-900 hover:border-[#70E002]"
                      } ${!canAccess ? "opacity-60" : ""}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            isActive ? "bg-[#70E002] text-black" : "bg-white/10 text-white"
                          }`}>
                            {canAccess ? (
                              index + 1
                            ) : (
                              <Lock className="w-3.5 h-3.5" />
                            )}
                          </div>
                          <div>
                            <h3 className={`font-medium ${isActive ? "text-[#70E002]" : "text-white"}`}>
                              {lesson.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-0.5">
                              {lesson.duration && (
                                <span className="text-sm text-gray-400">{lesson.duration}</span>
                              )}
                              {lesson.is_preview && (
                                <span className="text-xs text-[#70E002] bg-[#70E002]/10 px-1.5 py-0.5 rounded">
                                  Preview
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {canAccess ? (
                          <Play className={`w-5 h-5 ${isActive ? "text-[#70E002]" : "text-gray-400"}`} />
                        ) : (
                          <Lock className="w-4 h-4 text-gray-500" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* You Might Also Like Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 lg:pb-20">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
          You Might Also Like
        </h2>
        {isLoadingRecommendations ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-video bg-gray-800 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-800 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-800 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : recommendedCourses.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No recommendations available yet.</p>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {recommendedCourses.map((course) => (
              <CourseCard
                key={course.id}
                id={course.id}
                image={course.image}
                title={course.title}
                creator={course.creator}
                price={course.price}
                accent="lime"
                onAddToCart={() => {
                  addItem({
                    id: course.id,
                    title: course.title,
                    price: parseFloat(course.price.replace(/[^\d.]/g, "")),
                    image: course.image,
                    creator: course.creator,
                  });
                  navigate("/gospel-cart");
                }}
                onViewDetails={() =>
                  navigate("/gospelline-course-details", { state: course })
                }
              />
            ))}
          </div>
        )}
      </div>

      <GFooter />
    </main>
  );
}

