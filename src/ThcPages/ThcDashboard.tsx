"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import ThcFooter from "./components/ThcFooter";
import { useUserProfile } from "@/hooks/use-user-profile";
import { THomeHeader } from "./components/home-header";
import ChannelMetricsCarousel from "@/components/channel-metrics-carousel";
import { PodcastCard } from "@/components/podcast-card";
import { EmptyCoursesGrid } from "@/components/ui/ContentComingSoon";
import { BrandedSpinner } from "@/components/ui/BrandedSpinner";
import { Mic } from "lucide-react";

interface ThcPodcastItem {
  id: string;
  title: string;
  host: string;
  episodeCount: number;
  image: string;
}

interface Product {
  id: string;
  title: string;
  instructor?: string;
  brand?: string;
  category?: string;
  image_url?: string;
}
export default function ThcPodcastDashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { userName, userEmail, avatarUrl } = useUserProfile();
  const queryClient = useQueryClient();

  const { data: podcasts = [], isLoading: loading } = useQuery({
    queryKey: ["thc-podcasts"],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .or("brand.eq.thc,category.eq.thc")
        .order("created_at", { ascending: false });

      return data ? data.map((item) => ({
        id: item.id,
        title: item.title,
        host: item.instructor || "Host",
        episodeCount: 1,
        image: item.image_url || "/assets/dashboard-images/face.jpg",
      })) : [];
    }
  });

  useEffect(() => {
    const channel = supabase
      .channel("thc-products-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "products",
        },
        (payload) => {
          const newItem = payload.new as Product;
          if (newItem.brand === "thc" || newItem.category === "thc") {
            queryClient.setQueryData(["thc-podcasts"], (oldData: any[] | undefined) => {
              const newPodcast = {
                id: newItem.id,
                title: newItem.title,
                host: newItem.instructor || "Host",
                episodeCount: 1,
                image: newItem.image_url || "/assets/dashboard-images/face.jpg",
              };
              return oldData ? [newPodcast, ...oldData] : [newPodcast];
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const q = searchQuery.trim().toLowerCase();
  const filteredPodcasts = podcasts.filter(
    (i: any) => i.title.toLowerCase().includes(q) || i.host.toLowerCase().includes(q)
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
            <ChannelMetricsCarousel accentColor="green" />
          </section>

          {loading ? (
            <div className="py-20 flex justify-center">
              <BrandedSpinner size="lg" message="Loading podcasts..." />
            </div>
          ) : filteredPodcasts.length === 0 ? (
            <div className="py-20">
              <EmptyCoursesGrid message="THC podcasts and healing sessions coming soon!" />
            </div>
          ) : (
            <>
              <Section
                title="Trending Now"
                description="Popular podcasts everyone is listening to right now."
              >
                <PodcastsGrid items={filteredPodcasts} navigate={navigate} />
              </Section>

              <Section
                title="New Episodes"
                description="The latest episode releases from your favorite shows."
              >
                <PodcastsGrid items={filteredPodcasts} navigate={navigate} />
              </Section>

              <Section
                title="Recommended For You"
                description="Personalized picks based on your listening history."
              >
                <PodcastsGrid items={filteredPodcasts} navigate={navigate} />
              </Section>
            </>
          )}

          <div className="h-16" />
        </div>
        <ThcFooter />
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

function PodcastsGrid({
  items,
  navigate,
}: {
  items: ThcPodcastItem[];
  navigate: (path: string, options?: { state?: unknown }) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((podcast) => (
        <PodcastCard
          key={podcast.id}
          id={podcast.id}
          imageSrc={podcast.image}
          title={podcast.title}
          host={podcast.host}
          episodeCount={podcast.episodeCount}
          onClick={() =>
            navigate("/thc-video-player", {
              state: {
                id: podcast.id,
                image: podcast.image,
                title: podcast.title,
                host: podcast.host,
                episodeCount: podcast.episodeCount,
              },
            })
          }
        />
      ))}
    </div>
  );
}