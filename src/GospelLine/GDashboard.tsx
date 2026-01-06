"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { ProductCard, TopPick } from "@/components/course-card";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "@/hooks/use-user-profile";
import { THomeHeader } from "./components/home-header";
import GFooter from "./components/GFooter";
import ChannelMetricsCarousel from "@/components/channel-metrics-carousel";
import { WeeklyTopPick } from "@/components/WeeklyTopPick";
import { BrandedSpinner } from "@/components/ui/BrandedSpinner";
import { EmptyCoursesGrid } from "@/components/ui/ContentComingSoon";

export default function GDashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { userName, userEmail, avatarUrl } = useUserProfile();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("brand", "gospeline")
        .order("created_at", { ascending: false });

      if (data) {
        setCourses(
          data.map((item) => ({
            id: item.id,
            price: `₦${item.price}`,
            title: item.title,
            subtitle: item.instructor || "Instructor",
            role: item.instructor_role || "Expert",
            image: item.image_url || "/assets/dashboard-images/face.jpg",
            description: item.description || "",
          }))
        );
      }
      setLoading(false);
    };

    fetchCourses();

    const channel = supabase
      .channel("gospel-products-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "products",
          filter: "brand=eq.gospeline",
        },
        (payload) => {
          const newItem = payload.new as any;
          setCourses((prev) => [
            {
              id: newItem.id,
              price: `₦${newItem.price}`,
              title: newItem.title,
              subtitle: newItem.instructor || "Instructor",
              role: newItem.instructor_role || "Expert",
              image: newItem.image_url || "/assets/dashboard-images/face.jpg",
              description: newItem.description || "",
            },
            ...prev,
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return "Good Morning";
    } else if (hour < 17) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const q = searchQuery.trim().toLowerCase();
  const filteredCourses = courses.filter(
    (i) =>
      i.title.toLowerCase().includes(q) || i.subtitle.toLowerCase().includes(q)
  );

  return (
    <main className="bg-[#0b0b0b] text-white min-h-screen">
      <div className="flex flex-col">
        <THomeHeader
          search={searchQuery}
          onSearchChange={setSearchQuery}
          userName={userName ?? undefined}
          userEmail={userEmail ?? undefined}
          avatarUrl={avatarUrl ?? undefined}
          onSignOut={handleSignOut}
        />

        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-8">
          <section className="py-6 sm:py-8">
            <ChannelMetricsCarousel accentColor="lime" />
          </section>

          {loading ? (
            <div className="py-20 flex justify-center">
              <BrandedSpinner size="lg" message="Loading Gospeline content..." />
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="py-20">
              <EmptyCoursesGrid message="Faith-based Gospeline content coming soon!" />
            </div>
          ) : (
            <>
              <Section
                title="What's Trending This week"
                description="Learn binge-worthy, career-building lessons from experts across tech media and business."
              >
                <CardsGrid
                  items={filteredCourses.slice(0, 4)}
                  navigate={navigate}
                />
              </Section>

              <Section
                title="New Releases"
                description="Learn binge-worthy, career-building lessons from experts across tech media and business."
              >
                <CardsGrid items={filteredCourses} navigate={navigate} />
              </Section>

              <Section
                title="Recommended For You"
                description="Learn binge-worthy, career-building lessons from experts across tech media and business."
              >
                <CardsGrid
                  items={filteredCourses.slice(0, 4)}
                  navigate={navigate}
                />
              </Section>

              <Section title="This week's top pick" description="">
                <WeeklyTopPick accent="lime" brand="gospeline" />
              </Section>
            </>
          )}

          <div className="h-16" />
        </div>
        <GFooter />
      </div>
    </main>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-6 sm:py-8">
      <div className="mb-6 space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl font-vietnam">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-zinc-400 sm:text-base">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

function CardsGrid({
  items,
  navigate,
}: {
  items: {
    id: number;
    image: string;
    title: string;
    subtitle: string;
    price: string;
    description?: string;
  }[];
  navigate: any;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((it) => (
        <ProductCard
          key={it.id}
          imageSrc={it.image}
          title={it.title}
          subtitle={it.subtitle}
          price={it.price}
          bgColor="ring-[#70E002]"
          priceAccent="thc"
          onClick={() =>
            navigate("/gospel-course-details", {
              state: {
                id: it.id.toString(),
                image: it.image,
                title: it.title,
                creator: it.subtitle,
                price: it.price,
                instructor: it.subtitle,
                description: it.description,
              },
            })
          }
        />
      ))}
    </div>
  );
}
