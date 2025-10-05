import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import Footer from "@/components/Footer";
import {HomeHeader} from "@/components/home-header";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-g#121212">
         {/* <HomeHeader search="" onSearchChange={() => {}} /> */}
        <div className="text-center">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-[120px] font-vietnam sm:text-[180px] md:text-[240px] lg:text-[300px] font-bold text-gray-600 leading-none select-none">
              404
            </h1>
          </div>
          {/* Error Message */}
          <div className="text-center mb-6 sm:mb-8 max-w-md px-4">
            <h2 className="text-2xl sm:text-3xl font-vietnam font-bold text-[#E1FDC5] mb-3 sm:mb-4">Oops! Page Not Found</h2>
            <p className="text-[#FAFFF5] font-vietnam leading[150%] text-base sm:text-lg">
              It may have been moved or deleted. Let’s get you back on track
            </p>
          </div>
           {/* Back to Home Button */}
          <Button
            className="bg-[#70E002] hover:bg-lime-500 text-[#121212] font-vietnam font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base"
            onClick={() => (window.location.href = "/")}
          >
            Back to Home
          </Button>
        </div>
      </div>
      <Footer />
    </>
  )
};

export default NotFound;
