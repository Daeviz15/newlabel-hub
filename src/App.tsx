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
              <Route path="/jsity-course-details" element={<JsityCourseDetails />} />

              {/* Routes for thc pages */}
              <Route path="/tdashboard" element={<Jdashboard />} />
              <Route path="/courses" element={<Jdashboard />} />
              <Route path="/about" element={<Jdashboard />} />
              <Route path="/contact" element={<Jdashboard />} />

              {/* Routes for gospel-line pages */}
              <Route path="/gdashboard" element={<Jdashboard />} />
              <Route path="/courses" element={<Jdashboard />} />
              <Route path="/about" element={<Jdashboard />} />
              <Route path="/contact" element={<Jdashboard />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
