import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpenCheck,
  Calculator,
  Compass,
  GraduationCap,
  Layers,
  ListChecks,
  Sparkles,
  Target,
  Timer,
} from "lucide-react";

interface CurriculumLesson {
  title: string;
  summary: string;
  format: "article" | "video" | "interactive" | "assignment";
  path: string;
  duration: string;
}

interface CurriculumModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: "foundation" | "builder" | "advanced";
  focus: string[];
  learningGoals: string[];
  lessons: CurriculumLesson[];
  capstone?: {
    title: string;
    summary: string;
    brief: string;
  };
}

const moduleLevelStyles: Record<CurriculumModule["level"], string> = {
  foundation: "bg-emerald-500/10 text-emerald-200 border-emerald-500/40",
  builder: "bg-sky-500/10 text-sky-200 border-sky-500/40",
  advanced: "bg-purple-500/10 text-purple-200 border-purple-500/40",
};

const lessonFormatCopy: Record<CurriculumLesson["format"], string> = {
  article: "Article",
  video: "Video Walkthrough",
  interactive: "Interactive Lab",
  assignment: "Hands-on Assignment",
};

const curriculumModules: CurriculumModule[] = [
  {
    id: "foundations",
    title: "AeThex Foundations",
    description:
      "Establish core mastery of the AeThex platform, from environment setup to shipping your first interactive experience.",
    duration: "2.5 hrs",
    level: "foundation",
    focus: [
      "Workspace onboarding",
      "Project scaffolding",
      "Passport + identity",
    ],
    learningGoals: [
      "Configure a production-ready AeThex project",
      "Understand AeThex Passport, identity, and role models",
      "Publish your first interactive deployment",
    ],
    lessons: [
      {
        title: "Platform Orientation",
        summary:
          "Tour the AeThex workspace, dashboards, and navigation patterns.",
        format: "video",
        path: "/docs/getting-started",
        duration: "20 min",
      },
      {
        title: "Project Blueprint Setup",
        summary:
          "Create a new AeThex project, connect Supabase, and configure environments.",
        format: "article",
        path: "/docs/getting-started#setup-workflow",
        duration: "35 min",
      },
      {
        title: "Passport Fundamentals",
        summary:
          "Implement profiles, achievements, and realm roles using AeThex Passport APIs.",
        format: "interactive",
        path: "/docs/platform#identity-and-passports",
        duration: "40 min",
      },
      {
        title: "Launch Checklist",
        summary:
          "Deploy to Netlify/Vercel and validate observability before inviting users.",
        format: "assignment",
        path: "/docs/platform#deployments",
        duration: "35 min",
      },
    ],
    capstone: {
      title: "Foundations Launch Sprint",
      summary:
        "Ship a small but complete AeThex experience showcasing authentication, feed updates, and deployment.",
      brief:
        "Assemble a two-week plan outlining features, success metrics, and deployment artifacts for stakeholders.",
    },
  },
  {
    id: "builder",
    title: "Product Builder Track",
    description:
      "Design and scale collaborative communities with AeThex real-time tooling, automations, and membership flows.",
    duration: "3 hrs",
    level: "builder",
    focus: ["Community feed", "Workflow automations", "Admin control center"],
    learningGoals: [
      "Compose a modular community feed that reacts to Supabase events",
      "Automate onboarding with roles, achievements, and curriculum progression",
      "Operate with observability dashboards and admin tooling",
    ],
    lessons: [
      {
        title: "Community Signal Architecture",
        summary:
          "Use AeThex feed primitives and Supabase realtime to orchestrate community updates.",
        format: "article",
        path: "/docs/examples#community-system",
        duration: "45 min",
      },
      {
        title: "Automation + Achievements",
        summary:
          "Award achievements, loyalty, and XP with the AeThex achievements API and workflows.",
        format: "interactive",
        path: "/docs/platform#achievements-and-xp",
        duration: "35 min",
      },
      {
        title: "Admin Command Center",
        summary:
          "Extend the AeThex admin panel with custom moderation queues and analytics.",
        format: "video",
        path: "/docs/platform#admin-suite",
        duration: "30 min",
      },
      {
        title: "Signals & Telemetry",
        summary:
          "Instrument logging, error tracking, and telemetry to monitor user health.",
        format: "article",
        path: "/docs/integrations#observability",
        duration: "30 min",
      },
    ],
    capstone: {
      title: "Community Activation Plan",
      summary:
        "Design a 30-day activation playbook tying curriculum progress to community KPIs.",
      brief:
        "Deliver a Notion or Builder CMS doc with milestones, safety checks, and escalation paths.",
    },
  },
  {
    id: "advanced",
    title: "Advanced Ops & Ecosystems",
    description:
      "Engineer large-scale AeThex deployments that blend AI-guided creation, marketplace integrations, and monetization.",
    duration: "3.5 hrs",
    level: "advanced",
    focus: ["AI pipelines", "Marketplace", "Monetization"],
    learningGoals: [
      "Compose AI assistive flows with AeThex Labs tooling",
      "Integrate third-party marketplaces and billing systems",
      "Secure and monitor enterprise-grade deployments",
    ],
    lessons: [
      {
        title: "AI Studio Workflows",
        summary:
          "Orchestrate AI-assisted creation using AeThex Labs pipelines and guardrails.",
        format: "interactive",
        path: "/docs/labs",
        duration: "50 min",
      },
      {
        title: "Marketplace + Billing",
        summary:
          "Connect Neon/Postgres data, Stripe monetization, and Zapier automations.",
        format: "article",
        path: "/docs/integrations#billing-automation",
        duration: "40 min",
      },
      {
        title: "Enterprise Security Patterns",
        summary:
          "Apply RBAC, audit trails, and secret rotation with AeThex security primitives.",
        format: "video",
        path: "/docs/platform#security",
        duration: "35 min",
      },
      {
        title: "Reliability Playbooks",
        summary:
          "Craft on-call runbooks tied to AeThex Status, SLO monitors, and incident response.",
        format: "assignment",
        path: "/docs/status",
        duration: "40 min",
      },
    ],
    capstone: {
      title: "Ecosystem Expansion Brief",
      summary:
        "Design a new revenue program connecting creators, partners, and automation pipelines.",
      brief:
        "Submit a partner enablement checklist, monetization targets, and KPI dashboards in AeThex.",
    },
  },
];

