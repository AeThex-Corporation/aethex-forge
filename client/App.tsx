import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PageTransition from "./components/PageTransition";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Placeholder from "./pages/Placeholder";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PageTransition>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/onboarding" element={<Onboarding />} />

            {/* Placeholder routes for navigation links */}
            <Route path="/about" element={<Placeholder title="About AeThex" description="Learn more about our company, mission, and team." />} />
            <Route path="/contact" element={<Placeholder title="Contact Us" description="Get in touch with our team for support or inquiries." />} />
            <Route path="/login" element={<Placeholder title="Sign In" description="Access your AeThex account." />} />
            <Route path="/dashboard" element={<Placeholder title="Dashboard" description="Your personalized AeThex dashboard." />} />
            <Route path="/get-started" element={<Placeholder title="Get Started" description="Begin your journey with AeThex tools and services." />} />

            {/* Service routes */}
            <Route path="/game-development" element={<Placeholder title="Game Development" description="Custom game development services and solutions." />} />
            <Route path="/consulting" element={<Placeholder title="Development Consulting" description="Expert technical consulting for your projects." />} />
            <Route path="/mentorship" element={<Placeholder title="Mentorship Programs" description="Learn from industry experts through our mentorship programs." />} />
            <Route path="/research" element={<Placeholder title="Research & Labs" description="Access cutting-edge research and experimental projects." />} />
            <Route path="/labs" element={<Placeholder title="AeThex Labs" description="Visit our research and experimental division." />} />

            {/* Resource routes */}
            <Route path="/docs" element={<Placeholder title="Documentation" description="Comprehensive guides and API documentation." />} />
            <Route path="/blog" element={<Placeholder title="Blog" description="Latest news, insights, and updates from AeThex." />} />
            <Route path="/community" element={<Placeholder title="Community" description="Connect with other developers and innovators." />} />
            <Route path="/support" element={<Placeholder title="Support" description="Get help with AeThex products and services." />} />

            {/* Legal routes */}
            <Route path="/privacy" element={<Placeholder title="Privacy Policy" description="Our commitment to protecting your privacy." />} />
            <Route path="/terms" element={<Placeholder title="Terms of Service" description="Terms and conditions for using AeThex services." />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTransition>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
