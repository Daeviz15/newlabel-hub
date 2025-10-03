"use client";

import Header from "../components/Header"
import Footer from "@/components/Footer";
// import CourseCard from "@/components/course-card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function CataloguePage() {
  const [activeTab, setActiveTab] = useState("for-you")

  const courses = [
    {
      image: "assets/catalogue-images/face.jpg",
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
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="md:w-1/2">
              <h1 className="text-white text-4xl font-bold mb-4">Curated Content From Your Favorite Creators</h1>
            </div>
            <div className="md:w-1/2">
              <p className="text-gray-400">
                Welcome to our online course page, where you can enhance your skills in design and development. Choose
                from our carefully curated selection of 10 courses designed to provide you with comprehensive knowledge
                and practical experience. Explore the courses below and find the perfect fit for your learning journey.
              </p>
            </div>
          </div>
        </section>

        {/* Browse by category */}
        <section className="mb-8">
          <h2 className="text-white text-2xl font-bold mb-6">Browse by category</h2>
          <div className="flex flex-wrap gap-3 mb-8">
            <Button
              variant={activeTab === "all" ? "default" : "outline"}
              onClick={() => setActiveTab("all")}
              className={
                activeTab === "all"
                  ? "bg-gray-800 text-white hover:bg-gray-700"
                  : "bg-transparent border-gray-700 text-white hover:bg-gray-800"
              }
            >
              All
            </Button>
            <Button
              variant={activeTab === "for-you" ? "default" : "outline"}
              onClick={() => setActiveTab("for-you")}
              className={
                activeTab === "for-you"
                  ? "bg-lime-400 text-black hover:bg-lime-500"
                  : "bg-transparent border-gray-700 text-white hover:bg-gray-800"
              }
            >
              For You
            </Button>
            <Button
              variant={activeTab === "trending" ? "default" : "outline"}
              onClick={() => setActiveTab("trending")}
              className={
                activeTab === "trending"
                  ? "bg-gray-800 text-white hover:bg-gray-700"
                  : "bg-transparent border-gray-700 text-white hover:bg-gray-800"
              }
            >
              Trending
            </Button>
            <Button
              variant={activeTab === "new-releases" ? "default" : "outline"}
              onClick={() => setActiveTab("new-releases")}
              className={
                activeTab === "new-releases"
                  ? "bg-gray-800 text-white hover:bg-gray-700"
                  : "bg-transparent border-gray-700 text-white hover:bg-gray-800"
              }
            >
              New Releases
            </Button>
          </div>

          {/* Course Grid */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...courses, ...courses, ...courses].map((course, index) => (
              <CourseCard key={index} {...course} />
            ))}
          </div> */}

          {/* Load More Button */}
          <div className="flex justify-center">
            <Button className="bg-gray-800 hover:bg-gray-700 text-white px-8">Load More</Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}



