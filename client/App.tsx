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
import GameDevelopment from "./pages/GameDevelopment";
import DevelopmentConsulting from "./pages/DevelopmentConsulting";
import MentorshipPrograms from "./pages/MentorshipPrograms";
import ResearchLabs from "./pages/ResearchLabs";
import Documentation from "./pages/Documentation";
import Blog from "./pages/Blog";
import Community from "./pages/Community";
import Support from "./pages/Support";
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
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />

            {/* Service routes */}
            <Route path="/game-development" element={<GameDevelopment />} />
            <Route path="/consulting" element={<DevelopmentConsulting />} />
            <Route path="/mentorship" element={<MentorshipPrograms />} />
            <Route path="/research" element={<ResearchLabs />} />
            <Route path="/labs" element={<ResearchLabs />} />

            {/* Resource routes */}
            <Route path="/docs" element={<Documentation />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/community" element={<Community />} />
            <Route path="/support" element={<Support />} />

            {/* Placeholder routes for navigation links */}
            <Route path="/about" element={<Placeholder title="About AeThex" description="Learn more about our company, mission, and team." />} />
            <Route path="/contact" element={<Placeholder title="Contact Us" description="Get in touch with our team for support or inquiries." />} />
            <Route path="/get-started" element={<Placeholder title="Get Started" description="Begin your journey with AeThex tools and services." />} />

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
