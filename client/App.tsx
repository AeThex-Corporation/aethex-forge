import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
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
import DocsLayout from "./pages/DocsLayout";
import DocsOverview from "./pages/docs/DocsOverview";
import DocsTutorials from "./pages/docs/DocsTutorials";
import Tutorials from "./pages/Tutorials";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Community from "./pages/Community";
import Support from "./pages/Support";
import Status from "./pages/Status";
import Changelog from "./pages/Changelog";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import GetStarted from "./pages/GetStarted";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Admin from "./pages/Admin";
import Feed from "./pages/Feed";
import ProjectsNew from "./pages/ProjectsNew";
import { Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <PageTransition>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/feed" element={<Feed />} />
              <Route
                path="/network"
                element={<Navigate to="/feed" replace />}
              />
              <Route path="/projects/new" element={<ProjectsNew />} />
              <Route
                path="/profile"
                element={<Navigate to="/feed" replace />}
              />
              <Route path="/login" element={<Login />} />

              {/* Service routes */}
              <Route path="/game-development" element={<GameDevelopment />} />
              <Route path="/consulting" element={<DevelopmentConsulting />} />
              <Route path="/mentorship" element={<MentorshipPrograms />} />
              <Route path="/research" element={<ResearchLabs />} />
              <Route path="/labs" element={<ResearchLabs />} />

              {/* Resource routes */}
              <Route path="/docs" element={<DocsLayout />}>
                <Route index element={<DocsOverview />} />
                <Route path="tutorials" element={<DocsTutorials />} />
                <Route path="getting-started" element={<Documentation />} />
                <Route path="api" element={<Documentation />} />
                <Route path="cli" element={<Documentation />} />
                <Route path="examples" element={<Documentation />} />
              </Route>
              <Route path="/tutorials" element={<Tutorials />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/community" element={<Community />} />
              <Route path="/support" element={<Support />} />
              <Route path="/status" element={<Status />} />
              <Route path="/changelog" element={<Changelog />} />

              {/* Informational routes */}
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/get-started" element={<GetStarted />} />

              {/* Legal routes */}
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />

              {/* Explicit 404 route for static hosting fallbacks */}
              <Route path="/404" element={<NotFound />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PageTransition>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
