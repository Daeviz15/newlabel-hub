import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/hooks/use-cart";
import { PageLoader } from "@/components/ui/BrandedSpinner";
import Jdashboard from "./JsityPages/JsityDashboard";
import JsityCourses from "./JsityPages/JsityCourses";
import JsityCourseDetails from "./JsityPages/JsityCourseDetails";
import JsityVideoPlayer from "./JsityPages/JsityVideoPlayer";
import Jabout from "./JsityPages/Jabout";
import Jcheckout from "./JsityPages/Jcheckout";
import ThcDashboard from "./ThcPages/ThcDashboard";
import ThcCourses from "./ThcPages/ThcCourses";
import ThcVideoPlayer from "./ThcPages/ThcVideoPlayer";
import ThcDonate from "./ThcPages/ThcDonate";
import Tcheckout from "./ThcPages/Tcheckout";
import Tabout from "./ThcPages/Tabout";
import GDashboard from "./GospelLine/GDashboard";
import GCourses from "./GospelLine/GCourses";
import GCourseDetails from "./GospelLine/GcourseDetails";
import GVideoPlayer from "./GospelLine/GVideoPlayer";
import Gcheckout from "./GospelLine/Gcheckout";
import Gabout from "./GospelLine/Gabout";
import { JcartPage } from "./JsityPages/JcartPage";
import { TcartPage } from "./ThcPages/TcartPage";
import { GcartPage } from "./GospelLine/GcartPage";
import JsityAdmin from "./pages/JsityAdmin";
import { CoursesList } from "./components/admin/CoursesList";
import { CreateCourse } from "./components/admin/CreateCourse";
import { CreatePodcast } from "./components/admin/CreatePodcast";
import { PodcastList } from "./components/admin/PodcastList";
import { AnalyticsDashboard } from "./components/admin/AnalyticsDashboard";
import AdminLogin from "./pages/AdminLogin";
import { AdminGuard } from "./components/auth/AdminGuard";

const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
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
const FreeCourses = lazy(() => import("./pages/FreeCourses"));
const Subsidiaries = lazy(() => import("./pages/Subsidiaries"));
const NotFoundPage = lazy(() => import("./pages/404Page"));

const queryClient = new QueryClient();

import { PageTransitionLayout } from "@/components/layout/PageTransitionLayout";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<PageTransitionLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
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
              <Route path="/free-courses" element={<FreeCourses />} />
              <Route path="/subsidiaries" element={<Subsidiaries />} />

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
              <Route path="/jabout" element={<Jabout />} />
              <Route path="/jcheckout" element={<Jcheckout />} />
              <Route path="/jcart" element={<JcartPage />} />

              {/* Routes for Thc pages */}
              <Route path="/thcdashboard" element={<ThcDashboard />} />
              <Route path="/thc-dashboard" element={<ThcDashboard />} />
              <Route path="/thccourses" element={<ThcCourses />} />
              <Route path="/thc-courses" element={<ThcCourses />} />
              <Route path="/thc-donate" element={<ThcDonate />} />
              <Route path="/thc-video-player" element={<ThcVideoPlayer />} />
              <Route path="/tcheckout" element={<Tcheckout />} />
              <Route path="/tabout" element={<Tabout />} />
              <Route path="/tcart" element={<TcartPage />} />
              <Route path="/thc-cart" element={<TcartPage />} />

              {/* Routes for GospelLine pages */}
              <Route path="/gdashboard" element={<GDashboard />} />
              <Route path="/gospel-dashboard" element={<GDashboard />} />
              <Route path="/gcourses" element={<GCourses />} />
              <Route path="/gospel-courses" element={<GCourses />} />
              <Route
                path="/gospelline-course-details"
                element={<GCourseDetails />}
              />
              <Route
                path="/gospelline-video-player"
                element={<GVideoPlayer />}
              />
              <Route path="/gcheckout" element={<Gcheckout />} />
              <Route path="/gabout" element={<Gabout />} />
              <Route path="/gcart" element={<GcartPage />} />
              <Route path="/gospel-cart" element={<GcartPage />} />

              {/* Admin Routes */}
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/jsityadmin" element={<AdminGuard><JsityAdmin /></AdminGuard>} />
              <Route path="/admin/courses" element={<AdminGuard><CoursesList /></AdminGuard>} />
              <Route path="/admin/create-course" element={<AdminGuard><CreateCourse /></AdminGuard>} />
              <Route path="/admin/create-podcast" element={<AdminGuard><CreatePodcast /></AdminGuard>} />
              <Route path="/admin/podcasts" element={<AdminGuard><PodcastList /></AdminGuard>} />
              <Route path="/admin/analytics" element={<AdminGuard><AnalyticsDashboard /></AdminGuard>} />

              <Route path="*" element={<NotFoundPage />} />
              <Route path="/404" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
