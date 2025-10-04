import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
export default function ContactPage() {
  return (
    <main className="bg-[#0b0b0b] text-white">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <Header />
        {/* Page heading and intro */}
        <section className="py-10 md:py-14">
          <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2">
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Contact Us
            </h1>
            <p className="max-w-prose text-xs leading-relaxed text-zinc-400 md:text-sm">
              {
                "Welcome to our platform, where we are passionate about building a creative hub for the curious, the driven and the unapologetically bold. We are a growing platform where innovation meets education, storytelling and community – all under one roof."
              }
            </p>
          </div>
          <div className="mt-6 h-px w-full bg-white/10" />
        </section>

        {/* Main panel: form (left) + contact info (right) */}
        <section className="pb-16">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#121212]">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left: Form */}
              <div className="p-6 md:p-8">
                <form className="space-y-6">
                  {/* First / Last */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label
                        htmlFor="firstName"
                        className="text-[11px] text-zinc-400"
                      >
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="Enter First Name"
                        className="h-11 rounded-lg border-white/10 bg-[#1a1a1a] placeholder:text-zinc-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="lastName"
                        className="text-[11px] text-zinc-400"
                      >
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Enter Last Name"
                        className="h-11 rounded-lg border-white/10 bg-[#1a1a1a] placeholder:text-zinc-500"
                      />
                    </div>
                  </div>

                  {/* Email / Phone */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-[11px] text-zinc-400"
                      >
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Enter your Email"
                        className="h-11 rounded-lg border-white/10 bg-[#1a1a1a] placeholder:text-zinc-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="text-[11px] text-zinc-400"
                      >
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        name="phone"
                        placeholder="Enter Phone Number"
                        className="h-11 rounded-lg border-white/10 bg-[#1a1a1a] placeholder:text-zinc-500"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="subject"
                      className="text-[11px] text-zinc-400"
                    >
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="Enter your Subject"
                      className="h-11 rounded-lg border-white/10 bg-[#1a1a1a] placeholder:text-zinc-500"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="message"
                      className="text-[11px] text-zinc-400"
                    >
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Enter your Message here..."
                      className="min-h-[140px] rounded-lg border-white/10 bg-[#1a1a1a] placeholder:text-zinc-500"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="h-11 rounded-md bg-lime-500 px-5 text-black hover:bg-lime-400"
                    aria-label="Send Your Message"
                  >
                    Send Your Message
                  </Button>
                </form>
              </div>

              {/* Right: Contact info stack with a divider */}
              <div className="border-t border-white/10 p-6 md:border-l md:border-t-0 md:p-8">
                <div className="space-y-5">
                  {/* Email card */}
                  <div className="rounded-xl border border-white/10 bg-[#161616] p-5">
                    <div className="mx-auto flex w-full max-w-[320px] flex-col items-center gap-3 text-center">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-lime-500/50 bg-lime-500/10">
                        <Mail
                          className="h-5 w-5 text-lime-400"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="text-sm text-zinc-300">
                        support@newlabel.com
                      </div>
                    </div>
                  </div>

                  {/* Phone card */}
                  <div className="rounded-xl border border-white/10 bg-[#161616] p-5">
                    <div className="mx-auto flex w-full max-w-[320px] flex-col items-center gap-3 text-center">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-lime-500/50 bg-lime-500/10">
                        <Phone
                          className="h-5 w-5 text-lime-400"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="text-sm text-zinc-300">
                        {"+91 000000 00000"}
                      </div>
                    </div>
                  </div>

                  {/* Location card */}
                  <div className="rounded-xl border border-white/10 bg-[#161616] p-5">
                    <div className="mx-auto flex w-full max-w-[320px] flex-col items-center gap-3 text-center">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-lime-500/50 bg-lime-500/10">
                        <MapPin
                          className="h-5 w-5 text-lime-400"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="text-sm text-zinc-300">
                        Some Where in the World
                      </div>
                    </div>
                  </div>

                  {/* Social Profiles card */}
                  <div className="rounded-xl border border-white/10 bg-[#161616] p-5">
                    <div className="mx-auto flex w-full max-w-[320px] flex-col items-center gap-4 text-center">
                      <div className="flex gap-2">
                        <a
                          href="#"
                          aria-label="Facebook"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[#0b0b0b] text-white ring-1 ring-white/10 hover:bg-[#0f0f0f]"
                        >
                          <Facebook className="h-4 w-4" />
                        </a>
                        <a
                          href="#"
                          aria-label="Twitter"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[#0b0b0b] text-white ring-1 ring-white/10 hover:bg-[#0f0f0f]"
                        >
                          <Twitter className="h-4 w-4" />
                        </a>
                        <a
                          href="#"
                          aria-label="LinkedIn"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-[#0b0b0b] text-white ring-1 ring-white/10 hover:bg-[#0f0f0f]"
                        >
                          <Linkedin className="h-4 w-4" />
                        </a>
                      </div>
                      <div className="text-xs text-zinc-400">
                        Social Profiles
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom spacer to match card padding rhythm */}
            <div className="hidden p-4 md:block" aria-hidden="true" />
          </div>

          {/* Spacer above your existing footer */}
          <div className="h-10" />
        </section>
      </div>
      <Footer />
    </main>
  );
}
