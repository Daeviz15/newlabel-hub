"use client";

export default function HowItWorks() {
  const steps = [
    {
      image: "/public/assets/create.png",
      title: "Create an account",
      description: "Sign up in seconds and unlock your personalized content.",
    },
    {
      image: "/public/assets/discover.png",
      title: "Discover your space",
      description:
        "Explore courses, podcasts and lots more tailored to your interests.",
    },
    {
      image: "/public/assets/watch.png",
      title: "Watch, learn or listen",
      description:
        "Stream on-demand content at your own pace - anytime, anywhere.",
    },
  ];

  return (
    <section className="px-6 py-16 max-w-7xl mx-auto">
      <div className="mb-12">
        <h2 className="text-4xl font-bold mb-4">How It Works</h2>
        <p className="text-gray-400">It's simple and easy. No hassle.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="text-left">
            <div className="bg-[#1F1F1F] rounded-2xl p-8 mb-6 h-80 flex items-center justify-center">
              <img
                src={step.image || "/placeholder.svg?height=200&width=300"}
                alt={step.title}
                className="max-w-full h-auto"
                width={250}
              />
            </div>
            <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
            <p className="text-gray-400 leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
