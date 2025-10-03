import { HomeHeader } from "@/components/home-header";
import Footer from "@/components/Footer";
// import { CourseCard } from "@/components/course-card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function MyLibraryPage() {
  const [activeTab, setActiveTab] = useState("all")

  const courses = [
    {
      image: "/thoughtful-man-portrait.png",
      title: "The Future Of AI In Everyday Products",
      creator: "Jsify",
      creatorLogo: "/jsify-logo.jpg",
      price: "$18",
    },
    {
      image: "/typography-christ-foundation.jpg",
      title: "Firm Foundation",
      creator: "",
      creatorLogo: "/star-icon.png",
      price: "$18",
    },
    {
      image: "/woman-red-dress-office.jpg",
      title: "The Silent Trauma Of Millenials",
      creator: "The House Chronicles",
      price: "$18",
    },
    {
      image: "/thoughtful-man-portrait.png",
      title: "The Future Of AI In Everyday Products",
      creator: "Jsify",
      creatorLogo: "/jsify-logo.jpg",
      price: "$18",
    },
  ]

  return (
    <div className="min-h-screen bg-black">
      <HomeHeader  />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-white text-3xl font-bold mb-2">My Library</h1>
          <p className="text-gray-400">Find all of your saved, purchased and in-progress content here</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Button
            variant={activeTab === "all" ? "default" : "outline"}
            onClick={() => setActiveTab("all")}
            className={
              activeTab === "all"
                ? "bg-lime-400 text-black hover:bg-lime-500"
                : "bg-transparent border-gray-700 text-white hover:bg-gray-800"
            }
          >
            All
          </Button>
          <Button
            variant={activeTab === "continue-watching" ? "default" : "outline"}
            onClick={() => setActiveTab("continue-watching")}
            className={
              activeTab === "continue-watching"
                ? "bg-gray-800 text-white hover:bg-gray-700"
                : "bg-transparent border-gray-700 text-white hover:bg-gray-800"
            }
          >
            Continue Watching
          </Button>
          <Button
            variant={activeTab === "saved" ? "default" : "outline"}
            onClick={() => setActiveTab("saved")}
            className={
              activeTab === "saved"
                ? "bg-gray-800 text-white hover:bg-gray-700"
                : "bg-transparent border-gray-700 text-white hover:bg-gray-800"
            }
          >
            Saved
          </Button>
          <Button
            variant={activeTab === "downloads" ? "default" : "outline"}
            onClick={() => setActiveTab("downloads")}
            className={
              activeTab === "downloads"
                ? "bg-gray-800 text-white hover:bg-gray-700"
                : "bg-transparent border-gray-700 text-white hover:bg-gray-800"
            }
          >
            Downloads
          </Button>
        </div>

        {/* Continue Watching */}
        <section className="mb-12">
          <h2 className="text-white text-2xl font-bold mb-2">Continue Watching</h2>
          <p className="text-gray-400 mb-6">
            Learn binge-worthy, career-building lessons from experts across tech media and business.
          </p>
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course, index) => (
              <CourseCard key={`continue-${index}`} {...course} progress={72} />
            ))}
          </div> */}
        </section>

        {/* Saved For Later */}
        <section className="mb-12">
          <h2 className="text-white text-2xl font-bold mb-2">Saved For Later</h2>
          <p className="text-gray-400 mb-6">
            Learn binge-worthy, career-building lessons from experts across tech media and business.
          </p>
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course, index) => (
              <CourseCard key={`saved-${index}`} {...course} />
            ))}
          </div> */}
        </section>

        {/* Purchased */}
        <section className="mb-12">
          <h2 className="text-white text-2xl font-bold mb-2">Purchased</h2>
          <p className="text-gray-400 mb-6">
            Learn binge-worthy, career-building lessons from experts across tech media and business.
          </p>
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course, index) => (
              <CourseCard key={`purchased-${index}`} {...course} />
            ))}
          </div> */}
        </section>

        {/* Downloads */}
        <section className="mb-12">
          <h2 className="text-white text-2xl font-bold mb-2">Downloads</h2>
          <p className="text-gray-400 mb-6">
            Learn binge-worthy, career-building lessons from experts across tech media and business.
          </p>
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course, index) => (
              <CourseCard key={`downloads-${index}`} {...course} />
            ))}
          </div> */}
        </section>
      </main>
      <Footer />
    </div>
  )
}