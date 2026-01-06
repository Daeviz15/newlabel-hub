import React, { useState, useEffect, useCallback } from "react";
import { ResumeCard, ProductCard } from "@/components/course-card";
import { HomeHeader } from "../components/home-header";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useWatchProgress } from "@/hooks/use-watch-progress";
import { Loader2, Heart, ShoppingBag, Download, PlayCircle } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { useSavedItems } from "@/hooks/use-saved-items";

interface Product {
  id: string;
  title: string;
  image_url: string | null;
  instructor: string | null;
  price: number;
  brand: string | null;
}

interface SavedItem {
  id: string;
  product_id: string;
  products: Product;
}

interface Purchase {
  id: string;
  product_id: string;
  purchased_at: string;
  products: Product;
}

interface VideoProgress {
  id: string;
  product_id: string;
  progress_percentage: number;
  last_watched_at: string;
  products: Product;
}

export default function MyLibrary() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "all";
  const [activeTab, setActiveTab] = useState(initialTab);
  const { userName, userEmail, avatarUrl } = useUserProfile();

  const [isLoading, setIsLoading] = useState(true);
  const { savedItems, isLoading: isLoadingSaved } = useSavedItems();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [videoProgress, setVideoProgress] = useState<VideoProgress[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  const { watchProgress, isLoading: isLoadingProgress, getProgressPercent } = useWatchProgress(userId);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }
      setUserId(user.id);
    };
    fetchUserData();
  }, [navigate]);

  const fetchLibraryData = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      // Fetch purchases with product details
      const { data: purchaseData, error: purchaseError } = await supabase
        .from("purchases")
        .select(`
          id,
          product_id,
          purchased_at,
          products (
            id,
            title,
            image_url,
            instructor,
            price,
            brand
          )
        `)
        .eq("user_id", userId)
        .order("purchased_at", { ascending: false });

      if (purchaseError) throw purchaseError;
      setPurchases((purchaseData as unknown as Purchase[]) || []);

      // Fetch video progress for purchased courses (only those with progress > 0 and < 100)
      const { data: progressData, error: progressError } = await supabase
        .from("video_progress")
        .select(`
          id,
          product_id,
          progress_percentage,
          last_watched_at,
          products (
            id,
            title,
            image_url,
            instructor,
            price,
            brand
          )
        `)
        .eq("user_id", userId)
        .gt("progress_percentage", 0)
        .lt("progress_percentage", 100)
        .order("last_watched_at", { ascending: false });

      if (progressError) throw progressError;
      setVideoProgress((progressData as unknown as VideoProgress[]) || []);
    } catch (error) {
      console.error("Error fetching library data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    fetchLibraryData();
  }, [userId, fetchLibraryData]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const tabs = [
    { id: "all", label: "All" },
    { id: "continue", label: "Continue Watching" },
    { id: "purchased", label: "Purchased" },
    { id: "saved", label: "Saved" },
    { id: "downloads", label: "Downloads" },
  ];

  const showContinue = activeTab === "all" || activeTab === "continue";
  const showPurchased = activeTab === "all" || activeTab === "purchased";
  const showSaved = activeTab === "all" || activeTab === "saved";
  const showDownloads = activeTab === "all" || activeTab === "downloads";

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-brand-green text-black text-sm sm:text-base m-4 py-2 text-center font-medium rounded-md sm:hidden">
        <a href="/free-courses" className="hover:underline">
          Free Courses 🌟 Sale Ends Soon, Get It Now →
        </a>
      </div>
      <HomeHeader
        search=""
        onSearchChange={() => { }}
        userName={userName ?? undefined}
        userEmail={userEmail ?? undefined}
        avatarUrl={avatarUrl ?? undefined}
        onSignOut={handleSignOut}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-foreground text-2xl sm:text-3xl md:text-4xl font-vietnam font-bold mb-2">
            My Library
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm font-vietnam">
            Find all of your saved, purchased and in-progress content here
          </p>
        </div>
        <div className="w-full h-[1px] bg-border mt-6 sm:mt-12 mb-6 sm:mb-8"></div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id)}
              className={
                activeTab === tab.id
                  ? "bg-brand-green text-black hover:bg-brand-green-hover font-vietnam"
                  : "bg-muted border-border text-foreground hover:bg-muted/80 font-vietnam"
              }
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {(isLoading || isLoadingProgress) ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-brand-green" />
          </div>
        ) : (
          <>
            {/* Continue Watching */}
            {showContinue && (
              <section className="mb-8 sm:mb-12">
                <div className="flex items-center gap-2 mb-2">
                  <PlayCircle className="w-5 h-5 text-brand-green" />
                  <h2 className="text-foreground text-xl sm:text-2xl font-bold font-vietnam">
                    Continue Watching
                  </h2>
                </div>
                <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base font-vietnam">
                  Pick up where you left off.
                </p>
                {watchProgress.length > 0 ? (
                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {watchProgress.map((item) => (
                      <ResumeCard
                        key={item.id}
                        imageSrc={item.course?.image_url || "/assets/dashboard-images/face.jpg"}
                        title={item.lesson?.title || item.course?.title || "Untitled"}
                        percent={getProgressPercent(item.progress_seconds, item.duration_seconds)}
                        brand={item.course?.brand || "jsity"}
                        onClick={() => navigate(`/video/${item.course_id}`, {
                          state: {
                            lessonId: item.lesson_id,
                            startTime: item.progress_seconds
                          }
                        })}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <EmptyState
                      icon={PlayCircle}
                      title="No videos in progress"
                      description="Start watching a course to track your progress here."
                    />
                    <Button
                      onClick={() => navigate("/catalogue")}
                      className="bg-brand-green hover:bg-brand-green-hover text-black font-vietnam mt-4"
                    >
                      Browse Courses
                    </Button>
                  </div>
                )}
              </section>
            )}

            {/* Purchased */}
            {showPurchased && (
              <section className="mb-8 sm:mb-12">
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingBag className="w-5 h-5 text-brand-green" />
                  <h2 className="text-foreground text-xl sm:text-2xl font-bold font-vietnam">
                    Purchased
                  </h2>
                </div>
                <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base font-vietnam">
                  Access your purchased courses and content anytime.
                </p>
                {purchases.length > 0 ? (
                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {purchases.map((purchase) => {
                      const brand = purchase.products?.brand?.toLowerCase();
                      const playerRoute =
                        brand === "jsity"
                          ? "/jsity-video-player"
                          : brand === "thc"
                            ? "/thc-video-player"
                            : brand === "gospel"
                              ? "/gospel-video-player"
                              : "/video-player";

                      return (
                        <ProductCard
                          key={purchase.id}
                          imageSrc={purchase.products?.image_url || "/assets/dashboard-images/face.jpg"}
                          title={purchase.products?.title || "Untitled"}
                          subtitle={purchase.products?.instructor || ""}
                          price={`₦${purchase.products?.price?.toLocaleString() || "0"}`}
                          productId={purchase.product_id}
                          onClick={() => navigate(playerRoute, {
                            state: {
                              id: purchase.product_id,
                              image: purchase.products?.image_url || "/assets/dashboard-images/face.jpg",
                              title: purchase.products?.title || "Untitled",
                              creator: purchase.products?.instructor || "",
                              price: `₦${purchase.products?.price?.toLocaleString() || "0"}`,
                            }
                          })}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <EmptyState
                      icon={ShoppingBag}
                      title="No purchases yet"
                      description="Browse our catalog and find courses that interest you."
                    />
                    <Button
                      onClick={() => navigate("/catalogue")}
                      className="bg-brand-green hover:bg-brand-green-hover text-black font-vietnam mt-4"
                    >
                      Browse Courses
                    </Button>
                  </div>
                )}
              </section>
            )}

            {/* Saved For Later */}
            {showSaved && (
              <section className="mb-8 sm:mb-12">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-5 h-5 text-brand-green" />
                  <h2 className="text-foreground text-xl sm:text-2xl font-bold font-vietnam">
                    Saved For Later
                  </h2>
                </div>
                <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base font-vietnam">
                  Items you've saved to watch or purchase later.
                </p>
                {savedItems.length > 0 ? (
                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {savedItems.map((item) => (
                      <ProductCard
                        key={item.id}
                        id={item.id}
                        imageSrc={item.image}
                        title={item.title}
                        subtitle={item.creator}
                        price={item.price}
                        brand={item.brand}
                        onClick={() => {
                          if (item.brand === 'thc') {
                            navigate("/thc-video-player", {
                              state: {
                                id: item.id,
                                image: item.image,
                                title: item.title,
                                host: item.creator,
                                episodeCount: 1,
                                description: item.description || "",
                              }
                            });
                          } else if (item.brand === 'jsity') {
                            navigate("/jsity-course-details", {
                              state: {
                                id: item.id,
                                image: item.image,
                                title: item.title,
                                creator: item.creator,
                                price: item.price,
                                instructor: item.creator,
                                role: "Instructor"
                              }
                            });
                          } else {
                            navigate("/video-details", {
                              state: {
                                id: item.id,
                                image: item.image,
                                title: item.title,
                                creator: item.creator,
                                price: item.price
                              }
                            });
                          }
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <EmptyState
                      icon={Heart}
                      title="No saved items"
                      description="Save courses you're interested in to find them easily later."
                    />
                    <Button
                      onClick={() => navigate("/catalogue")}
                      className="bg-brand-green hover:bg-brand-green-hover text-black font-vietnam mt-4"
                    >
                      Explore Courses
                    </Button>
                  </div>
                )}
              </section>
            )}

            {/* Downloads */}
            {showDownloads && (
              <section className="mb-8 sm:mb-12">
                <div className="flex items-center gap-2 mb-2">
                  <Download className="w-5 h-5 text-brand-green" />
                  <h2 className="text-foreground text-xl sm:text-2xl font-bold font-vietnam">
                    Downloads
                  </h2>
                </div>
                <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base font-vietnam">
                  Content available for offline viewing.
                </p>
                <EmptyState
                  icon={Download}
                  title="No downloads"
                  description="Download feature coming soon. You'll be able to watch content offline."
                />
              </section>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}