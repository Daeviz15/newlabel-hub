import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  Crown,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { JHomeHeader } from "./components/home-header";
import { useState } from "react";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import JsityFooter from "./components/JsityFooter";

export default function Jabout() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("For You");
  const { userName, userEmail, avatarUrl } = useUserProfile();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <main className="bg-[#0b0b0b] text-neutral-100">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <JHomeHeader
          search={searchQuery}
          onSearchChange={setSearchQuery}
          userName={userName ?? undefined}
          userEmail={userEmail ?? undefined}
          avatarUrl={avatarUrl ?? undefined}
          onSignOut={handleSignOut}
        />
        <section className="py-12 md:py-16 lg:py-20">
          <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2">
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
              About Jsity
            </h1>
            <p className="max-w-prose text-sm leading-relaxed text-neutral-400 md:text-base">
              Welcome to Jsity, a proud channel under NewLabel. We are dedicated
              to empowering learners through expertly crafted digital courses.
              As part of the NewLabel ecosystem, we bring together innovation,
              education and community to help you unlock your full potential.
            </p>
          </div>

          {/* Mission / Vision cards */}
          <div className="mt-10 grid grid-cols-1 gap-6 md:mt-12 md:grid-cols-2">
            <Card className="relative overflow-hidden rounded-xl border-2 border-purple-500/40 bg-transparent p-8 md:p-10">
              <div className="mb-6 inline-flex h-10 w-10 items-center justify-center rounded-md border border-purple-500/50 bg-purple-500/10">
                <Trophy className="h-5 w-5 text-purple-400" />
                <span className="sr-only">Mission</span>
              </div>
              <h2 className="text-2xl font-semibold md:text-3xl">
                Our Mission
              </h2>
              <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-neutral-400 md:text-base">
                At Jsity, our mission is to democratize quality education by
                providing accessible, expert-led digital courses that empower
                individuals to master new skills, advance their careers and
                achieve their personal goals.
              </p>
            </Card>

            <Card className="relative overflow-hidden rounded-xl border-2 border-purple-500/40 bg-transparent p-8 md:p-10">
              <div className="mb-6 inline-flex h-10 w-10 items-center justify-center rounded-md border border-purple-500/50 bg-purple-500/10">
                <Trophy className="h-5 w-5 text-purple-400" />
                <span className="sr-only">Vision</span>
              </div>
              <h2 className="text-2xl font-semibold md:text-3xl">Our Vision</h2>
              <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-neutral-400 md:text-base">
                Our vision is to become the leading destination for digital
                learning, where every course transforms knowledge into action
                and every learner discovers their path to success.
              </p>
            </Card>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-10 md:py-14 lg:py-16">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Why Choose Us?
            </h2>
            <p className="max-w-2xl text-sm text-neutral-400 md:text-base">
              As a channel under NewLabel, we leverage cutting-edge technology
              and industry expertise to deliver exceptional learning
              experiences. Here's what sets us apart
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:mt-10 md:grid-cols-2">
            {/* Card 1 */}
            <div className="rounded-xl border border-neutral-800 bg-[#141414] p-6 shadow-sm md:p-7">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-purple-500/40 bg-purple-500/10">
                  <Crown className="h-5 w-5 text-purple-400" />
                  <span className="sr-only">Expert-Led Courses</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold md:text-xl">
                    Expert‑Led Courses
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                    Learn from industry professionals and subject matter experts
                    who bring real-world experience to every lesson. Our courses
                    are designed by practitioners who understand what it takes
                    to succeed in today's competitive landscape.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-xl border border-neutral-800 bg-[#141414] p-6 shadow-sm md:p-7">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-purple-500/40 bg-purple-500/10">
                  <Sparkles className="h-5 w-5 text-purple-400" />
                  <span className="sr-only">Personalized Learning Paths</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold md:text-xl">
                    Personalized Learning Paths
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                    Your learning journey is unique to you. Our platform adapts
                    to your pace, interests and goals, recommending courses and
                    resources that align with your aspirations. The more you
                    learn, the smarter your experience becomes.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="rounded-xl border border-neutral-800 bg-[#141414] p-6 shadow-sm md:p-7">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-purple-500/40 bg-purple-500/10">
                  <MessageSquare className="h-5 w-5 text-purple-400" />
                  <span className="sr-only">Practical & Actionable</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold md:text-xl">
                    Practical & Actionable
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                    We focus on courses that deliver tangible results. Every
                    lesson is designed to be practical, actionable and
                    immediately applicable to real-world scenarios. Learn skills
                    you can use today, not just theory for tomorrow.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="rounded-xl border border-neutral-800 bg-[#141414] p-6 shadow-sm md:p-7">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-purple-500/40 bg-purple-500/10">
                  <ShieldCheck className="h-5 w-5 text-purple-400" />
                  <span className="sr-only">Premium Quality Content</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold md:text-xl">
                    Premium Quality Content
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                    Every course is meticulously crafted with high production
                    value, clear instruction and comprehensive materials. From
                    video lessons to downloadable resources, we ensure you have
                    everything needed to succeed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA banner */}
        <section className="py-10 md:py-14 lg:py-16">
          <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-[#101010] p-7 md:p-10">
            {/* Decorative geometric accent (top-right) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 md:block lg:right-8"
            >
              <div className="relative">
                <div className="h-56 w-56 rotate-45 rounded-sm bg-purple-500/15" />
                <div className="absolute inset-6 h-auto w-auto rotate-45 bg-[#101010]" />
              </div>
            </div>

            <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[1fr_auto]">
              <div>
                <h3 className="text-2xl font-semibold leading-tight md:text-3xl lg:text-[32px]">
                  <span className="text-purple-400">Ready to learn?</span> Start
                  your journey with Jsity today
                </h3>
                <p className="mt-3 max-w-prose text-sm text-neutral-400 md:text-base">
                  Join thousands of learners who are already transforming their
                  skills and careers with our expert-led courses.
                </p>
              </div>
              <div className="md:pt-1">
                <Button
                  className="h-10 rounded-full bg-purple-500 px-5 text-black hover:bg-purple-400 md:h-11 md:px-6"
                  aria-label="Explore Courses"
                >
                  Explore Courses
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Spacer above your existing footer */}
        <div className="h-6 md:h-10" />
      </div>
      <JsityFooter />
    </main>
  );
}
