import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/hooks/use-cart";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import Dashboard from "./pages/Dashboard";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { TermsnCondition } from "./pages/TermsnCondition";
import Catalogue from "./pages/Catalogue";
import NotificationsPage from "./pages/Notification";
import CartPage from "./pages/CartPage";
import VideoDetails from "./pages/VideoDetails";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/cart" element={<CartPage/>} />
            <Route path="/notification" element={<NotificationsPage />} />
            <Route path="/privacypolicypage" element={<PrivacyPolicyPage />} />
            <Route path="/termsncondition" element={<TermsnCondition />} />
            <Route path="/catalogue" element={<Catalogue />} />
            <Route path="/video-details" element={<VideoDetails />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
