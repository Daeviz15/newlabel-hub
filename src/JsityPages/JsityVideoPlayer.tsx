import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { JHomeHeader } from "./components/home-header";
import JsityFooter from "./components/JsityFooter";
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
import { BrandedSpinner } from "@/components/ui/BrandedSpinner";

interface CourseData {
  courseId: string;
  lessonId?: string;
  videoUrl?: string;
  image: string;
  title: string;
  creator: string;
  price: string;
  lessons?: any[];
  description?: string;
}

export default function VideoPlayer() {
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
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [allLessons, setAllLessons] = useState<any[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<any[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(true);
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

  // Fetch lessons and check purchase status
  useEffect(() => {
    const fetchAccessData = async () => {
      if (!courseData?.courseId) return;
      
      setIsLoadingAccess(true);
      
      try {
        // Fetch course details for preview video
        const { data: productData } = await supabase
          .from('products')
          .select('preview_video_url, description, title')
          .eq('id', courseData.courseId)
          .single();

        // Fetch all lessons for this course
        const { data: lessonsData } = await supabase
          .from('course_lessons')
          .select('id, title, description, video_url, order_number, is_preview, duration')
          .eq('course_id', courseData.courseId)
          .order('order_number', { ascending: true });

        if (lessonsData) {
          setAllLessons(lessonsData);
          
          if (!currentLesson) {
            // Priority 1: Specific lesson requested via URL/State
            if (courseData.lessonId) {
              const targetLesson = lessonsData.find(l => l.id === courseData.lessonId);
              if (targetLesson) setCurrentLesson(targetLesson);
            }
            // Priority 2: Course Preview Video (Trailer)
            else if (productData?.preview_video_url) {
              setCurrentLesson({
                id: 'trailer',
                title: 'Course Preview',
                video_url: productData.preview_video_url,
                description: productData.description || courseData.description,
                is_preview: true,
                duration: 'Trailer',
                is_trailer: true // Add flag to distinguish
              });
            }
            // Priority 3: First lesson marked as preview
            else {
              const previewLesson = lessonsData.find(l => l.is_preview);
              const firstLesson = lessonsData[0];
              setCurrentLesson(previewLesson || firstLesson);
            }
          }
        }

        // Check if user has purchased this course
        if (userId) {
          const { data: purchaseData } = await supabase
            .from("purchases")
            .select("id")
            .eq("user_id", userId)
            .eq("product_id", courseData.courseId)
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
  }, [courseData?.courseId, courseData?.lessonId, userId]);

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

  // Fetch similar Jsity courses
  useEffect(() => {
    const fetchRecommendedCourses = async () => {
      setIsLoadingRecommendations(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("id, title, image_url, instructor, price")
          .eq("brand", "jsity")
          .neq("id", courseData?.courseId || "")
          .limit(4)
          .order("created_at", { ascending: false });

        if (data && !error) {
          setRecommendedCourses(
            data.map((item) => ({
              id: item.id,
              image: item.image_url || "/assets/dashboard-images/face.jpg",
              title: item.title,
              creator: item.instructor || "Jsity",
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
  }, [courseData?.courseId]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (!courseData) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center">
        <p className="text-white">No course data available</p>
      </div>
    );
  }

  return (
    <main className="bg-[#0b0b0b] text-white min-h-screen">
      <JHomeHeader
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
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black border border-white/10 max-w-4xl mx-auto shadow-2xl shadow-black/50">
          {isLoadingAccess ? (
            <div className="h-full w-full flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-4">
                 <BrandedSpinner size="lg" />
                 <p className="text-gray-400 text-sm animate-pulse">Loading content...</p>
              </div>
            </div>
          ) : currentLesson?.video_url ? (
            <video
              src={currentLesson.video_url}
              controls
              autoPlay
              className="h-full w-full"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gray-900">
               <div className="flex flex-col items-center gap-2 text-gray-500">
                  <Play className="w-12 h-12 opacity-20" />
                  <p>No video available for this lesson</p>
               </div>
            </div>
          )}
        </div>

        {/* Course Info Section */}
        <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
            {currentLesson?.title || courseData.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base text-gray-400">
            <span className="font-semibold text-white">
              {courseData.creator}
            </span>
            <span>•</span>
            <span>{allLessons.length} Lessons</span>
            {currentLesson?.duration && (
              <>
                <span>•</span>
                <span>{currentLesson.duration}</span>
              </>
            )}
          </div>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-4xl">
            {currentLesson?.description || courseData.description || "No description available."}
          </p>
        </div>

        {/* Lessons List */}
        {allLessons.length > 0 && (
          <div className="mt-8 space-y-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Course Lessons</h2>
              {hasPurchased && (
                <span className="text-xs text-purple-400 bg-purple-400/10 px-2 py-1 rounded-full">
                  Purchased ✓
                </span>
              )}
            </div>
            {isLoadingAccess ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400"></div>
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
                          ? "border-purple-500 bg-purple-500/10"
                          : "border-gray-800 hover:bg-gray-900 hover:border-purple-500"
                      } ${!canAccess ? "opacity-60" : ""}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            isActive ? "bg-purple-500 text-white" : "bg-white/10 text-white"
                          }`}>
                            {canAccess ? (
                              index + 1
                            ) : (
                              <Lock className="w-3.5 h-3.5" />
                            )}
                          </div>
                          <div>
                            <h3 className={`font-medium ${isActive ? "text-purple-400" : "text-white"}`}>
                              {lesson.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-0.5">
                              {lesson.duration && (
                                <span className="text-sm text-gray-400">{lesson.duration}</span>
                              )}
                              {lesson.is_preview && (
                                <span className="text-xs text-purple-400 bg-purple-400/10 px-1.5 py-0.5 rounded">
                                  Preview
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {canAccess ? (
                          <Play className={`w-5 h-5 ${isActive ? "text-purple-400" : "text-gray-400"}`} />
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
                accent="purple"
                onAddToCart={() => {
                  addItem({
                    id: course.id,
                    title: course.title,
                    price: parseFloat(course.price.replace(/[^\d.]/g, "")),
                    image: course.image,
                    creator: course.creator,
                  });
                  navigate("/jcart");
                }}
                onViewDetails={() =>
                  navigate("/jsity-course-details", { state: course })
                }
              />
            ))}
          </div>
        )}
      </div>

      <JsityFooter />
    </main>
  );
}

