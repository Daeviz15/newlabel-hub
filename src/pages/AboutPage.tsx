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

export default function AboutPage() {
  return (
    <main className="bg-[#0b0b0b] text-neutral-100">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <Header />
        {/* Top section: About + intro copy */}
        <section className="py-12 md:py-16 lg:py-20">
          <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2">
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
              About NewLabel
            </h1>
            <p className="max-w-prose text-sm leading-relaxed text-neutral-400 md:text-base">
              Welcome to our platform, where we are passionate about building a
              creative hub for the curious, the driven and the unapologetically
              bold. We are a growing platform where innovation meets education,
              storytelling and community – all under one roof.
            </p>
          </div>

          {/* Mission / Vision cards */}
          <div className="mt-10 grid grid-cols-1 gap-6 md:mt-12 md:grid-cols-2">
            <Card className="relative overflow-hidden rounded-xl border-2 border-lime-500/40 bg-transparent p-8 md:p-10">
              <div className="mb-6 inline-flex h-10 w-10 items-center justify-center rounded-md border border-lime-500/50 bg-lime-500/10">
                <Trophy className="h-5 w-5 text-lime-400" />
                <span className="sr-only">Mission</span>
              </div>
              <h2 className="text-2xl font-semibold md:text-3xl">
                Our Mission
              </h2>
              <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-neutral-400 md:text-base">
                At NewLabel, our mission is to empower a generation of creators,
                learners and changemakers by giving them content that inspires
                action and unlocks potential.
              </p>
            </Card>

            <Card className="relative overflow-hidden rounded-xl border-2 border-lime-500/40 bg-transparent p-8 md:p-10">
              <div className="mb-6 inline-flex h-10 w-10 items-center justify-center rounded-md border border-lime-500/50 bg-lime-500/10">
                <Trophy className="h-5 w-5 text-lime-400" />
                <span className="sr-only">Vision</span>
              </div>
              <h2 className="text-2xl font-semibold md:text-3xl">Our Vision</h2>
              <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-neutral-400 md:text-base">
                Our vision is to become a home for original content that
                educates, entertains and transforms – one experience at a time.
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
              Our commitment to excellence has led us to achieve significant
              milestones along our journey. Here are some of our notable
              achievements
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:mt-10 md:grid-cols-2">
            {/* Card 1 */}
            <div className="rounded-xl border border-neutral-800 bg-[#141414] p-6 shadow-sm md:p-7">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-lime-500/40 bg-lime-500/10">
                  <Crown className="h-5 w-5 text-lime-400" />
                  <span className="sr-only">Multi-Brand Ecosystem</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold md:text-xl">
                    Multi‑Brand Ecosystem
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                    We bring together powerful sub‑brands under one roof with a
                    clear purpose, voice and audience. From expert‑led courses
                    to engaging media and storytelling, everything connects
                    seamlessly.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-xl border border-neutral-800 bg-[#141414] p-6 shadow-sm md:p-7">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-lime-500/40 bg-lime-500/10">
                  <Sparkles className="h-5 w-5 text-lime-400" />
                  <span className="sr-only">Tailored Experiences</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold md:text-xl">
                    Tailored Experiences
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                    Whether you’re here to learn, explore or build, your journey
                    is shaped around you. The more you engage, the smarter the
                    platform becomes – offering content and opportunities that
                    match your pace and passions.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="rounded-xl border border-neutral-800 bg-[#141414] p-6 shadow-sm md:p-7">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-lime-500/40 bg-lime-500/10">
                  <MessageSquare className="h-5 w-5 text-lime-400" />
                  <span className="sr-only">Culture‑Driven</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold md:text-xl">
                    Culture‑Driven
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                    We don’t just follow trends – we reflect culture. NewLabel
                    is built for creators, learners and thinkers who care about
                    representation, relevance and real impact.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="rounded-xl border border-neutral-800 bg-[#141414] p-6 shadow-sm md:p-7">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-lime-500/40 bg-lime-500/10">
                  <ShieldCheck className="h-5 w-5 text-lime-400" />
                  <span className="sr-only">Quality‑First Content</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold md:text-xl">
                    Quality‑First Content
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                    Every class, episode and experience is designed to inform
                    and inspire – with depth, clarity and purpose. Designed to
                    deliver. Built to last.
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
                <div className="h-56 w-56 rotate-45 rounded-sm bg-lime-500/15" />
                <div className="absolute inset-6 h-auto w-auto rotate-45 bg-[#101010]" />
              </div>
            </div>

            <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[1fr_auto]">
              <div>
                <h3 className="text-2xl font-semibold leading-tight md:text-3xl lg:text-[32px]">
                  <span className="text-lime-400">Together,</span> let’s shape
                  the future of digital innovation
                </h3>
                <p className="mt-3 max-w-prose text-sm text-neutral-400 md:text-base">
                  Join us on this exciting journey where creativity meets
                  purpose.
                </p>
              </div>
              <div className="md:pt-1">
                <Button
                  className="h-10 rounded-full bg-lime-500 px-5 text-black hover:bg-lime-400 md:h-11 md:px-6"
                  aria-label="Join Now"
                >
                  Join Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Spacer above your existing footer */}
        <div className="h-6 md:h-10" />
      </div>
      <Footer />
    </main>
  );
}
