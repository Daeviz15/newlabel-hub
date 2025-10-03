"use client";

export default function WhyChooseUs() {
  const features = [
    {
      icon: "/assets/crown.png",
      title: "Multi-Brand Ecosystem",
      description:
        "Access content from our 3 brands and enjoy a wide range of topics, from business to lifestyle and everything in between.",
    },
    {
      icon: "/assets/medal.png",
      title: "Tailored Experience",
      description:
        "Whether you're into tech, personal growth or just want to unwind, a tailored experience awaits you on our platform.",
    },
    {
      icon: "/assets/mask.png",
      title: "Culture-Driven",
      description:
        "We're a culture-driven company focused on building community, delivering value and having fun while doing it.",
    },
    {
      icon: "/assets/flash.png",
      title: "Quality-First Content",
      description:
        "Every piece of content on our platform is carefully curated and vetted to ensure you get the best experience possible.",
    },
  ];

  return (
    <section className="px-6 py-16 max-w-7xl mx-auto">
      <div className="mb-12">
        <h2 className="text-4xl font-bold mb-2 font-vietnam">Why Choose Us?</h2>
        <p className="text-gray-400 font-vietnam">
          Our commitment to excellence has led us to achieve significant
          milestones along our journey. Here are some of our notable
          achievements
        </p>
      </div>

      <div className="grid grif-col md:grid-cols-2 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-start justify-start gap-3 bg-[#1F1F1F] rounded-lg px-10 py-6"
          >
            <div className="w-12 h-12 bg-[#DFFEBA] rounded-lg flex items-center justify-center mb-4  text-black text-xl flex-shrink-0">
              <img src={feature.icon} width={20} alt="icons" />
            </div>

            <h3 className="text-xl font-semibold mb-3 font-vietnam">
              {feature.title}
            </h3>
            <p className="text-gray-400 leading-relaxed font-vietnam">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
