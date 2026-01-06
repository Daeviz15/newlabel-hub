"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HomeHeader } from "@/components/home-header";
import Footer from "@/components/Footer";
import { ProductCard } from "@/components/course-card";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile } from "@/hooks/use-user-profile";
import { Skeleton } from "@/components/ui/skeleton";
import { Gift, Sparkles } from "lucide-react";

interface Product {
  id: string;
  title: string;
  price: number;
  image_url: string | null;
  instructor: string | null;
  category: string;
  brand: string | null;
}

export default function FreeCourses() {
  const navigate = useNavigate();
  const { userName, userEmail, avatarUrl } = useUserProfile();
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  // Fetch free products (price = 0)
  useEffect(() => {
    const fetchFreeProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("id, title, price, image_url, instructor, category, brand")
        .eq("price", 0)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setProducts(data);
      }
      setLoading(false);
    };

    fetchFreeProducts();
  }, []);

  const filteredProducts = products.filter(
    (item) =>
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="py-12 sm:py-16 lg:py-20 text-center">
          <div className="inline-flex items-center bg-brand-green/20 rounded-full px-4 py-2 mb-6">
            <Gift className="w-5 h-5 text-brand-green mr-2" />
            <span className="text-brand-green font-medium">Limited Time Offer</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 font-vietnam">
            Free Courses
            <Sparkles className="inline-block w-8 h-8 ml-3 text-brand-green" />
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-vietnam">
            Start your learning journey with our collection of free courses.
            No payment required - just dive in and start learning today!
          </p>
        </div>

        <div className="w-full h-[1px] bg-[#A3A3A3]/20 mb-8" />

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 pb-12">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-40 w-full rounded-lg bg-neutral-800" />
                <Skeleton className="h-4 w-3/4 bg-neutral-800" />
                <Skeleton className="h-4 w-1/2 bg-neutral-800" />
              </div>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {!loading && (
          <div className="pb-12 sm:pb-16">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    imageSrc={
                      product.image_url || "/assets/dashboard-images/face.jpg"
                    }
                    title={product.title}
                    subtitle={product.instructor || "—"}
                    price="FREE"
                    onClick={() =>
                      navigate("/video-details", {
                        state: {
                          id: product.id,
                          image: product.image_url,
                          title: product.title,
                          creator: product.instructor,
                          price: "FREE",
                        },
                      })
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Gift className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No Free Courses Available
                </h3>
                <p className="text-gray-400 mb-6">
                  Check back soon! We're always adding new free content.
                </p>
                <button
                  onClick={() => navigate("/catalogue")}
                  className="bg-brand-green text-black font-semibold px-6 py-3 rounded-lg hover:bg-brand-green-hover transition"
                >
                  Browse All Courses
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
