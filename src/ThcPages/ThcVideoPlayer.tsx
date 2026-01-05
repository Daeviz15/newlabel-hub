import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { THomeHeader } from "./components/home-header";
import ThcFooter from "./components/ThcFooter";
import { supabase } from "@/integrations/supabase/client";
import { Play, Pause, Volume2, Maximize, Lock } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";

interface PodcastData {
  id: string;
  image: string;
  title: string;
  host: string;
  episodeCount: number;
}

interface Episode {
  id: number;
  title: string;
  description: string;
  duration: string;
  releaseDate: string;
  image: string;
  episodeNumber: number;
}

export default function ThcPodcastDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const podcastData = location.state as PodcastData;
  const { addItem } = useCart();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [isLoadingAccess, setIsLoadingAccess] = useState(true);

  const episodes: Episode[] = [
    {
      id: 1,
      episodeNumber: podcastData?.episodeCount || 100,
      title: "The Beginning of Everything",
      description:
        "In this groundbreaking first episode, we explore the origins of modern technology and how it shaped our world.",
      duration: "1:45:23",
      releaseDate: "Nov 14, 2025",
      image: podcastData?.image || "/assets/podcast-episode.jpg",
    },
    {
      id: 2,
      episodeNumber: (podcastData?.episodeCount || 100) - 1,
      title: "Breaking the Barriers",
      description:
        "Discover how innovators around the world are breaking through traditional boundaries and creating new possibilities.",
      duration: "2:12:15",
      releaseDate: "Nov 12, 2025",
      image: "/assets/dashboard-images/face.jpg",
    },
    {
      id: 3,
      episodeNumber: (podcastData?.episodeCount || 100) - 2,
      title: "Voices of Change",
      description:
        "We sit down with thought leaders who are reshaping industries and challenging the status quo.",
      duration: "1:58:45",
      releaseDate: "Nov 10, 2025",
      image: "/assets/dashboard-images/firm.jpg",
    },
    {
      id: 4,
      episodeNumber: (podcastData?.episodeCount || 100) - 3,
      title: "The Future is Now",
      description:
        "Exploring the technologies and ideas that will define the next decade and beyond.",
      duration: "2:05:32",
      releaseDate: "Nov 8, 2025",
      image: "/assets/dashboard-images/lady.jpg",
    },
    {
      id: 5,
      episodeNumber: (podcastData?.episodeCount || 100) - 4,
      title: "Stories Untold",
      description:
        "Behind every success is a story waiting to be told. Listen to the personal journeys of industry pioneers.",
      duration: "1:52:10",
      releaseDate: "Nov 6, 2025",
      image: "/assets/dashboard-images/only.jpg",
    },
  ];

  const currentEpisode = episodes[currentEpisodeIndex];

  const relatedPodcasts: PodcastData[] = [];
  const [recommendedContent, setRecommendedContent] = useState<PodcastData[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(true);

  // Fetch similar THC content
  useEffect(() => {
    const fetchRecommendedContent = async () => {
      if (!podcastData?.id) return;
      
      setIsLoadingRecommendations(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("id, title, image_url, instructor")
          .eq("brand", "thc")
          .neq("id", podcastData.id)
          .limit(4)
          .order("created_at", { ascending: false });

        if (data && !error) {
          setRecommendedContent(
            data.map((item) => ({
              id: item.id,
              title: item.title,
              host: item.instructor || "The House Chronicles",
              episodeCount: Math.floor(Math.random() * 100) + 20,
              image: item.image_url || "/assets/dashboard-images/face.jpg",
            }))
          );
        }
      } catch (err) {
        console.error("Error fetching recommendations:", err);
      } finally {
        setIsLoadingRecommendations(false);
      }
    };

    fetchRecommendedContent();
  }, [podcastData?.id]);

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

  // Check purchase status
  useEffect(() => {
    const checkPurchase = async () => {
      if (!podcastData?.id || !userId) {
        setHasPurchased(false);
        setIsLoadingAccess(false);
        return;
      }
      
      setIsLoadingAccess(true);
      
      try {
        const { data: purchaseData } = await supabase
          .from("purchases")
          .select("id")
          .eq("user_id", userId)
          .eq("product_id", podcastData.id)
          .maybeSingle();

        setHasPurchased(!!purchaseData);
      } catch (err) {
        console.error("Error checking purchase:", err);
      } finally {
        setIsLoadingAccess(false);
      }
    };

    checkPurchase();
  }, [podcastData?.id, userId]);

  // Handle episode selection with access control
  const handleEpisodeSelect = (episodeIndex: number) => {
    // First episode is always a preview (free)
    const isPreview = episodeIndex === 0;
    const canAccess = hasPurchased || isPreview;
    
    if (!canAccess) {
      toast({
        title: "Content Locked 🔒",
        description: "Purchase this podcast to unlock all episodes.",
        variant: "destructive",
      });
      return;
    }
    
    setCurrentEpisodeIndex(episodeIndex);
  };

  if (!podcastData) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center">
        <p className="text-white">No podcast data available</p>
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

      {/* Podcast Header & Current Episode */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-28 pb-8 sm:pb-12">
        {/* Podcast Info Header */}
        <div className="mb-8 flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-shrink-0">
            <img
              src={podcastData.image || "/placeholder.svg"}
              alt={podcastData.title}
              className="w-40 h-40 rounded-lg object-cover border border-white/10"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {podcastData.title}
            </h1>
            <p className="text-lg text-zinc-400 mb-4">{podcastData.host}</p>
            <p className="text-sm text-zinc-500 mb-4">
              {podcastData.episodeCount} Episodes
            </p>
            <p className="text-zinc-300 max-w-2xl">
              Dive into fascinating conversations, expert insights, and untold
              stories. Join us for thought-provoking discussions that challenge
              perspectives and inspire change.
            </p>
          </div>
        </div>

        {/* Current Episode Player */}
        <div className="mb-12 rounded-xl overflow-hidden border border-white/10 bg-[#151515]">
          <div className="relative aspect-video w-full overflow-hidden bg-black">
            <img
              src={currentEpisode.image || "/placeholder.svg"}
              alt={currentEpisode.title}
              className="h-full w-full object-cover"
            />

            {/* Play/Pause Overlay */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors"
            >
              {!isPlaying && (
                <div className="w-20 h-20 rounded-full bg-[#70E002] flex items-center justify-center hover:scale-110 transition-transform">
                  <Play className="w-10 h-10 text-black fill-black ml-1" />
                </div>
              )}
            </button>

            {/* Episode Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
              <p className="text-sm font-medium text-zinc-400 mb-2">
                Episode {currentEpisode.episodeNumber}
              </p>
              <p className="text-white font-semibold text-lg">
                {currentEpisode.title}
              </p>
            </div>
          </div>

          {/* Episode Controls */}
          <div className="p-6 border-t border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <p className="text-sm text-zinc-400 mb-2">
                  {currentEpisode.releaseDate}
                </p>
                <p className="text-white font-semibold">
                  {currentEpisode.title}
                </p>
              </div>
              <p className="text-sm text-zinc-400 font-mono">
                {currentEpisode.duration}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-[#70E002] rounded-full"></div>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-6">
              <button className="text-zinc-400 hover:text-[#70E002] transition-colors">
                <Volume2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-[#70E002] hover:bg-[#65cc00] text-black rounded-full p-3 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 ml-1" />
                )}
              </button>
              <button className="text-zinc-400 hover:text-[#70E002] transition-colors">
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Episodes List */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              All Episodes ({episodes.length} / {podcastData.episodeCount})
            </h2>
            {hasPurchased && (
              <span className="text-xs text-[#70E002] bg-[#70E002]/10 px-2 py-1 rounded-full">
                Purchased ✓
              </span>
            )}
          </div>

          <div className="space-y-3">
            {episodes.map((episode, idx) => {
              // First episode is always a preview (free)
              const isPreview = idx === 0;
              const canAccess = hasPurchased || isPreview;
              const isActive = currentEpisodeIndex === idx;
              
              return (
                <div
                  key={episode.id}
                  onClick={() => handleEpisodeSelect(idx)}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#70E002]/10 border-[#70E002]"
                      : "bg-[#151515] border-white/10 hover:border-white/20"
                  } ${!canAccess ? "opacity-60" : ""}`}
                >
                  <div className="flex gap-4">
                    {/* Episode Thumbnail */}
                    <div className="flex-shrink-0 relative">
                      <img
                        src={episode.image || "/placeholder.svg"}
                        alt={episode.title}
                        className="w-16 h-16 rounded object-cover"
                      />
                      {!canAccess && (
                        <div className="absolute inset-0 bg-black/50 rounded flex items-center justify-center">
                          <Lock className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Episode Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-xs text-zinc-400 mb-1">
                            Episode {episode.episodeNumber} •{" "}
                            {episode.releaseDate}
                            {isPreview && (
                              <span className="ml-2 text-[#70E002]">Preview</span>
                            )}
                          </p>
                          <h3 className="text-white font-semibold line-clamp-2 mb-1">
                            {episode.title}
                          </h3>
                          <p className="text-xs text-zinc-400 line-clamp-2">
                            {episode.description}
                          </p>
                        </div>
                        <p className="text-sm text-zinc-400 flex-shrink-0">
                          {episode.duration}
                        </p>
                      </div>
                    </div>

                    {/* Play Button / Lock Icon */}
                    {canAccess ? (
                      isActive ? (
                        <div className="flex-shrink-0 flex items-center">
                          <div className="w-10 h-10 rounded-full bg-[#70E002] flex items-center justify-center">
                            {isPlaying ? (
                              <Pause className="w-5 h-5 text-black" />
                            ) : (
                              <Play className="w-5 h-5 text-black fill-black ml-1" />
                            )}
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEpisodeSelect(idx);
                            setIsPlaying(true);
                          }}
                          className="flex-shrink-0 w-10 h-10 rounded-full bg-white/10 hover:bg-[#70E002] flex items-center justify-center transition-colors"
                        >
                          <Play className="w-5 h-5 text-white hover:text-black fill-white hover:fill-black ml-1" />
                        </button>
                      )
                    ) : (
                      <div className="flex-shrink-0 flex items-center">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                          <Lock className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* You might also like section with related content */}
        <div className="mt-16 pt-12 border-t border-white/10">
          <h2 className="text-2xl font-bold text-white mb-8">
            You might also like
          </h2>

          {isLoadingRecommendations ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-gray-800 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-800 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-800 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : recommendedContent.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No recommendations available yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedContent.map((podcast) => (
                <div
                  key={podcast.id}
                  onClick={() =>
                    navigate("/thc-video-player", { state: podcast })
                  }
                  className="group cursor-pointer"
                >
                  {/* Podcast Card */}
                  <div className="relative mb-4 rounded-lg overflow-hidden border border-white/10 hover:border-[#70E002] transition-colors">
                    <img
                      src={podcast.image || "/placeholder.svg"}
                      alt={podcast.title}
                      className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Overlay with play button */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-[#70E002] flex items-center justify-center">
                        <Play className="w-6 h-6 text-black fill-black ml-1" />
                      </div>
                    </div>
                  </div>

                  {/* Podcast Info */}
                  <h3 className="text-white font-semibold line-clamp-2 mb-1 group-hover:text-[#70E002] transition-colors">
                    {podcast.title}
                  </h3>
                  <p className="text-sm text-zinc-400 mb-2 line-clamp-1">
                    {podcast.host}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {podcast.episodeCount} Episodes
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ThcFooter />
    </main>
  );
}

