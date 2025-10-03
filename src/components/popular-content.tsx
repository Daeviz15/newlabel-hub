"use client";

export default function PopularContent() {
  const content = [
    {
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/NewLabel%20cards-RwCTjHHDOoN5zkZrEtDhuABIVBmiHq.png",
      // price: "$18",
      // title: "The Future Of AI In Everyday Products",
      // author: "Jsify",
    },
    {
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/NewLabel%20cards%20%281%29-twaNwqHhV7wFjwFD5UuAL1JyM09Yhz.png",
      // price: "$18",
      // title: "Firm Foundation",
      // author: "NLC",
    },
    {
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/NewLabel%20cards%20%282%29-aoNzOtotGyY6wmcgyaAUn260H9UY3D.png",
      // price: "$18",
      // title: "The Silent Trauma Of Millennials",
      // author: "The House Chronicles",
    },
    {
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/NewLabel%20cards-RwCTjHHDOoN5zkZrEtDhuABIVBmiHq.png",
      // price: "$18",
      // title: "The Future Of AI In Everyday Products",
      // author: "Jsify",
    },
  ];

  return (
    <section className="px-6 py-16 max-w-7xl mx-auto">
      <div className="mb-12">
        <h2 className="text-4xl font-bold mb-2 font-poppins">
          What's Popular Right Now
        </h2>
        <p className="text-gray-400 font-inter">No subscriptions, No hassle</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {content.map((item, index) => (
          <div
            key={index}
            className="rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-transform cursor-pointer"
          >
            <div className="relative w-[250px] h-[400px]">
              <img 
                src={item.image || "/placeholder.svg?height=400&width=300"}
                alt='images'
                className="w-full h-full object-cover"
              />
       
            </div>
       
          </div>
        ))}
      </div>
    </section>
  );
}
