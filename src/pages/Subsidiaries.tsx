"use client";

import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import LandingFooter from "@/components/LandingFooter";
import { Button } from "@/components/ui/button";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { MotionWrapper } from "@/components/motion-wrapper";
import { motion } from "framer-motion";

export default function Subsidiaries() {
  const navigate = useNavigate();

  const subsidiaries = [
    {
      name: "Jsity",
      logoSrc: "/assets/jsity.png",
      description:
        "Technology-focused learning platform offering courses in AI, software development, data science, and digital innovation. Learn from industry experts building the future.",
      color: "purple",
      route: "/jdashboard",
      features: ["AI & Machine Learning", "Software Development", "Data Science", "Tech Innovation"],
    },
    {
      name: "GospelLine",
      logoSrc: "/assets/gospel.png",
      description:
        "Faith-based content platform featuring inspirational teachings, spiritual growth courses, and uplifting podcasts to strengthen your journey.",
      color: "blue",
      route: "/gospel-dashboard",
      features: ["Spiritual Growth", "Biblical Studies", "Inspirational Content", "Faith Community"],
    },
    {
      name: "The House Chronicles",
      subtitle: "thC",
      logoSrc: null,
      description:
        "Lifestyle and personal development content exploring mental wellness, relationships, millennial experiences, and real-life stories that matter.",
      color: "green",
      route: "/thc-dashboard",
      features: ["Mental Wellness", "Relationships", "Life Stories", "Personal Growth"],
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "purple":
        return {
          border: "border-purple-500/30 hover:border-purple-500",
          bg: "bg-purple-500/10",
          text: "text-purple-400",
          button: "bg-purple-500 hover:bg-purple-400",
        };
      case "blue":
        return {
          border: "border-blue-500/30 hover:border-blue-500",
          bg: "bg-blue-500/10",
          text: "text-blue-400",
          button: "bg-blue-500 hover:bg-blue-400",
        };
      case "green":
      default:
        return {
          border: "border-brand-green/30 hover:border-brand-green",
          bg: "bg-brand-green/10",
          text: "text-brand-green",
          button: "bg-brand-green hover:bg-brand-green-hover",
        };
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto">
        <Header />

        {/* Hero Section */}
        <MotionWrapper variant="fadeUp">
          <div className="px-6 py-16 sm:py-20 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 font-vietnam">
              Our Subsidiaries
            </h1>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto font-inter">
              NewLabel-Hub brings together three unique platforms, each designed to
              serve different aspects of your growth and entertainment needs.
              Explore our ecosystem and find the content that speaks to you.
            </p>
          </div>
        </MotionWrapper>

        {/* Subsidiaries Grid */}
        <div className="px-6 pb-20">
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
            {subsidiaries.map((sub, index) => {
              const colors = getColorClasses(sub.color);
              return (
                <motion.div
                  key={index}
                  className={`rounded-2xl border ${colors.border} bg-[#1A1A1A] p-8 flex flex-col transition-all duration-300`}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  {/* Logo */}
                  <div className="mb-6">
                    {sub.logoSrc ? (
                      <img
                        src={sub.logoSrc}
                        alt={`${sub.name} logo`}
                        className="h-12 w-auto object-contain"
                      />
                    ) : (
                      <div>
                        {sub.subtitle && (
                          <span className={`text-sm font-medium ${colors.text}`}>
                            {sub.subtitle}
                          </span>
                        )}
                        <h3 className="text-2xl font-bold text-white">{sub.name}</h3>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 mb-6 font-vietnam flex-grow">
                    {sub.description}
                  </p>

                  {/* Features */}
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {sub.features.map((feature, i) => (
                        <span
                          key={i}
                          className={`text-xs px-3 py-1 rounded-full ${colors.bg} ${colors.text}`}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button
                    onClick={() => navigate(sub.route)}
                    className={`w-full ${colors.button} text-black font-semibold py-6`}
                  >
                    Explore {sub.name}
                    <ArrowUpRightIcon className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <LandingFooter />
    </div>
  );
}
