import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Web3Provider } from "./contexts/Web3Context";
import { DocsThemeProvider } from "./contexts/DocsThemeContext";
import { ArmThemeProvider } from "./contexts/ArmThemeContext";
import PageTransition from "./components/PageTransition";
import SkipAgentController from "./components/SkipAgentController";
import Index from "./pages/Index";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import GameDevelopment from "./pages/GameDevelopment";
import MentorshipPrograms from "./pages/MentorshipPrograms";
import ResearchLabs from "./pages/ResearchLabs";
import Labs from "./pages/Labs";
import GameForge from "./pages/GameForge";
import Corp from "./pages/Corp";
import Foundation from "./pages/Foundation";
import Staff from "./pages/Staff";
import DevLink from "./pages/DevLink";
import DevLinkProfiles from "./pages/DevLinkProfiles";
import Nexus from "./pages/Nexus";
import Arms from "./pages/Arms";
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
import DocsLayout from "@/components/docs/DocsLayout";
import DocsOverview from "./pages/docs/DocsOverview";
import DocsTutorials from "./pages/docs/DocsTutorials";
import DocsGettingStarted from "./pages/docs/DocsGettingStarted";
import DocsPlatform from "./pages/docs/DocsPlatform";
import DocsApiReference from "./pages/docs/DocsApiReference";
import DocsCli from "./pages/docs/DocsCli";
import DocsExamples from "./pages/docs/DocsExamples";
import DocsIntegrations from "./pages/docs/DocsIntegrations";
import DocsCurriculum from "./pages/docs/DocsCurriculum";
import DocsCurriculumEthos from "./pages/docs/DocsCurriculumEthos";
import EthosGuild from "./pages/community/EthosGuild";
import TrackLibrary from "./pages/ethos/TrackLibrary";
import ArtistProfile from "./pages/ethos/ArtistProfile";
import ArtistSettings from "./pages/ethos/ArtistSettings";
import LicensingDashboard from "./pages/ethos/LicensingDashboard";
import Tutorials from "./pages/Tutorials";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Community from "./pages/Community";
import Support from "./pages/Support";
import Status from "./pages/Status";
import Changelog from "./pages/Changelog";
import DevelopersDirectory from "./pages/DevelopersDirectory";
import ProfilePassport from "./pages/ProfilePassport";
import SubdomainPassport from "./pages/SubdomainPassport";
import Profile from "./pages/Profile";
import LegacyPassportRedirect from "./pages/LegacyPassportRedirect";
import { SubdomainPassportProvider } from "./contexts/SubdomainPassportContext";
import About from "./pages/About";
import Contact from "./pages/Contact";
import GetStarted from "./pages/GetStarted";
import Careers from "./pages/Careers";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Admin from "./pages/Admin";
import Feed from "./pages/Feed";
import AdminFeed from "./pages/AdminFeed";
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
import Realms from "./pages/Realms";
import Investors from "./pages/Investors";
import NexusDashboard from "./pages/dashboards/NexusDashboard";
import FoundationDashboard from "./pages/dashboards/FoundationDashboard";
import LabsDashboard from "./pages/dashboards/LabsDashboard";
import GameForgeDashboard from "./pages/dashboards/GameForgeDashboard";
import DevLinkDashboard from "./pages/dashboards/DevLinkDashboard";
import StaffDashboard from "./pages/dashboards/StaffDashboard";
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
import { DiscordActivityProvider } from "./contexts/DiscordActivityContext";
import Activity from "./pages/Activity";
import DiscordActivity from "./pages/DiscordActivity";
import DiscordOAuthCallback from "./pages/DiscordOAuthCallback";
import RobloxCallback from "./pages/RobloxCallback";
import Web3Callback from "./pages/Web3Callback";
import DiscordVerify from "./pages/DiscordVerify";
import { Analytics } from "@vercel/analytics/react";
import CreatorDirectory from "./pages/creators/CreatorDirectory";
import CreatorProfile from "./pages/creators/CreatorProfile";
import OpportunitiesHub from "./pages/opportunities/OpportunitiesHub";
import OpportunityDetail from "./pages/opportunities/OpportunityDetail";
import OpportunityPostForm from "./pages/opportunities/OpportunityPostForm";
import MyApplications from "./pages/profile/MyApplications";
import ClientHub from "./pages/hub/ClientHub";
import ClientProjects from "./pages/hub/ClientProjects";
import ClientDashboard from "./pages/hub/ClientDashboard";
import ClientInvoices from "./pages/hub/ClientInvoices";
import ClientContracts from "./pages/hub/ClientContracts";
import ClientReports from "./pages/hub/ClientReports";
import ClientSettings from "./pages/hub/ClientSettings";
import FoundationCurriculum from "./pages/foundation/FoundationCurriculum";
import FoundationAchievements from "./pages/foundation/FoundationAchievements";
import FoundationDownloadCenter from "./pages/FoundationDownloadCenter";
import Space1Welcome from "./pages/internal-docs/Space1Welcome";
import Space1AxiomModel from "./pages/internal-docs/Space1AxiomModel";
import Space1FindYourRole from "./pages/internal-docs/Space1FindYourRole";
import Space2CodeOfConduct from "./pages/internal-docs/Space2CodeOfConduct";
import Space2Communication from "./pages/internal-docs/Space2Communication";
import Space2MeetingCadence from "./pages/internal-docs/Space2MeetingCadence";
import Space2BrandVoice from "./pages/internal-docs/Space2BrandVoice";
import Space2TechStack from "./pages/internal-docs/Space2TechStack";
import Space3FoundationGovernance from "./pages/internal-docs/Space3FoundationGovernance";
import Space3OpenSourceProtocol from "./pages/internal-docs/Space3OpenSourceProtocol";
import Space3CommunityPrograms from "./pages/internal-docs/Space3CommunityPrograms";
import Space4ProductOps from "./pages/internal-docs/Space4ProductOps";
import Space4CorpBlueprints from "./pages/internal-docs/Space4CorpBlueprints";
import Space4ClientOps from "./pages/internal-docs/Space4ClientOps";
import Space4PlatformStrategy from "./pages/internal-docs/Space4PlatformStrategy";
import Space5Onboarding from "./pages/internal-docs/Space5Onboarding";
import Space5Finance from "./pages/internal-docs/Space5Finance";
import StaffLogin from "./pages/StaffLogin";
import StaffDirectory from "./pages/StaffDirectory";
import StaffAdmin from "./pages/StaffAdmin";
import StaffChat from "./pages/StaffChat";
import StaffDocs from "./pages/StaffDocs";
import StaffAchievements from "./pages/StaffAchievements";
import StaffAnnouncements from "./pages/staff/StaffAnnouncements";
import StaffExpenseReports from "./pages/staff/StaffExpenseReports";
import StaffInternalMarketplace from "./pages/staff/StaffInternalMarketplace";
import StaffKnowledgeBase from "./pages/staff/StaffKnowledgeBase";
import StaffLearningPortal from "./pages/staff/StaffLearningPortal";
import StaffPerformanceReviews from "./pages/staff/StaffPerformanceReviews";
import StaffProjectTracking from "./pages/staff/StaffProjectTracking";
import StaffTeamHandbook from "./pages/staff/StaffTeamHandbook";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DiscordActivityProvider>
        <Web3Provider>
          <DiscordProvider>
            <TooltipProvider>
              <Toaster />
              <Analytics />
              <BrowserRouter>
                <SubdomainPassportProvider>
                  <ArmThemeProvider>
                    <SkipAgentController />
                    <PageTransition>
                      <Routes>
                        {/* Subdomain Passport (aethex.me and aethex.space) handles its own redirect if not a subdomain */}
                        <Route path="/" element={<SubdomainPassport />} />
                        <Route path="/onboarding" element={<Onboarding />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route
                          path="/dashboard/nexus"
                          element={<NexusDashboard />}
                        />
                        <Route
                          path="/dashboard/foundation"
                          element={<FoundationDashboard />}
                        />
                        <Route
                          path="/dashboard/labs"
                          element={<LabsDashboard />}
                        />
                        <Route
                          path="/dashboard/gameforge"
                          element={<GameForgeDashboard />}
                        />
                        <Route
                          path="/dashboard/dev-link"
                          element={<DevLinkDashboard />}
                        />
                        <Route
                          path="/hub/client"
                          element={
                            <RequireAccess>
                              <ClientHub />
                            </RequireAccess>
                          }
                        />
                        <Route path="/realms" element={<Realms />} />
                        <Route path="/investors" element={<Investors />} />
                        <Route path="/roadmap" element={<Roadmap />} />
                        <Route path="/trust" element={<Trust />} />
                        <Route path="/press" element={<PressKit />} />
                        <Route path="/projects" element={<Projects />} />
                        <Route
                          path="/projects/admin"
                          element={<ProjectsAdmin />}
                        />
                        <Route path="/directory" element={<Directory />} />
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/admin/feed" element={<AdminFeed />} />
                        <Route path="/admin/docs-sync" element={<DocsSync />} />
                        <Route path="/arms" element={<Arms />} />
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
                        <Route
                          path="/profile/applications"
                          element={<MyApplications />}
                        />
                        <Route
                          path="/profile/link-discord"
                          element={<DiscordVerify />}
                        />

                        {/* Foundation Community Hub - Consolidated from /developers and /community */}
                        <Route
                          path="/foundation/community"
                          element={<Community />}
                        />
                        <Route
                          path="/foundation/community/developers"
                          element={<DevelopersDirectory />}
                        />
                        <Route
                          path="/foundation/community/teams"
                          element={<FoundationTeams />}
                        />
                        <Route
                          path="/foundation/community/about"
                          element={<FoundationAbout />}
                        />
                        <Route
                          path="/foundation/community/mentorship"
                          element={<MentorshipRequest />}
                        />
                        <Route
                          path="/foundation/community/mentorship/apply"
                          element={<MentorApply />}
                        />
                        <Route
                          path="/foundation/community/mentor/:username"
                          element={<MentorProfile />}
                        />
                        <Route
                          path="/foundation/community/groups/ethos"
                          element={<EthosGuild />}
                        />

                        {/* Legacy redirects for backwards compatibility */}
                        <Route
                          path="/developers"
                          element={
                            <Navigate
                              to="/foundation/community/developers"
                              replace
                            />
                          }
                        />
                        <Route
                          path="/developers/me"
                          element={
                            <Navigate
                              to="/foundation/community/developers"
                              replace
                            />
                          }
                        />
                        <Route
                          path="/developers/:id"
                          element={
                            <Navigate
                              to="/foundation/community/developers"
                              replace
                            />
                          }
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
                        <Route
                          path="/passport/me"
                          element={<ProfilePassport />}
                        />
                        <Route
                          path="/passport/:username"
                          element={<ProfilePassport />}
                        />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignupRedirect />} />
                        <Route
                          path="/reset-password"
                          element={<ResetPassword />}
                        />
                        <Route
                          path="/roblox-callback"
                          element={<RobloxCallback />}
                        />
                        <Route
                          path="/web3-callback"
                          element={<Web3Callback />}
                        />
                        <Route
                          path="/discord-verify"
                          element={<DiscordVerify />}
                        />
                        <Route path="/activity" element={<Activity />} />
                        <Route path="/discord" element={<DiscordActivity />} />
                        <Route
                          path="/discord/callback"
                          element={<DiscordOAuthCallback />}
                        />

                        {/* Creator Network routes */}
                        <Route
                          path="/creators"
                          element={<CreatorDirectory />}
                        />
                        <Route
                          path="/creators/:username"
                          element={<CreatorProfile />}
                        />
                        <Route
                          path="/opportunities"
                          element={<OpportunitiesHub />}
                        />
                        <Route
                          path="/opportunities/post"
                          element={<OpportunityPostForm />}
                        />
                        <Route
                          path="/opportunities/:id"
                          element={<OpportunityDetail />}
                        />

                        {/* Service routes */}
                        <Route
                          path="/game-development"
                          element={<GameDevelopment />}
                        />
                        {/* Legacy redirects - consolidated into /corp */}
                        <Route
                          path="/consulting"
                          element={<Navigate to="/corp" replace />}
                        />
                        <Route
                          path="/services"
                          element={<Navigate to="/corp" replace />}
                        />

                        <Route
                          path="/mentorship"
                          element={<MentorshipPrograms />}
                        />
                        <Route path="/engage" element={<Engage />} />
                        <Route
                          path="/pricing"
                          element={<Navigate to="/engage" replace />}
                        />
                        <Route path="/research" element={<ResearchLabs />} />

                        {/* New Arm Landing Pages */}
                        <Route path="/labs" element={<Labs />} />
                        <Route
                          path="/labs/explore-research"
                          element={<LabsExploreResearch />}
                        />
                        <Route
                          path="/labs/join-team"
                          element={<LabsJoinTeam />}
                        />
                        <Route
                          path="/labs/get-involved"
                          element={<LabsGetInvolved />}
                        />

                        <Route path="/gameforge" element={<GameForge />} />
                        <Route
                          path="/gameforge/start-building"
                          element={<GameForgeStartBuilding />}
                        />
                        <Route
                          path="/gameforge/view-portfolio"
                          element={<GameForgeViewPortfolio />}
                        />
                        <Route
                          path="/gameforge/join-gameforge"
                          element={<GameForgeJoinGameForge />}
                        />

                        <Route path="/corp" element={<Corp />} />
                        <Route
                          path="/corp/schedule-consultation"
                          element={<CorpScheduleConsultation />}
                        />
                        <Route
                          path="/corp/view-case-studies"
                          element={<CorpViewCaseStudies />}
                        />
                        <Route
                          path="/corp/contact-us"
                          element={<CorpContactUs />}
                        />

                        <Route path="/foundation" element={<Foundation />} />
                        <Route
                          path="/foundation/curriculum"
                          element={<FoundationCurriculum />}
                        />
                        <Route
                          path="/foundation/achievements"
                          element={<FoundationAchievements />}
                        />
                        <Route
                          path="/foundation/contribute"
                          element={<FoundationContribute />}
                        />
                        <Route
                          path="/foundation/learn-more"
                          element={<FoundationLearnMore />}
                        />
                        <Route
                          path="/foundation/get-involved"
                          element={<FoundationGetInvolved />}
                        />
                        <Route
                          path="/foundation/downloads"
                          element={<FoundationDownloadCenter />}
                        />

                        {/* Staff Arm Routes */}
                        <Route path="/staff" element={<Staff />} />
                        <Route path="/staff/login" element={<StaffLogin />} />

                        {/* Staff Dashboard Routes */}
                        <Route
                          path="/staff/dashboard"
                          element={
                            <RequireAccess>
                              <StaffDashboard />
                            </RequireAccess>
                          }
                        />

                        {/* Staff Management Routes */}
                        <Route
                          path="/staff/directory"
                          element={
                            <RequireAccess>
                              <StaffDirectory />
                            </RequireAccess>
                          }
                        />
                        <Route
                          path="/staff/admin"
                          element={
                            <RequireAccess>
                              <StaffAdmin />
                            </RequireAccess>
                          }
                        />

                        {/* Staff Tools & Resources */}
                        <Route
                          path="/staff/chat"
                          element={
                            <RequireAccess>
                              <StaffChat />
                            </RequireAccess>
                          }
                        />
                        <Route
                          path="/staff/docs"
                          element={
                            <RequireAccess>
                              <StaffDocs />
                            </RequireAccess>
                          }
                        />
                        <Route
                          path="/staff/achievements"
                          element={
                            <RequireAccess>
                              <StaffAchievements />
                            </RequireAccess>
                          }
                        />

                        {/* Staff Admin Pages */}
                        <Route
                          path="/staff/announcements"
                          element={
                            <RequireAccess>
                              <StaffAnnouncements />
                            </RequireAccess>
                          }
                        />
                        <Route
                          path="/staff/expense-reports"
                          element={
                            <RequireAccess>
                              <StaffExpenseReports />
                            </RequireAccess>
                          }
                        />
                        <Route
                          path="/staff/marketplace"
                          element={
                            <RequireAccess>
                              <StaffInternalMarketplace />
                            </RequireAccess>
                          }
                        />
                        <Route
                          path="/staff/knowledge-base"
                          element={
                            <RequireAccess>
                              <StaffKnowledgeBase />
                            </RequireAccess>
                          }
                        />
                        <Route
                          path="/staff/learning-portal"
                          element={
                            <RequireAccess>
                              <StaffLearningPortal />
                            </RequireAccess>
                          }
                        />
                        <Route
                          path="/staff/performance-reviews"
                          element={
                            <RequireAccess>
                              <StaffPerformanceReviews />
                            </RequireAccess>
                          }
                        />
                        <Route
                          path="/staff/project-tracking"
                          element={
                            <RequireAccess>
                              <StaffProjectTracking />
                            </RequireAccess>
                          }
                        />
                        <Route
                          path="/staff/team-handbook"
                          element={
                            <RequireAccess>
                              <StaffTeamHandbook />
                            </RequireAccess>
                          }
                        />

                        {/* Dev-Link routes */}
                        <Route path="/dev-link" element={<DevLink />} />
                        <Route
                          path="/dev-link/waitlist"
                          element={<DevLinkProfiles />}
                        />

                        {/* Client Hub routes */}
                        <Route
                          path="/hub/client/dashboard"
                          element={
                            <RequireAccess>
                              <ClientDashboard />
                            </RequireAccess>
                          }
                        />
                        <Route
                          path="/hub/client/projects"
                          element={
                            <RequireAccess>
                              <ClientProjects />
                            </RequireAccess>
                          }
                        />
                        <Route
                          path="/hub/client/invoices"
                          element={
                            <RequireAccess>
                              <ClientInvoices />
                            </RequireAccess>
                          }
                        />
                        <Route
                          path="/hub/client/contracts"
                          element={
                            <RequireAccess>
                              <ClientContracts />
                            </RequireAccess>
                          }
                        />
                        <Route
                          path="/hub/client/reports"
                          element={
                            <RequireAccess>
                              <ClientReports />
                            </RequireAccess>
                          }
                        />
                        <Route
                          path="/hub/client/settings"
                          element={
                            <RequireAccess>
                              <ClientSettings />
                            </RequireAccess>
                          }
                        />

                        {/* Nexus routes */}
                        <Route path="/nexus" element={<Nexus />} />

                        {/* Resource routes */}
                        <Route
                          path="/docs"
                          element={
                            <DocsThemeProvider>
                              <DocsLayout />
                            </DocsThemeProvider>
                          }
                        >
                          <Route index element={<DocsOverview />} />
                          <Route path="tutorials" element={<DocsTutorials />} />
                          <Route
                            path="curriculum"
                            element={<DocsCurriculum />}
                          />
                          <Route
                            path="getting-started"
                            element={<DocsGettingStarted />}
                          />
                          <Route path="platform" element={<DocsPlatform />} />
                          <Route path="api" element={<DocsApiReference />} />
                          <Route path="cli" element={<DocsCli />} />
                          <Route path="examples" element={<DocsExamples />} />
                          <Route
                            path="integrations"
                            element={<DocsIntegrations />}
                          />
                        </Route>
                        <Route path="/tutorials" element={<Tutorials />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/blog/:slug" element={<BlogPost />} />

                        {/* Legacy /community redirect to /foundation/community */}
                        <Route
                          path="/community"
                          element={
                            <Navigate to="/foundation/community" replace />
                          }
                        />
                        <Route
                          path="/community/:tabId"
                          element={
                            <Navigate to="/foundation/community" replace />
                          }
                        />

                        {/* Ethos Guild Routes */}
                        <Route
                          path="/ethos/library"
                          element={<TrackLibrary />}
                        />
                        <Route
                          path="/ethos/artists/:userId"
                          element={<ArtistProfile />}
                        />
                        <Route
                          path="/ethos/settings"
                          element={<ArtistSettings />}
                        />
                        <Route
                          path="/ethos/licensing"
                          element={<LicensingDashboard />}
                        />

                        <Route path="/support" element={<Support />} />
                        <Route path="/status" element={<Status />} />
                        <Route path="/changelog" element={<Changelog />} />

                        {/* Informational routes */}
                        <Route path="/wix" element={<Wix />} />
                        <Route
                          path="/wix/case-studies"
                          element={<WixCaseStudies />}
                        />
                        <Route path="/wix/faq" element={<WixFaq />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/get-started" element={<GetStarted />} />
                        <Route path="/explore" element={<Explore />} />
                        {/* Legacy /services redirect to /corp */}
                        <Route
                          path="/services"
                          element={<Navigate to="/corp" replace />}
                        />
                        <Route path="/careers" element={<Careers />} />

                        {/* Legal routes */}
                        <Route path="/privacy" element={<Privacy />} />
                        <Route path="/terms" element={<Terms />} />

                        {/* Discord Activity route */}
                        <Route path="/activity" element={<Activity />} />

                        {/* Docs routes */}
                        <Route
                          path="/docs"
                          element={
                            <DocsLayout>
                              <DocsOverview />
                            </DocsLayout>
                          }
                        />
                        <Route
                          path="/docs/getting-started"
                          element={
                            <DocsLayout>
                              <DocsGettingStarted />
                            </DocsLayout>
                          }
                        />
                        <Route
                          path="/docs/platform"
                          element={
                            <DocsLayout>
                              <DocsPlatform />
                            </DocsLayout>
                          }
                        />
                        <Route
                          path="/docs/api"
                          element={
                            <DocsLayout>
                              <DocsApiReference />
                            </DocsLayout>
                          }
                        />
                        <Route
                          path="/docs/cli"
                          element={
                            <DocsLayout>
                              <DocsCli />
                            </DocsLayout>
                          }
                        />
                        <Route
                          path="/docs/tutorials"
                          element={
                            <DocsLayout>
                              <DocsTutorials />
                            </DocsLayout>
                          }
                        />
                        <Route
                          path="/docs/examples"
                          element={
                            <DocsLayout>
                              <DocsExamples />
                            </DocsLayout>
                          }
                        />
                        <Route
                          path="/docs/integrations"
                          element={
                            <DocsLayout>
                              <DocsIntegrations />
                            </DocsLayout>
                          }
                        />
                        <Route
                          path="/docs/curriculum"
                          element={
                            <DocsLayout>
                              <DocsCurriculum />
                            </DocsLayout>
                          }
                        />
                        <Route
                          path="/docs/curriculum/ethos"
                          element={
                            <DocsLayout>
                              <DocsCurriculumEthos />
                            </DocsLayout>
                          }
                        />

                        {/* Internal Docs Hub Routes */}
                        <Route
                          path="/internal-docs"
                          element={<Space1Welcome />}
                        />
                        <Route
                          path="/internal-docs/axiom-model"
                          element={<Space1AxiomModel />}
                        />
                        <Route
                          path="/internal-docs/find-your-role"
                          element={<Space1FindYourRole />}
                        />
                        <Route
                          path="/internal-docs/code-of-conduct"
                          element={<Space2CodeOfConduct />}
                        />
                        <Route
                          path="/internal-docs/communication"
                          element={<Space2Communication />}
                        />
                        <Route
                          path="/internal-docs/meetings"
                          element={<Space2MeetingCadence />}
                        />
                        <Route
                          path="/internal-docs/brand"
                          element={<Space2BrandVoice />}
                        />
                        <Route
                          path="/internal-docs/tech-stack"
                          element={<Space2TechStack />}
                        />
                        <Route
                          path="/internal-docs/foundation-governance"
                          element={<Space3FoundationGovernance />}
                        />
                        <Route
                          path="/internal-docs/foundation-protocol"
                          element={<Space3OpenSourceProtocol />}
                        />
                        <Route
                          path="/internal-docs/foundation-programs"
                          element={<Space3CommunityPrograms />}
                        />
                        <Route
                          path="/internal-docs/corp-product"
                          element={<Space4ProductOps />}
                        />
                        <Route
                          path="/internal-docs/corp-blueprints"
                          element={<Space4CorpBlueprints />}
                        />
                        <Route
                          path="/internal-docs/corp-clients"
                          element={<Space4ClientOps />}
                        />
                        <Route
                          path="/internal-docs/corp-platform"
                          element={<Space4PlatformStrategy />}
                        />
                        <Route
                          path="/internal-docs/onboarding"
                          element={<Space5Onboarding />}
                        />
                        <Route
                          path="/internal-docs/finance"
                          element={<Space5Finance />}
                        />

                        {/* Explicit 404 route for static hosting fallbacks */}
                        <Route path="/404" element={<FourOhFourPage />} />
                        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                        <Route path="*" element={<FourOhFourPage />} />
                      </Routes>
                    </PageTransition>
                  </ArmThemeProvider>
                </SubdomainPassportProvider>
              </BrowserRouter>
            </TooltipProvider>
          </DiscordProvider>
        </Web3Provider>
      </DiscordActivityProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
