import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import PageTransition from "./components/PageTransition";
import SkipAgentController from "./components/SkipAgentController";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import GameDevelopment from "./pages/GameDevelopment";
import DevelopmentConsulting from "./pages/DevelopmentConsulting";
import MentorshipPrograms from "./pages/MentorshipPrograms";
import ResearchLabs from "./pages/ResearchLabs";
import Engage from "./pages/Pricing";
import DocsLayout from "./pages/DocsLayout";
import DocsOverview from "./pages/docs/DocsOverview";
import DocsTutorials from "./pages/docs/DocsTutorials";
import DocsGettingStarted from "./pages/docs/DocsGettingStarted";
import DocsPlatform from "./pages/docs/DocsPlatform";
import DocsApiReference from "./pages/docs/DocsApiReference";
import DocsCli from "./pages/docs/DocsCli";
import DocsExamples from "./pages/docs/DocsExamples";
import DocsIntegrations from "./pages/docs/DocsIntegrations";
import DocsCurriculum from "./pages/docs/DocsCurriculum";
import Tutorials from "./pages/Tutorials";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Community from "./pages/Community";
import Support from "./pages/Support";
import Status from "./pages/Status";
import Changelog from "./pages/Changelog";
import DevelopersDirectory from "./pages/DevelopersDirectory";
import ProfilePassport from "./pages/ProfilePassport";
import Profile from "./pages/Profile";
import LegacyPassportRedirect from "./pages/LegacyPassportRedirect";
import About from "./pages/About";
import Contact from "./pages/Contact";
import GetStarted from "./pages/GetStarted";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Admin from "./pages/Admin";
import Feed from "./pages/Feed";
import ProjectsNew from "./pages/ProjectsNew";
import Opportunities from "./pages/Opportunities";
import Explore from "./pages/Explore";
import ResetPassword from "./pages/ResetPassword";
import Teams from "./pages/Teams";
import ProjectBoard from "./pages/ProjectBoard";
import { Navigate } from "react-router-dom";
import FourOhFourPage from "./pages/404";
import SignupRedirect from "./pages/SignupRedirect";
import MentorshipRequest from "./pages/community/MentorshipRequest";
import MentorApply from "./pages/community/MentorApply";
import Staff from "./pages/Staff";
import Realms from "./pages/Realms";
import Investors from "./pages/Investors";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <SkipAgentController />
          <PageTransition>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/realms" element={<Realms />} />
              <Route path="/investors" element={<Investors />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/projects/new" element={<ProjectsNew />} />
              <Route
                path="/projects/:projectId/board"
                element={<ProjectBoard />}
              />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/me" element={<Profile />} />

              <Route path="/developers" element={<DevelopersDirectory />} />
              <Route
                path="/developers/me"
                element={<LegacyPassportRedirect />}
              />
              <Route
                path="/developers/:id"
                element={<LegacyPassportRedirect />}
              />
              <Route
                path="/profiles"
                element={<Navigate to="/developers" replace />}
              />
              <Route path="/profiles/me" element={<LegacyPassportRedirect />} />
              <Route
                path="/profiles/:id"
                element={<LegacyPassportRedirect />}
              />

              <Route
                path="/passport"
                element={<Navigate to="/passport/me" replace />}
              />
              <Route path="/passport/me" element={<ProfilePassport />} />
              <Route path="/passport/:username" element={<ProfilePassport />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignupRedirect />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Service routes */}
              <Route path="/game-development" element={<GameDevelopment />} />
              <Route path="/consulting" element={<DevelopmentConsulting />} />
              <Route path="/mentorship" element={<MentorshipPrograms />} />
              <Route path="/engage" element={<Engage />} />
              <Route
                path="/pricing"
                element={<Navigate to="/engage" replace />}
              />
              <Route path="/research" element={<ResearchLabs />} />
              <Route path="/labs" element={<ResearchLabs />} />

              {/* Resource routes */}
              <Route path="/docs" element={<DocsLayout />}>
                <Route index element={<DocsOverview />} />
                <Route path="tutorials" element={<DocsTutorials />} />
                <Route path="curriculum" element={<DocsCurriculum />} />
                <Route
                  path="getting-started"
                  element={<DocsGettingStarted />}
                />
                <Route path="platform" element={<DocsPlatform />} />
                <Route path="api" element={<DocsApiReference />} />
                <Route path="cli" element={<DocsCli />} />
                <Route path="examples" element={<DocsExamples />} />
                <Route path="integrations" element={<DocsIntegrations />} />
              </Route>
              <Route path="/tutorials" element={<Tutorials />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/community" element={<Community />} />
              <Route
                path="/community/mentorship"
                element={<MentorshipRequest />}
              />
              <Route
                path="/community/mentorship/apply"
                element={<MentorApply />}
              />
              <Route path="/community/:tabId" element={<Community />} />
              <Route path="/staff" element={<Staff />} />
              <Route path="/support" element={<Support />} />
              <Route path="/status" element={<Status />} />
              <Route path="/changelog" element={<Changelog />} />

              {/* Informational routes */}
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/get-started" element={<GetStarted />} />
              <Route path="/opportunities" element={<Opportunities />} />
              <Route path="/explore" element={<Explore />} />

              {/* Legal routes */}
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />

              {/* Explicit 404 route for static hosting fallbacks */}
              <Route path="/404" element={<FourOhFourPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<FourOhFourPage />} />
            </Routes>
          </PageTransition>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
