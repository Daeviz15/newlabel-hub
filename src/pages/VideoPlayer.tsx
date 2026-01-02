import { useEffect, useState, useRef, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { HomeHeader } from "@/components/home-header";
import Footer from "@/components/Footer";
import { CourseCard } from "@/components/course-card-interactive";
import { supabase } from "@/integrations/supabase/client";
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize, Settings } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useWatchProgress } from "@/hooks/use-watch-progress";

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

export default function VideoPlayer() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: courseId } = useParams<{ id: string }>();
  const courseData = location.state as CourseData;
  const { addItem } = useCart();

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
        {/* Video Player */}
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black border border-white/10 group">
          {courseData.image ? (
            <video
              ref={videoRef}
              src={courseData.image}
              className="h-full w-full object-cover"
              controls
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={handlePlay}
              onPause={handlePause}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-black/60">
              <p className="text-white text-lg">No video available</p>
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
              <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-lime-400 rounded-full"></div>
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

        {/* Course Info Section */}
        <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
            {courseData.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base text-gray-400">
            <span className="font-semibold text-white">{userName || "John Doe"}</span>
            <span>•</span>
            <span>{courseData.lessons || 32} Lessons</span>
            <span>•</span>
            <span>{courseData.date || "12-08-2025"}</span>
          </div>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-4xl">
            {courseData.description ||
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}
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
