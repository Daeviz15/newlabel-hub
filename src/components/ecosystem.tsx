"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpRightIcon } from '@heroicons/react/24/outline'; 


export default function Ecosystem() {
  const platforms = [
    {
      name: "Jsify",
      logoType: null,
      logoSrc: "/assets/jsity.png", // Fixed: removed /public/ - Next.js serves from public/ automatically
      description: "Learn from industry experts and enhance your skills",
      logoColor: "text-purple-400",
    },
    {
      name: "GOSPELLINE",
      logoType: null,
      logoSrc: "/assets/gospel.png", // Fixed: removed /public/
      description: "Learn from industry experts and enhance your skills",
      logoColor: "text-blue-400",
    },
    {
      name: "The House Chronicles",
      subtitle: "thC",
      logoSrc: null, // Changed from empty string to null so it's falsy
      description: "Learn from industry experts and enhance your skills",
      logoColor: "text-green-400",
    },
  ];

  return (
    <section className="px-6 py-16 max-w-7xl mx-auto">
      <div className="mb-12">
        <h2 className="text-4xl font-bold mb-4">Explore Our Ecosystem</h2>
        <p className="text-gray-400">No subscriptions. No hassle</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {platforms.map((platform, index) => (
          <div
            key={index}
            className="bg-[#1F1F1F] rounded-2xl px-8 py-12 gap-5 h-[400px] flex flex-col items-start"
          >
            {/* Display logo image if available, otherwise show platform name */}
            {platform.logoSrc ? (
              <div className="mb-4">
                {platform.subtitle && (
                  <h3
                    className={`text-sm font-medium ${platform.logoColor} mb-2`}
                  >
                    {platform.subtitle}
                  </h3>
                )}
                <img
                  src={platform.logoSrc}
                  alt={`${platform.name} logo`}
                  className="max-h-16 w-auto object-contain"
                />
              </div>
            ) : (
              <div className="mb-4">
                {platform.subtitle && (
                  <div
                    className={`text-lg font-medium ${platform.logoColor} mb-1`}
                  >
                    {platform.subtitle}
                  </div>
                )}
                <div className={`text-2xl font-bold text-white`}>
                  {platform.name}
                </div>
              </div>
            )}

            <div className="flex-grow">
              <p className="text-white text-lg leading-relaxed mb-8">
                {platform.description}
              </p>
            </div>

            <Button
              variant="outline"
              className="w-full border-[#E1FDC5] border-[1.67px] border-solid text-[#E1FDC5] hover:bg-gray-700 rounded-lg py-3 text-base font-medium"
            >
              Explore <ArrowUpRightIcon />
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
