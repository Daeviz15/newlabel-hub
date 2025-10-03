import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
// import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
// import ServerError from "./pages/ServerError";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import Dashboard from "./pages/Dashboard";
import CartPage from "./pages/CartPage";
import MyLibraryPage from "./pages/MyLibraryPage";
import {PrivacyPolicyPage} from "./pages/PrivacyPolicyPage";
import {TermsnCondition} from "./pages/TermsnCondition";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
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
          <Route path="/cart" element={<CartPage />} />
          <Route path="/mylibrarypage" element={<MyLibraryPage />} />
          <Route path="/privacypolicypage" element={<PrivacyPolicyPage />} />
          <Route path="/termsncondition" element={<TermsnCondition />} />
          {/* <Route path="/servererror" element={<ServerError />} /> */}


          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

