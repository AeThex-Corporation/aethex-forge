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
import Labs from "./pages/Labs";
import GameForge from "./pages/GameForge";
import Corp from "./pages/Corp";
import Foundation from "./pages/Foundation";
import DevLink from "./pages/DevLink";
import DevLinkProfiles from "./pages/DevLinkProfiles";
import FoundationTeams from "./pages/foundation/FoundationTeams";
import FoundationAbout from "./pages/foundation/FoundationAbout";
import LabsExploreResearch from "./pages/labs/LabsExploreResearch";
import LabsJoinTeam from "./pages/labs/LabsJoinTeam";
import LabsGetInvolved from "./pages/labs/LabsGetInvolved";
import GameForgeStartBuilding from "./pages/gameforge/GameForgeStartBuilding";
import GameForgeViewPortfolio from "./pages/gameforge/GameForgeViewPortfolio";
import GameForgeJoinGameForge from "./pages/gameforge/GameForgeJoinGameForge";
import CorpScheduleConsultation from "./pages/corp/CorpScheduleConsultation";
import CorpViewCaseStudies from "./pages/corp/CorpViewCaseStudies";
import CorpContactUs from "./pages/corp/CorpContactUs";
import FoundationContribute from "./pages/foundation/FoundationContribute";
import FoundationLearnMore from "./pages/foundation/FoundationLearnMore";
import FoundationGetInvolved from "./pages/foundation/FoundationGetInvolved";
import RequireAccess from "@/components/RequireAccess";
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
import Squads from "./pages/Squads";
import MenteeHub from "./pages/MenteeHub";
import ProjectBoard from "./pages/ProjectBoard";
import { Navigate } from "react-router-dom";
import FourOhFourPage from "./pages/404";
import SignupRedirect from "./pages/SignupRedirect";
import MentorshipRequest from "./pages/community/MentorshipRequest";
import MentorApply from "./pages/community/MentorApply";
import MentorProfile from "./pages/community/MentorProfile";
import Staff from "./pages/Staff";
import Realms from "./pages/Realms";
import Investors from "./pages/Investors";
import Roadmap from "./pages/Roadmap";
import Trust from "./pages/Trust";
import PressKit from "./pages/PressKit";
import Projects from "./pages/Projects";
import ProjectsAdmin from "./pages/ProjectsAdmin";
import Directory from "./pages/Directory";
import Wix from "./pages/Wix";
import WixCaseStudies from "./pages/WixCaseStudies";
import WixFaq from "./pages/WixFaq";
import DocsSync from "./pages/DocsSync";
import { DiscordProvider } from "./contexts/DiscordContext";
import DiscordActivity from "./pages/DiscordActivity";
import DiscordOAuthCallback from "./pages/DiscordOAuthCallback";
import { Analytics } from "@vercel/analytics/react";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DiscordProvider>
        <TooltipProvider>
          <Toaster />
          <Analytics />
          <BrowserRouter>
            <SkipAgentController />
            <PageTransition>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/realms" element={<Realms />} />
                <Route path="/investors" element={<Investors />} />
                <Route path="/roadmap" element={<Roadmap />} />
                <Route path="/trust" element={<Trust />} />
                <Route path="/press" element={<PressKit />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/admin" element={<ProjectsAdmin />} />
                <Route path="/directory" element={<Directory />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/docs-sync" element={<DocsSync />} />
                <Route path="/feed" element={<Feed />} />
                <Route path="/teams" element={<Teams />} />
                <Route path="/squads" element={<Squads />} />
                <Route path="/mentee-hub" element={<MenteeHub />} />
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
                <Route
                  path="/profiles/me"
                  element={<LegacyPassportRedirect />}
                />
                <Route
                  path="/profiles/:id"
                  element={<LegacyPassportRedirect />}
                />

                <Route
                  path="/passport"
                  element={<Navigate to="/passport/me" replace />}
                />
                <Route path="/passport/me" element={<ProfilePassport />} />
                <Route
                  path="/passport/:username"
                  element={<ProfilePassport />}
                />
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

                {/* New Arm Landing Pages */}
                <Route path="/labs" element={<Labs />} />
                <Route path="/gameforge" element={<GameForge />} />
                <Route path="/corp" element={<Corp />} />
                <Route path="/foundation" element={<Foundation />} />

                {/* Dev-Link routes */}
                <Route path="/dev-link" element={<DevLink />} />
                <Route
                  path="/dev-link/waitlist"
                  element={<DevLinkProfiles />}
                />

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
                <Route path="/community/teams" element={<FoundationTeams />} />
                <Route path="/community/about" element={<FoundationAbout />} />
                <Route
                  path="/community/mentorship"
                  element={<MentorshipRequest />}
                />
                <Route
                  path="/community/mentorship/apply"
                  element={<MentorApply />}
                />
                <Route
                  path="/community/mentor/:username"
                  element={<MentorProfile />}
                />
                <Route path="/community/:tabId" element={<Community />} />
                <Route path="/staff" element={<Staff />} />
                <Route path="/support" element={<Support />} />
                <Route path="/status" element={<Status />} />
                <Route path="/changelog" element={<Changelog />} />

                {/* Informational routes */}
                <Route path="/wix" element={<Wix />} />
                <Route path="/wix/case-studies" element={<WixCaseStudies />} />
                <Route path="/wix/faq" element={<WixFaq />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/get-started" element={<GetStarted />} />
                <Route path="/opportunities" element={<Opportunities />} />
                <Route path="/explore" element={<Explore />} />

                {/* Legal routes */}
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />

                {/* Discord routes */}
                <Route path="/discord" element={<DiscordActivity />} />
                <Route
                  path="/discord/callback"
                  element={<DiscordOAuthCallback />}
                />

                {/* Explicit 404 route for static hosting fallbacks */}
                <Route path="/404" element={<FourOhFourPage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<FourOhFourPage />} />
              </Routes>
            </PageTransition>
          </BrowserRouter>
        </TooltipProvider>
      </DiscordProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
