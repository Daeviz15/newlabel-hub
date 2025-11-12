import React, { useState, useEffect } from "react";
import { ProductCard, TopPick } from "@/components/course-card";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import JsityFooter from "./components/JsityFooter";
import { useUserProfile } from "@/hooks/use-user-profile";
import { JHomeHeader } from "./components/home-header";
import ChannelMetricsCarousel from "@/components/channel-metrics-carousel";

export default function Jdashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { userName, userEmail, avatarUrl } = useUserProfile();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('category', 'jsity')
        .order('created_at', { ascending: false });
      
      if (data) {
        setCourses(data.map(course => ({
          id: course.id,
          price: `$${course.price}`,
          title: course.title,
          subtitle: course.instructor || 'Instructor',
          role: course.instructor_role || 'Expert',
          image: course.image_url || '/assets/dashboard-images/face.jpg',
        })));
      }
      setLoading(false);
    };

    fetchCourses();
  }, []);

  // Function to get time-based greeting
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
        <JHomeHeader
          search={searchQuery}
          onSearchChange={setSearchQuery}
          userName={userName ?? undefined}
          userEmail={userEmail ?? undefined}
          avatarUrl={avatarUrl ?? undefined}
          onSignOut={handleSignOut}
        />

        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-8">
          {/* Hero Carousel */}
          <section className="py-6 sm:py-8">
            <ChannelMetricsCarousel accentColor="purple" />
          </section>

          {/* What's Trending This week */}
          <Section
            title="What's Trending This week"
            description="Learn binge-worthy, career-building lessons from experts across tech media and business."
          >
            {loading ? (
              <p className="text-gray-400">Loading courses...</p>
            ) : (
              <CardsGrid items={filteredCourses.slice(0, 4)} navigate={navigate} />
            )}
          </Section>

          {/* New Releases */}
          <Section
            title="New Releases"
            description="Learn binge-worthy, career-building lessons from experts across tech media and business."
          >
            {loading ? (
              <p className="text-gray-400">Loading courses...</p>
            ) : (
              <CardsGrid items={filteredCourses} navigate={navigate} />
            )}
          </Section>

          {/* Recommended For You */}
          <Section
            title="Recommended For You"
            description="Learn binge-worthy, career-building lessons from experts across tech media and business."
          >
            {loading ? (
              <p className="text-gray-400">Loading courses...</p>
            ) : (
              <CardsGrid items={filteredCourses.slice(0, 4)} navigate={navigate} />
            )}
          </Section>

          {/* This week's top pick */}
          <Section title="This week's top pick" description="">
            <TopPick accent="purple" imageFit="cover" />
          </Section>

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

function CardsGrid({
  items,
  navigate,
}: {
  items: any[];
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
              },
            })
          }
        />
      ))}
    </div>
  );
}
