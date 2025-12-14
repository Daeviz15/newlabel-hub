import React, { useState, useEffect } from "react";
import { ResumeCard, ProductCard } from "@/components/course-card";
import { HomeHeader } from "../components/home-header";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useUserProfile } from "@/hooks/use-user-profile";
import { Loader2, Heart, ShoppingBag, Download } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

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

export default function MyLibrary() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const { userName, userEmail, avatarUrl } = useUserProfile();
  
  const [isLoading, setIsLoading] = useState(true);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

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

  useEffect(() => {
    if (!userId) return;

    const fetchLibraryData = async () => {
      setIsLoading(true);
      try {
        // Fetch saved items with product details
        const { data: savedData, error: savedError } = await supabase
          .from("saved_items")
          .select(`
            id,
            product_id,
            products (
              id,
              title,
              image_url,
              instructor,
              price,
              brand
            )
          `)
          .eq("user_id", userId);

        if (savedError) throw savedError;
        setSavedItems((savedData as unknown as SavedItem[]) || []);

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
      } catch (error) {
        console.error("Error fetching library data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLibraryData();
  }, [userId]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleRemoveSaved = async (productId: string) => {
    if (!userId) return;
    
    const { error } = await supabase
      .from("saved_items")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", productId);

    if (!error) {
      setSavedItems(prev => prev.filter(item => item.product_id !== productId));
    }
  };

  const tabs = [
    { id: "all", label: "All" },
    { id: "purchased", label: "Purchased" },
    { id: "saved", label: "Saved" },
    { id: "downloads", label: "Downloads" },
  ];

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
        onSearchChange={() => {}}
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

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-brand-green" />
          </div>
        ) : (
          <>
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
                    {purchases.map((purchase) => (
                      <ProductCard
                        key={purchase.id}
                        imageSrc={purchase.products?.image_url || "/assets/dashboard-images/face.jpg"}
                        title={purchase.products?.title || "Untitled"}
                        subtitle={purchase.products?.instructor || ""}
                        price={`₦${purchase.products?.price?.toLocaleString() || "0"}`}
                        onClick={() => navigate(`/video/${purchase.product_id}`)}
                      />
                    ))}
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
                        imageSrc={item.products?.image_url || "/assets/dashboard-images/face.jpg"}
                        title={item.products?.title || "Untitled"}
                        subtitle={item.products?.instructor || ""}
                        price={`₦${item.products?.price?.toLocaleString() || "0"}`}
                        onClick={() => navigate(`/video-details/${item.product_id}`)}
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
