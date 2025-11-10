import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/hooks/use-cart";
import Jdashboard from "./JsityPages/JsityDashboard";
import JsityCourses from "./JsityPages/JsityCourses";
import JsityCourseDetails from "./JsityPages/JsityCourseDetails";
import JsityVideoPlayer from "./JsityPages/JsityVideoPlayer";
import { JcartPage } from "./JsityPages/JcartPage";
import Jabout from "./JsityPages/Jabout";
import Jcheckout from "./JsityPages/Jcheckout";
import ThcDashboard from "./ThcPages/ThcDashboard";
import ThcCourses from "./ThcPages/ThcCourses";
import ThcCourseDetails from "./ThcPages/ThcCourseDetails";
import ThcVideoPlayer from "./ThcPages/ThcVideoPlayer";
import { JcartPage as ThcCartPage } from "./ThcPages/TcartPage";
import Tcheckout from "./ThcPages/Tcheckout";
import Tabout from "./ThcPages/Tabout";
import GDashboard from "./GospelLine/GDashboard";
import GCourses from "./GospelLine/GCourses";
import GCourseDetails from "./GospelLine/GcourseDetails";
import GVideoPlayer from "./GospelLine/GVideoPlayer";
import { GcartPage } from "./GospelLine/GcartPage";
import Gcheckout from "./GospelLine/Gcheckout";
import Gabout from "./GospelLine/Gabout";
import JsityAdmin from "./pages/JsityAdmin";
import { CoursesList } from "./components/admin/CoursesList";
import { CreateCourse } from "./components/admin/CreateCourse";

const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const PrivacyPolicyPageLazy = lazy(() => import("./pages/PrivacyPolicyPage"));
const TermsnConditionLazy = lazy(() => import("./pages/TermsnCondition"));
const Catalogue = lazy(() => import("./pages/Catalogue"));
const Notifications = lazy(() => import("./pages/Notifications"));
const CartPage = lazy(() =>
  import("./pages/CartPage").then((m) => ({ default: m.CartPage }))
);
const Checkout = lazy(() => import("./pages/Checkout"));
const MyLibrary = lazy(() => import("./pages/MyLibrary"));
const AccountSetting = lazy(() => import("./pages/AccountSetting"));
const VideoDetails = lazy(() => import("./pages/VideoDetails"));
const VideoPlayer = lazy(() => import("./pages/VideoPlayer"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/cartpage" element={<CartPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route
                path="/privacypolicypage"
                element={<PrivacyPolicyPageLazy />}
              />
              <Route
                path="/termsncondition"
                element={<TermsnConditionLazy />}
              />
              <Route path="/catalogue" element={<Catalogue />} />
              <Route path="/mylibrary" element={<MyLibrary />} />
              <Route path="/accountsetting" element={<AccountSetting />} />
              <Route path="/video-details" element={<VideoDetails />} />
              <Route path="/video-player" element={<VideoPlayer />} />

              {/* Routes for jsity pages */}
              <Route path="/jdashboard" element={<Jdashboard />} />
              <Route path="/jcourses" element={<JsityCourses />} />
              <Route
                path="/jsity-course-details"
                element={<JsityCourseDetails />}
              />
              <Route
                path="/jsity-video-player"
                element={<JsityVideoPlayer />}
              />
              <Route path="/jcart" element={<JcartPage />} />
              <Route path="/Jcheckout" element={<Jcheckout />} />
              <Route path="/about-jsity" element={<Jabout />} />
              <Route path="/jsity-admin" element={<JsityAdmin />} />

              {/* Routes for thc pages */}
              <Route path="/thc-dashboard" element={<ThcDashboard />} />
              <Route path="/thc-courses" element={<ThcCourses />} />
              <Route
                path="/thc-course-details"
                element={<ThcCourseDetails />}
              />
              <Route path="/thc-video-player" element={<ThcVideoPlayer />} />
              <Route path="/thc-cart" element={<ThcCartPage />} />
              <Route path="/thc-checkout" element={<Tcheckout />} />
              <Route path="/thc-about" element={<Tabout />} />

              {/* Routes for gospel-line pages */}
              <Route path="/gospel-dashboard" element={<GDashboard />} />
              <Route path="/gospel-courses" element={<GCourses />} />
              <Route
                path="/gospel-course-details"
                element={<GCourseDetails />}
              />
              <Route path="/gospel-video-player" element={<GVideoPlayer />} />
              <Route path="/gospel-cart" element={<GcartPage />} />
              <Route path="/gospel-checkout" element={<Gcheckout />} />
              <Route path="/gospel-about" element={<Gabout />} />
              {/* admin */}

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
