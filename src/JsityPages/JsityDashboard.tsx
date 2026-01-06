"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProductCard, TopPick } from "@/components/course-card";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import JsityFooter from "./components/JsityFooter";
import { WeeklyTopPick } from "@/components/WeeklyTopPick";
import { BrandedSpinner } from "@/components/ui/BrandedSpinner";
import { useUserProfile } from "@/hooks/use-user-profile";
import { JHomeHeader } from "./components/home-header";
import ChannelMetricsCarousel from "@/components/channel-metrics-carousel";
import { EmptyCoursesGrid } from "@/components/ui/ContentComingSoon";

export default function Jdashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { userName, userEmail, avatarUrl } = useUserProfile();
  const queryClient = useQueryClient();

  const { data: courses = [], isLoading: loading } = useQuery({
    queryKey: ["jsity-courses"],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .or("brand.eq.jsity,category.eq.jsity")
        .order("created_at", { ascending: false });

        return (data || []).map((course) => ({
            id: course.id,
            price: `₦${course.price}`,
            title: course.title,
            subtitle: course.instructor || "Instructor",
            role: course.instructor_role || "Expert",
            image: course.image_url || "/assets/dashboard-images/face.jpg",
            description: course.description || "",
        }));
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    const channel = supabase
      .channel("jsity-products-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "products",
        },
        (payload) => {
          const newCourse = payload.new as any;
          if (newCourse.brand === "jsity" || newCourse.category === "jsity") {
             queryClient.setQueryData(["jsity-courses"], (oldData: any[] | undefined) => {
                const newCourseFormatted = {
                    id: newCourse.id,
                    price: `₦${newCourse.price}`,
                    title: newCourse.title,
                    subtitle: newCourse.instructor || "Instructor",
                    role: newCourse.instructor_role || "Expert",
                    image: newCourse.image_url || "/assets/dashboard-images/face.jpg",
                    description: newCourse.description || "",
                };
                return oldData ? [newCourseFormatted, ...oldData] : [newCourseFormatted];
             });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

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
    (i: any) =>
      i.title.toLowerCase().includes(q) || i.subtitle.toLowerCase().includes(q)
  );

  return (
    <main className="bg-[#0b0b0b] text-white min-h-screen">
      <div className="flex flex-col">
        <JHomeHeader
          search={searchQuery}
          onSearchChange={setSearchQuery}
          userName={userName ?? undefined}
          userEmail={userEmail ?? undefined}
          avatarUrl={avatarUrl ?? undefined}
          onSignOut={handleSignOut}
        />

        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-8">
          <section className="py-6 sm:py-8">
            <ChannelMetricsCarousel accentColor="purple" />
          </section>

          {loading ? (
            <div className="py-20 flex justify-center">
              <BrandedSpinner size="lg" message="Loading courses..." />
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="py-20">
              <EmptyCoursesGrid message="No Jsity content yet - amazing courses coming soon!" />
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
                {filteredCourses.length > 0 ? (
                  <TopPick
                    accent="purple"
                    imageFit="cover"
                    title={filteredCourses[0].title}
                    author={filteredCourses[0].subtitle}
                    authorRole={filteredCourses[0].role}
                    imageSrc={filteredCourses[0].image}
                  />
                ) : null}
              </Section>
            </>
          )}

          <div className="h-16" />
        </div>
        <JsityFooter />
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

function CardsGrid({ items, navigate }: { items: any[]; navigate: any }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((it) => (
        <ProductCard
          key={it.id}
          id={it.id}
          imageSrc={it.image}
          title={it.title}
          subtitle={it.subtitle}
          price={it.price}
          bgColor="ring-purple-500"
          priceAccent="purple"
          onClick={() =>
            navigate("/jsity-course-details", {
              state: {
                id: it.id,
                image: it.image,
                title: it.title,
                creator: it.subtitle,
                price: it.price,
                instructor: it.subtitle,
                role: it.role,
                description: it.description,
              },
            })
          }
        />
      ))}
    </div>
  );
}