const curriculumHighlights = [
  {
    title: "Structured tracks",
    description: "Modular progression from foundations to advanced operations.",
    icon: Layers,
  },
  {
    title: "Project-based milestones",
    description:
      "Each module culminates in a capstone aligned to AeThex deliverables.",
    icon: Target,
  },
  {
    title: "Built with real data",
    description:
      "Lessons reference live dashboards, Passport identities, and Supabase schemas.",
    icon: Sparkles,
  },
];

const curriculumStats = [
  {
    label: "Total guided time",
    value: "9 hrs",
    icon: Timer,
  },
  {
    label: "Capstone projects",
    value: "3",
    icon: ListChecks,
  },
  {
    label: "Certifications unlocked",
    value: "AeThex Builder, Operator",
    icon: GraduationCap,
  },
];

const supplementalResources = [
  {
    title: "AeThex Playbooks",
    description:
      "Download ready-made GTM, community, and growth playbooks to complement each module.",
    cta: "Browse playbooks",
    href: "/docs/examples#playbooks",
  },
  {
    title: "Live Mentorship Sessions",
    description:
      "Join weekly office hours with AeThex engineers and producers to review your progress.",
    cta: "Reserve a seat",
    href: "/mentorship",
  },
  {
    title: "Certification Exams",
    description:
      "Validate mastery with AeThex Builder and Operator certifications once you finish the track.",
    cta: "View certification guide",
    href: "/docs/platform#certification",
  },
];

