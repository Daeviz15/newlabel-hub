"use client";

export default function HowItWorks() {
  const steps = [
    {
      image: "/assets/create.png",
      title: "Create an account",
      description: "Sign up in seconds and unlock your personalized content.",
    },
    {
      image: "/assets/discover.png",
      title: "Discover your space",
      description:
        "Explore courses, podcasts and lots more tailored to your interests.",
    },
    {
      image: "/assets/watch.png",
      title: "Watch, learn or listen",
      description:
        "Stream on-demand content at your own pace - anytime, anywhere.",
    },
  ];

  return (
    <section className=" text-white px-6 py-16 max-w-7xl mx-auto">
      <div className="mb-12">
        <h2 className="text-4xl font-bold mb-2 text-white font-vietnam">How It Works</h2>
        <p className="text-gray-400 font-inter">No subscriptions, No hassle</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="text-left">
            {/* Image Container with Overlay Text */}
            <div className="bg-[#1a1a1a] rounded-2xl p-8 h-96 flex flex-col justify-between relative overflow-hidden">
              {/* Image Section - Top 2/3 */}
              <div className="flex-1 flex items-center justify-center mb-6">
                <img
                  src={step.image || "/placeholder.svg?height=200&width=300"}
                  alt={step.title}
                  className="max-w-full h-auto max-h-40 object-contain"
                  width={250}
                />
              </div>
              
              {/* Text Content - Bottom 1/3 */}
              <div className="space-y-3 relative z-10">
                <h3 className="text-xl font-semibold text-white font-inter">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm font-inter">
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}