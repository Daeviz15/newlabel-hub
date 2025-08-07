'use client'

export default function WhyChooseUs() {
  const features = [
    {
      icon: "🌐",
      title: "Multi-Brand Ecosystem",
      description: "Access content from our 3 brands and enjoy a wide range of topics, from business to lifestyle and everything in between."
    },
    {
      icon: "🎯",
      title: "Tailored Experience",
      description: "Whether you're into tech, personal growth or just want to unwind, a tailored experience awaits you on our platform."
    },
    {
      icon: "🎨",
      title: "Culture-Driven",
      description: "We're a culture-driven company focused on building community, delivering value and having fun while doing it."
    },
    {
      icon: "⚡",
      title: "Quality-First Content",
      description: "Every piece of content on our platform is carefully curated and vetted to ensure you get the best experience possible."
    }
  ]

  return (
    <section className="px-6 py-16 max-w-7xl mx-auto">
      <div className="mb-12">
        <h2 className="text-4xl font-bold mb-4">Why Choose Us?</h2>
        <p className="text-gray-400">Our commitment to excellence has led us to achieve significant milestones along our journey. Here are some of our notable achievements</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="flex space-x-4">
            <div className="w-12 h-12 bg-[#7ED321] rounded-lg flex items-center justify-center text-black text-xl flex-shrink-0">
              {feature.icon}
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