export default function DocsCurriculum() {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-slate-800/60 bg-slate-900/80 p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.2),transparent_60%)]" />
        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <Badge className="w-fit bg-purple-600/80 text-white">
              AeThex Curriculum
            </Badge>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">
              Structured learning paths for builders, operators, and labs teams
            </h1>
            <p className="max-w-3xl text-base text-slate-200 sm:text-lg">
              Progress through sequenced modules that combine documentation,
              interactive labs, and project-based assignments. Graduate with
              deployment-ready AeThex experiences and certification badges.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {curriculumStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={stat.label}
                  className="border-slate-800 bg-slate-900/70 shadow-lg backdrop-blur"
                >
                  <CardHeader className="flex flex-row items-center gap-3 pb-2">
                    <span className="rounded-full bg-purple-500/10 p-2 text-purple-200">
                      <Icon className="h-5 w-5" />
                    </span>
                    <CardTitle className="text-slate-100 text-lg">
                      {stat.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 text-2xl font-semibold text-white">
                    {stat.value}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
        <Card className="border-slate-800 bg-slate-900/70 shadow-xl backdrop-blur">
          <CardHeader className="space-y-4">
            <CardTitle className="flex items-center gap-3 text-2xl text-white">
              <Compass className="h-6 w-6 text-purple-300" /> Curriculum roadmap
            </CardTitle>
            <CardDescription className="text-slate-300">
              Expand each module to view lessons, formats, and key objectives.
              Every module ends with a capstone milestone that prepares you for
              certification.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Accordion type="single" collapsible className="space-y-3">
              {curriculumModules.map((module) => (
                <AccordionItem
                  key={module.id}
                  value={module.id}
                  className="overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-950/70"
                >
                  <AccordionTrigger className="px-5 py-4 text-left hover:no-underline data-[state=open]:bg-slate-900/70">
                    <div className="flex w-full flex-col gap-2 text-left">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant="outline"
                          className={moduleLevelStyles[module.level]}
                        >
                          {module.level === "foundation"
                            ? "Foundation"
                            : module.level === "builder"
                              ? "Builder"
                              : "Advanced"}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-slate-700/60 bg-slate-900/70 text-slate-200"
                        >
                          {module.duration}
                        </Badge>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white sm:text-xl">
                          {module.title}
                        </h3>
                        <p className="text-sm text-slate-300">
                          {module.description}
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-6 pt-2">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
                          Learning focus
                        </h4>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {module.focus.map((focusItem) => (
                            <Badge
                              key={focusItem}
                              variant="outline"
                              className="border-slate-700/60 bg-slate-900/60 text-xs text-slate-200"
                            >
                              {focusItem}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-4">
                        <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
                          Lesson sequence
                        </h4>
                        <div className="mt-3 space-y-3">
                          {module.lessons.map((lesson, index) => (
                            <div
                              key={lesson.title}
                              className="rounded-xl border border-slate-800/60 bg-slate-950/80 p-4"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                  <p className="text-xs uppercase text-slate-400">
                                    Lesson {index + 1}
                                  </p>
                                  <h5 className="text-base font-semibold text-white">
                                    {lesson.title}
                                  </h5>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-300">
                                  <Badge
                                    variant="outline"
                                    className="border-slate-700/60 bg-slate-900/60 text-xs"
                                  >
                                    {lessonFormatCopy[lesson.format]}
                                  </Badge>
                                  <span>{lesson.duration}</span>
                                </div>
                              </div>
                              <p className="mt-2 text-sm text-slate-300">
                                {lesson.summary}
                              </p>
                              <Button
                                asChild
                                variant="ghost"
                                className="mt-3 h-8 w-fit gap-2 rounded-full border border-slate-800/60 bg-slate-900/50 px-3 text-xs text-slate-200 hover:border-purple-500/50 hover:text-white"
                              >
                                <Link to={lesson.path}>
                                  Review lesson{" "}
                                  <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-purple-500/30 bg-purple-500/10 p-4">
                        <h4 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-purple-100">
                          <Sparkles className="h-4 w-4" /> Capstone challenge
                        </h4>
                        {module.capstone ? (
                          <div className="mt-2 space-y-2">
                            <p className="text-base font-semibold text-white">
                              {module.capstone.title}
                            </p>
                            <p className="text-sm text-purple-100/80">
                              {module.capstone.summary}
                            </p>
                            <p className="text-xs text-purple-200/80">
                              {module.capstone.brief}
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm text-purple-100/80">
                            Coming soon — the AeThex team is curating the next
                            advanced mission.
                          </p>
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-slate-800 bg-slate-900/70 shadow-xl">
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl text-white">
                Why this curriculum works
              </CardTitle>
              <CardDescription className="text-slate-300">
                Blending documentation, live labs, and project work keeps teams
                aligned and measurable.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {curriculumHighlights.map((highlight) => {
                const Icon = highlight.icon;
                return (
                  <div
                    key={highlight.title}
                    className="flex items-start gap-3 rounded-2xl border border-slate-800/60 bg-slate-950/70 p-4"
                  >
                    <span className="rounded-lg bg-slate-900/80 p-2 text-purple-200">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-white">
                        {highlight.title}
                      </p>
                      <p className="text-sm text-slate-300">
                        {highlight.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/70 shadow-xl">
            <CardHeader className="space-y-2">
              <CardTitle className="flex items-center gap-2 text-xl text-white">
                <BookOpenCheck className="h-5 w-5 text-purple-300" />{" "}
                Supplemental resources
              </CardTitle>
              <CardDescription className="text-slate-300">
                Extend the curriculum with live mentorship, playbooks, and
                certification tracks.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {supplementalResources.map((resource) => (
                <div
                  key={resource.title}
                  className="space-y-2 rounded-2xl border border-slate-800/60 bg-slate-950/70 p-4"
                >
                  <p className="text-sm font-semibold text-white">
                    {resource.title}
                  </p>
                  <p className="text-sm text-slate-300">
                    {resource.description}
                  </p>
                  <Button
                    asChild
                    variant="ghost"
                    className="h-8 w-fit gap-2 rounded-full border border-slate-800/60 bg-slate-900/60 px-3 text-xs text-slate-200 hover:border-purple-500/50 hover:text-white"
                  >
                    <Link to={resource.href}>
                      {resource.cta} <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/70 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl text-white">
                Team readiness checklist
              </CardTitle>
              <CardDescription className="text-slate-300">
                Confirm prerequisites before starting the Builder or Advanced
                tracks.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 rounded-2xl border border-slate-800/60 bg-slate-950/70 p-4">
                <Calculator className="mt-1 h-5 w-5 text-purple-200" />
                <div>
                  <p className="text-sm font-semibold text-white">
                    Account + billing configured
                  </p>
                  <p className="text-sm text-slate-300">
                    Ensure Supabase, billing providers, and environment
                    variables are ready for production load.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-slate-800/60 bg-slate-950/70 p-4">
                <Sparkles className="mt-1 h-5 w-5 text-purple-200" />
                <div>
                  <p className="text-sm font-semibold text-white">
                    Core team enrolled
                  </p>
                  <p className="text-sm text-slate-300">
                    Identify product, engineering, and operations owners to
                    steward each module.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-slate-800/60 bg-slate-950/70 p-4">
                <Layers className="mt-1 h-5 w-5 text-purple-200" />
                <div>
                  <p className="text-sm font-semibold text-white">
                    Backlog aligned to modules
                  </p>
                  <p className="text-sm text-slate-300">
                    Map existing sprints to module milestones so curriculum
                    progress mirrors roadmap delivery.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="border-slate-800/70" />

      <section className="rounded-3xl border border-slate-800/60 bg-slate-900/70 p-8 text-center">
        <h2 className="text-2xl font-semibold text-white">
          Ready to certify your AeThex team?
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-300">
          Track your completion inside the AeThex admin panel, then schedule a
          certification review with the AeThex Labs crew. We award badges
          directly to your Passport once requirements are verified.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button
            asChild
            className="gap-2 rounded-full bg-purple-600 text-white hover:bg-purple-500"
          >
            <Link to="/mentorship">
              Join mentorship cohort <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="gap-2 rounded-full border-purple-500/60 text-purple-100 hover:bg-purple-500/10"
          >
            <Link to="/docs/platform#certification">
              View certification rubric <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
