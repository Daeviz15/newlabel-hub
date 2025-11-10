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
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";

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

  const [searchQuery, setSearchQuery] = useState("");
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [allLessons, setAllLessons] = useState<any[]>([]);

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

  useEffect(() => {
    const fetchLessons = async () => {
      if (!courseData?.courseId) return;

      const { data } = await supabase
        .from('course_lessons')
        .select('*')
        .eq('course_id', courseData.courseId)
        .order('order_number', { ascending: true });

      if (data) {
        setAllLessons(data);
        
        // Set current lesson based on lessonId or first lesson
        const lesson = courseData.lessonId 
          ? data.find(l => l.id === courseData.lessonId)
          : data[0];
        
        setCurrentLesson(lesson);
      }
    };

    fetchLessons();
  }, [courseData]);

  const handleSignOut = async () => {
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
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black border border-white/10">
          {currentLesson?.video_url ? (
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
              <p className="text-gray-400">No video available</p>
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
            <h2 className="text-xl font-bold mb-4">Course Lessons</h2>
            <div className="space-y-2">
              {allLessons.map((lesson: any) => (
                <div
                  key={lesson.id}
                  onClick={() => setCurrentLesson(lesson)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all hover:border-purple-500 ${
                    currentLesson?.id === lesson.id
                      ? "border-purple-500 bg-purple-500/10"
                      : "border-gray-800 hover:bg-gray-900"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{lesson.title}</h3>
                      {lesson.duration && (
                        <p className="text-sm text-gray-400">{lesson.duration}</p>
                      )}
                    </div>
                    <Play className="w-5 h-5 text-purple-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
