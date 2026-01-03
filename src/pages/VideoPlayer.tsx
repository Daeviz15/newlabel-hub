import { useEffect, useState, useRef, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { HomeHeader } from "@/components/home-header";
import Footer from "@/components/Footer";
import { CourseCard } from "@/components/course-card-interactive";
import { supabase } from "@/integrations/supabase/client";
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize, Settings, Lock, CheckCircle } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useWatchProgress } from "@/hooks/use-watch-progress";
import { useToast } from "@/hooks/use-toast";

interface CourseData {
  id: string;
  image: string;
  title: string;
  creator: string;
  price: string;
  lessons?: number;
  date?: string;
  description?: string;
  lessonId?: string;
  startTime?: number;
}

interface Lesson {
  id: string;
  title: string;
  video_url: string;
  order_number: number;
  is_preview: boolean | null;
  duration: string | null;
}

export default function VideoPlayer() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: courseId } = useParams<{ id: string }>();
  const courseData = location.state as CourseData;
  const { addItem } = useCart();
  const { toast } = useToast();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(courseData?.lessonId || null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

  // Access Control State
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [isLoadingAccess, setIsLoadingAccess] = useState(true);
  
  const { updateProgress } = useWatchProgress(userId);
  const lastSavedTime = useRef(0);

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
      if (!courseData?.id) return;
      
      setIsLoadingAccess(true);
      
      try {
        // Fetch all lessons for this course
        const { data: lessonsData, error: lessonsError } = await supabase
          .from("course_lessons")
          .select("id, title, video_url, order_number, is_preview, duration")
          .eq("course_id", courseData.id)
          .order("order_number", { ascending: true });

        if (lessonsError) {
          console.error("Error fetching lessons:", lessonsError);
        } else if (lessonsData) {
          setLessons(lessonsData);
          
          // Set the first lesson (or the one from props) as current
          if (lessonsData.length > 0) {
            const initialLesson = courseData?.lessonId 
              ? lessonsData.find(l => l.id === courseData.lessonId) || lessonsData[0]
              : lessonsData[0];
            setCurrentLesson(initialLesson);
            setCurrentLessonId(initialLesson.id);
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
  }, [courseData?.id, courseData?.lessonId, userId]);

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Save progress when video time updates (throttled to every 5 seconds)
  const saveProgress = useCallback(() => {
    if (!userId || !currentLessonId || !courseId || videoDuration === 0) return;
    
    // Only save if at least 5 seconds have passed since last save
    if (Math.abs(videoProgress - lastSavedTime.current) >= 5) {
      updateProgress(currentLessonId, courseId, videoProgress, videoDuration);
      lastSavedTime.current = videoProgress;
    }
  }, [userId, currentLessonId, courseId, videoProgress, videoDuration, updateProgress]);

  // Handle video time update
  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      setVideoProgress(videoRef.current.currentTime);
    }
  }, []);

  // Handle video loaded metadata
  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
      
      // If we have a start time from Continue Watching, seek to it
      if (courseData?.startTime && courseData.startTime > 0) {
        videoRef.current.currentTime = courseData.startTime;
      }
    }
  }, [courseData?.startTime]);

  // Save progress on pause or when leaving the page
  const handlePause = useCallback(() => {
    setIsPlaying(false);
    if (userId && currentLessonId && courseId && videoDuration > 0) {
      updateProgress(currentLessonId, courseId, videoProgress, videoDuration);
    }
  }, [userId, currentLessonId, courseId, videoProgress, videoDuration, updateProgress]);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  // Save progress when leaving the page
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (userId && currentLessonId && courseId && videoDuration > 0) {
        // Use sendBeacon for reliable saving on page unload
        const data = JSON.stringify({
          user_id: userId,
          lesson_id: currentLessonId,
          course_id: courseId,
          progress_seconds: Math.floor(videoProgress),
          duration_seconds: Math.floor(videoDuration),
        });
        navigator.sendBeacon?.('/api/save-progress', data);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [userId, currentLessonId, courseId, videoProgress, videoDuration]);

  // Periodic save while playing
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(saveProgress, 5000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, saveProgress]);

  // Set lesson ID from first lesson if not provided
  useEffect(() => {
    if (!currentLessonId && courseId) {
      supabase
        .from("course_lessons")
        .select("id")
        .eq("course_id", courseId)
        .order("order_number", { ascending: true })
        .limit(1)
        .maybeSingle()
        .then(({ data }) => {
          if (data?.id) {
            setCurrentLessonId(data.id);
          }
        });
    }
  }, [currentLessonId, courseId]);

  const handleSignOut = async () => {
    // Save progress before signing out
    if (userId && currentLessonId && courseId && videoDuration > 0) {
      await updateProgress(currentLessonId, courseId, videoProgress, videoDuration);
    }
    await supabase.auth.signOut();
    navigate("/login");
  };

  // Handle lesson selection with access control
  const handleLessonSelect = (lesson: Lesson) => {
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
    setCurrentLessonId(lesson.id);
    setVideoProgress(0);
    setVideoDuration(0);
    
    // Reset video to new source
    if (videoRef.current) {
      videoRef.current.load();
    }
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

      {/* Video Player Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-28 pb-8 sm:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player - Takes 2/3 on large screens */}
          <div className="lg:col-span-2">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black border border-white/10 group">
              {currentLesson?.video_url ? (
                <video
                  ref={videoRef}
                  src={currentLesson.video_url}
                  className="h-full w-full object-cover"
                  controls
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onPlay={handlePlay}
                  onPause={handlePause}
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-black/60">
                  <p className="text-white text-lg">
                    {isLoadingAccess ? "Loading..." : "No video available"}
                  </p>
                </div>
              )}

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
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-xs text-white/80 font-mono min-w-[40px]">
                    {formatTime(videoProgress)}
                  </span>
                  <div 
                    className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer group/progress"
                    onClick={(e) => {
                      if (videoRef.current) {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const percent = (e.clientX - rect.left) / rect.width;
                        videoRef.current.currentTime = percent * videoDuration;
                      }
                    }}
                  >
                    <div 
                      className="h-full bg-lime-400 rounded-full transition-all duration-100 relative"
                      style={{ width: `${videoDuration > 0 ? (videoProgress / videoDuration) * 100 : 0}%` }}
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-lime-400 rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity shadow-lg" />
                    </div>
                  </div>
                  <span className="text-xs text-white/80 font-mono min-w-[40px] text-right">
                    {formatTime(videoDuration)}
                  </span>
                </div>
                {/* Progress percentage badge */}
                <div className="flex justify-end mt-1">
                  <span className="text-[10px] text-lime-400 font-medium">
                    {videoDuration > 0 ? Math.round((videoProgress / videoDuration) * 100) : 0}% complete
                  </span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <button className="text-white hover:text-lime-400 transition-colors">
                    <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button className="text-white hover:text-lime-400 transition-colors">
                    <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button className="text-white hover:text-lime-400 transition-colors">
                    <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <button className="text-white hover:text-lime-400 transition-colors">
                    <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button className="text-white hover:text-lime-400 transition-colors">
                    <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button className="text-white hover:text-lime-400 transition-colors">
                    <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </div>
            </div>
          </div>

          {/* Playlist Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900/80 border border-white/10 rounded-xl p-4 h-fit max-h-[500px] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Lessons</h3>
                {hasPurchased && (
                  <span className="text-xs text-lime-400 bg-lime-400/10 px-2 py-1 rounded-full">
                    Purchased ✓
                  </span>
                )}
              </div>
              
              {isLoadingAccess ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-lime-400"></div>
                </div>
              ) : lessons.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">
                  No lessons available yet
                </p>
              ) : (
                <div className="space-y-2">
                  {lessons.map((lesson, index) => {
                    const canAccess = hasPurchased || lesson.is_preview;
                    const isActive = currentLesson?.id === lesson.id;
                    
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => handleLessonSelect(lesson)}
                        className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center gap-3 group/lesson ${
                          isActive 
                            ? "bg-lime-400/20 border border-lime-400/30" 
                            : "bg-white/5 hover:bg-white/10 border border-transparent"
                        } ${!canAccess ? "opacity-60" : ""}`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                          isActive ? "bg-lime-400 text-black" : "bg-white/10 text-white"
                        }`}>
                          {canAccess ? (
                            index + 1
                          ) : (
                            <Lock className="w-3.5 h-3.5" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${isActive ? "text-lime-400" : "text-white"}`}>
                            {lesson.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {lesson.duration && (
                              <span className="text-xs text-gray-400">{lesson.duration}</span>
                            )}
                            {lesson.is_preview && (
                              <span className="text-[10px] text-lime-400 bg-lime-400/10 px-1.5 py-0.5 rounded">
                                Preview
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {isActive && <Play className="w-4 h-4 text-lime-400 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
              
              {!hasPurchased && lessons.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <button
                    onClick={() => navigate("/video-details", { state: courseData })}
                    className="w-full bg-lime-400 hover:bg-lime-500 text-black font-semibold py-3 rounded-lg transition-all duration-200"
                  >
                    Purchase to Unlock All
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Course Info Section */}
        <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
            {currentLesson?.title || courseData.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base text-gray-400">
            <span className="font-semibold text-white">{courseData.creator || userName || "Instructor"}</span>
            <span>•</span>
            <span>{lessons.length || courseData.lessons || 0} Lessons</span>
            <span>•</span>
            <span>{courseData.date || "2025"}</span>
          </div>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-4xl">
            {courseData.description ||
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}
          </p>
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
                  price: parseFloat(course.price.replace(/[^\d.]/g, '')),
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
                  price: parseFloat(course.price.replace(/[^\d.]/g, '')),
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
