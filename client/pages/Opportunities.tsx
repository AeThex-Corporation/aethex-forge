import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAethexToast } from "@/hooks/use-aethex-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  aethexApplicationService,
  type AethexApplicationSubmission,
} from "@/lib/aethex-database-adapter";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Clock,
  Sparkles,
  Loader2,
  Rocket,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

interface ContributorFormState {
  fullName: string;
  email: string;
  location: string;
  primarySkill: string;
  availability: string;
  portfolioUrl: string;
  interests: string[];
  message: string;
}

interface CareerFormState {
  fullName: string;
  email: string;
  location: string;
  roleInterest: string;
  experienceLevel: string;
  portfolioUrl: string;
  resumeUrl: string;
  message: string;
}

const contributorInterestOptions = [
  "Open Source Systems",
  "Education & Curriculum",
  "Community Programs",
  "Design Systems",
  "Docs & Technical Writing",
  "Research & Experiments",
  "Developer Tooling",
];

const contributorAvailabilityOptions = [
  "1-5 hours / week",
  "5-10 hours / week",
  "10-20 hours / week",
  "Full-time contributor",
];

const contributorPrimarySkills = [
  "Frontend Engineering",
  "Backend Engineering",
  "Full-stack Engineering",
  "Game Development",
  "Product Design",
  "Technical Writing",
  "Community Building",
  "Operations & Program Management",
];

const careerRoleOptions = [
  "Software Engineer",
  "Game Designer",
  "Product Manager",
  "Developer Advocate",
  "Technical Writer",
  "Community Manager",
  "Creative Producer",
  "Research Scientist",
];

const careerExperienceLevels = [
  "Emerging (0-2 years)",
  "Intermediate (3-5 years)",
  "Senior (6-9 years)",
  "Staff & Principal (10+ years)",
];

const openOpportunities = [
  {
    title: "Senior Gameplay Engineer",
    type: "Full-time · Remote",
    summary:
      "Shape immersive gameplay experiences across AeThex Labs and partner studios.",
    tags: ["Unreal", "C++", "Multiplayer", "Systems"],
  },
  {
    title: "Developer Experience Lead",
    type: "Full-time · Hybrid",
    summary:
      "Own the contributor journey, from onboarding to high-impact delivery.",
    tags: ["DX", "Community", "Strategy"],
  },
  {
    title: "Product Storyteller",
    type: "Contract · Remote",
    summary:
      "Craft compelling narratives, docs, and launch campaigns for AeThex platforms.",
    tags: ["Content", "Docs", "Product"],
  },
];

const applicationMilestones = [
  {
    icon: Users,
    title: "Connect",
    description:
      "Share your background, interests, and the kind of problems you want to help solve.",
  },
  {
    icon: Rocket,
    title: "Collaborate",
    description:
      "Chat with our team, explore active initiatives, and scope out your first project or role.",
  },
  {
    icon: ShieldCheck,
    title: "Launch",
    description:
      "Join a cross-functional squad, ship impact in your first 30 days, and grow with AeThex.",
  },
];

const faqs = [
  {
    question: "How quickly will I hear back after applying?",
    answer:
      "We review contributor and career applications every week. Expect a response within 7-10 days, often sooner if new initiatives are staffing up.",
  },
  {
    question: "Can I apply as both a contributor and a full-time candidate?",
    answer:
      "Absolutely. Many AeThex teammates started as contributors. Let us know in your application if you want to explore both paths.",
  },
  {
    question: "Do I need prior Web3 or game development experience?",
    answer:
      "No. We're looking for builders, storytellers, and systems thinkers. Tell us how your experience can unlock new value for the AeThex community.",
  },
  {
    question: "How do contributors get matched to projects?",
    answer:
      "We pair contributors with squads based on domain expertise, time commitment, and squad needs. You'll collaborate with a mentor or lead during your first sprint.",
  },
];

const validateEmail = (value: string) => /.+@.+\..+/.test(value.trim());

const Opportunities = () => {
  const { user, profile } = useAuth();
  const toast = useAethexToast();
  const [submittingContributor, setSubmittingContributor] = useState(false);
  const [submittingCareer, setSubmittingCareer] = useState(false);

  const profileWebsite =
    profile && typeof (profile as any).website_url === "string"
      ? ((profile as any).website_url as string)
      : "";

  const [contributorForm, setContributorForm] = useState<ContributorFormState>({
    fullName: "",
    email: "",
    location: "",
    primarySkill: "",
    availability: "",
    portfolioUrl: "",
    interests: [],
    message: "",
  });

  const [careerForm, setCareerForm] = useState<CareerFormState>({
    fullName: "",
    email: "",
    location: "",
    roleInterest: "",
    experienceLevel: "",
    portfolioUrl: "",
    resumeUrl: "",
    message: "",
  });

  useEffect(() => {
    setContributorForm((prev) => ({
      ...prev,
      fullName:
        prev.fullName || profile?.full_name || user?.email?.split("@")[0] || "",
      email: prev.email || user?.email || "",
      location: prev.location || profile?.location || "",
      portfolioUrl: prev.portfolioUrl || profileWebsite || "",
    }));

    setCareerForm((prev) => ({
      ...prev,
      fullName:
        prev.fullName || profile?.full_name || user?.email?.split("@")[0] || "",
      email: prev.email || user?.email || "",
      location: prev.location || profile?.location || "",
      portfolioUrl: prev.portfolioUrl || profileWebsite || "",
    }));
  }, [profile, profileWebsite, user]);

  const toggleContributorInterest = (value: string) => {
    setContributorForm((prev) => {
      const exists = prev.interests.includes(value);
      return {
        ...prev,
        interests: exists
          ? prev.interests.filter((interest) => interest !== value)
          : [...prev.interests, value],
      };
    });
  };

  const submitApplication = async (
    payload: Omit<AethexApplicationSubmission, "type"> & {
      type: "contributor" | "career";
    },
  ) => {
    await aethexApplicationService.submitApplication(payload);
  };

  const handleContributorSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (!contributorForm.fullName.trim()) {
      toast.error({
        title: "Name required",
        description: "Please tell us who you are.",
      });
      return;
    }
    if (!validateEmail(contributorForm.email)) {
      toast.error({
        title: "Valid email required",
        description: "Share an email so we can follow up.",
      });
      return;
    }
    if (!contributorForm.primarySkill) {
      toast.error({
        title: "Select your primary skill",
        description: "Choose the area where you create the most impact.",
      });
      return;
    }
    setSubmittingContributor(true);
    try {
      await submitApplication({
        type: "contributor",
        full_name: contributorForm.fullName,
        email: contributorForm.email,
        location: contributorForm.location,
        primary_skill: contributorForm.primarySkill,
        availability: contributorForm.availability,
        portfolio_url: contributorForm.portfolioUrl,
        message: contributorForm.message,
        interests: contributorForm.interests,
      });
      toast.success({
        title: "Application received",
        description:
          "Thank you! Our contributor success team will reach out shortly.",
      });
      setContributorForm({
        fullName:
          profile?.full_name || contributorForm.email.split("@")[0] || "",
        email: contributorForm.email,
        location: profile?.location || "",
        primarySkill: "",
        availability: "",
        portfolioUrl: profileWebsite || contributorForm.portfolioUrl,
        interests: [],
        message: "",
      });
    } catch (error: any) {
      toast.error({
        title: "Submission failed",
        description:
          error?.message || "We could not submit your contributor application.",
      });
    } finally {
      setSubmittingContributor(false);
    }
  };

  const handleCareerSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (!careerForm.fullName.trim()) {
      toast.error({
        title: "Name required",
        description: "Please add your full name.",
      });
      return;
    }
    if (!validateEmail(careerForm.email)) {
      toast.error({
        title: "Valid email required",
        description: "We need a reachable email to move forward.",
      });
      return;
    }
    if (!careerForm.roleInterest) {
      toast.error({
        title: "Choose a role focus",
        description: "Select the type of role you're most excited about.",
      });
      return;
    }
    setSubmittingCareer(true);
    try {
      await submitApplication({
        type: "career",
        full_name: careerForm.fullName,
        email: careerForm.email,
        location: careerForm.location,
        role_interest: careerForm.roleInterest,
        experience_level: careerForm.experienceLevel,
        portfolio_url: careerForm.portfolioUrl,
        resume_url: careerForm.resumeUrl,
        message: careerForm.message,
      });
      toast.success({
        title: "Thanks for applying",
        description:
          "Our talent team will review your experience and reach out soon.",
      });
      setCareerForm({
        fullName: profile?.full_name || careerForm.email.split("@")[0] || "",
        email: careerForm.email,
        location: profile?.location || "",
        roleInterest: "",
        experienceLevel: "",
        portfolioUrl: profileWebsite || careerForm.portfolioUrl,
        resumeUrl: "",
        message: "",
      });
    } catch (error: any) {
      toast.error({
        title: "Submission failed",
        description:
          error?.message || "We could not submit your career application.",
      });
    } finally {
      setSubmittingCareer(false);
    }
  };

  return (
    <Layout>
      <div className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-foreground">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,_rgba(90,132,255,0.18),_transparent_55%)]" />
        <section className="relative z-10 border-b border-border/30">
          <div className="container mx-auto grid gap-12 px-4 py-20 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <Badge
                variant="outline"
                className="border-neon-blue/60 bg-neon-blue/10 text-neon-blue"
              >
                Build the future at AeThex
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Contribute. Collaborate. Craft the next era of AeThex.
              </h1>
              <p className="max-w-2xl text-lg text-muted-foreground">
                Whether you are a community contributor or exploring full-time
                roles, this is your gateway to ship meaningfully with the AeThex
                team. We unite game makers, storytellers, engineers, and
                strategists around bold ideas.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90"
                >
                  <a href="#apply">Start Application</a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-border/60 bg-background/40 backdrop-blur hover:bg-background/70"
                >
                  <a href="#open-roles">
                    Browse open roles
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="border-border/40 bg-background/50 backdrop-blur">
                  <CardHeader className="flex flex-row items-start justify-between space-y-0">
                    <div>
                      <CardTitle className="text-lg">
                        Contributor network
                      </CardTitle>
                      <CardDescription>
                        Mentors, maintainers, and shipmates.
                      </CardDescription>
                    </div>
                    <Users className="h-8 w-8 text-aethex-400" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-semibold text-white">4,200+</p>
                  </CardContent>
                </Card>
                <Card className="border-border/40 bg-background/50 backdrop-blur">
                  <CardHeader className="flex flex-row items-start justify-between space-y-0">
                    <div>
                      <CardTitle className="text-lg">
                        Teams hiring now
                      </CardTitle>
                      <CardDescription>
                        Across Labs, Platform, and Community.
                      </CardDescription>
                    </div>
                    <Briefcase className="h-8 w-8 text-aethex-400" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-semibold text-white">
                      12 squads
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
            <Card className="border-border/50 bg-background/40 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Sparkles className="h-5 w-5 text-aethex-300" />
                  What makes AeThex different?
                </CardTitle>
                <CardDescription>
                  Cross-functional teams, high-trust culture, and shipped
                  outcomes over vanity metrics.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-neon-blue" />
                  <div>
                    <p className="font-medium text-white">Hybrid squads</p>
                    <p className="text-sm text-muted-foreground">
                      Contributors and full-time teammates collaborate inside
                      the same rituals, tooling, and roadmap.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-yellow-400" />
                  <div>
                    <p className="font-medium text-white">
                      Impact-first onboarding
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Ship something real during your first sprint with a
                      dedicated mentor or squad lead.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-emerald-400" />
                  <div>
                    <p className="font-medium text-white">Transparent growth</p>
                    <p className="text-sm text-muted-foreground">
                      Clear expectations, async updates, and opportunities to
                      move from contributor to core team.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section
          className="relative z-10 border-b border-border/30"
          id="open-roles"
        >
          <div className="container mx-auto px-4 py-16">
            <div className="mb-10 grid gap-4 md:grid-cols-[0.6fr_1fr] md:items-end">
              <div>
                <Badge
                  variant="outline"
                  className="border-purple-400/60 bg-purple-500/10 text-purple-200"
                >
                  Explore opportunities
                </Badge>
                <h2 className="mt-4 text-3xl font-semibold text-white">
                  Contributor paths & immediate hiring needs
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Choose how you want to collaborate with AeThex. We empower
                  flexible contributor engagements alongside full-time roles
                  across labs, platform, and community.
                </p>
              </div>
              <div className="rounded-xl border border-border/40 bg-background/40 p-4 backdrop-blur">
                <div className="flex items-start gap-3">
                  <Clock className="mt-1 h-5 w-5 text-aethex-300" />
                  <div>
                    <p className="font-medium text-white">Rolling reviews</p>
                    <p className="text-sm text-muted-foreground">
                      Contributor cohorts are evaluated weekly. Urgent hiring
                      roles receive priority outreach within 72 hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="border-border/40 bg-background/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Sparkles className="h-5 w-5 text-amber-300" />
                    Core Contributors
                  </CardTitle>
                  <CardDescription>
                    Shape feature roadmaps, ship code, design experiences, or
                    lead community programs.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>Typical commitment: 5-15 hrs / week</p>
                  <ul className="list-disc space-y-2 pl-4">
                    <li>
                      Join a squad shipping AeThex platform, docs, or live
                      services
                    </li>
                    <li>
                      Collaborate directly with PMs, producers, and staff
                      engineers
                    </li>
                    <li>
                      Earn AeThex recognition, mentorship, and prioritized
                      hiring pathways
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-border/40 bg-background/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Rocket className="h-5 w-5 text-neon-blue" />
                    Fellows & Apprentices
                  </CardTitle>
                  <CardDescription>
                    Guided programs for emerging builders to gain
                    portfolio-ready experience.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>Typical commitment: 10-20 hrs / week for 12 weeks</p>
                  <ul className="list-disc space-y-2 pl-4">
                    <li>
                      Structured mentorship with clear milestones and feedback
                    </li>
                    <li>
                      Contribute to lab prototypes, live events, or curriculum
                      builds
                    </li>
                    <li>
                      Ideal for rising professionals breaking into games or
                      platform engineering
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-border/40 bg-background/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Briefcase className="h-5 w-5 text-emerald-300" />
                    Full-time roles
                  </CardTitle>
                  <CardDescription>
                    Join AeThex as a core teammate with benefits, equity
                    pathways, and ownership of initiatives.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    Immediate needs across engineering, design, product, and
                    community.
                  </p>
                  <ul className="list-disc space-y-2 pl-4">
                    <li>
                      Global-first, remote-friendly culture with async
                      collaboration
                    </li>
                    <li>
                      Cross-functional squads aligned to measurable player and
                      creator outcomes
                    </li>
                    <li>Opportunities to incubate new AeThex Labs ventures</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {openOpportunities.map((role) => (
                <Card
                  key={role.title}
                  className="border-border/40 bg-background/40 backdrop-blur"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-white">
                          {role.title}
                        </CardTitle>
                        <CardDescription>{role.type}</CardDescription>
                      </div>
                      <Badge
                        variant="outline"
                        className="border-aethex-400/60 text-aethex-200"
                      >
                        Priority
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {role.summary}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {role.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="border-border/50 bg-background/60 text-xs uppercase tracking-wide"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="relative z-10 border-b border-border/30" id="apply">
          <div className="container mx-auto px-4 py-16">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <Badge
                  variant="outline"
                  className="border-aethex-400/60 bg-aethex-500/10 text-aethex-200"
                >
                  Apply now
                </Badge>
                <h2 className="mt-4 text-3xl font-semibold text-white">
                  Tell us how you want to build with AeThex
                </h2>
                <p className="mt-2 max-w-2xl text-muted-foreground">
                  Share a snapshot of your experience, interests, and
                  availability. We calibrate opportunities weekly and match you
                  with the best-fit squad or role.
                </p>
              </div>
              <div className="rounded-xl border border-border/40 bg-background/40 p-4 text-sm text-muted-foreground backdrop-blur">
                <p className="font-medium text-white">Need help?</p>
                <p>
                  Email{" "}
                  <a
                    className="text-neon-blue underline"
                    href="mailto:opportunities@aethex.com"
                  >
                    opportunities@aethex.com
                  </a>{" "}
                  if you want to talk through the right track before applying.
                </p>
              </div>
            </div>

            <Tabs defaultValue="contributor" className="w-full">
              <TabsList className="bg-background/40">
                <TabsTrigger value="contributor">
                  Contributor journey
                </TabsTrigger>
                <TabsTrigger value="career">Careers at AeThex</TabsTrigger>
              </TabsList>
              <TabsContent value="contributor" className="mt-6">
                <Card className="border-border/40 bg-background/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Contributor application
                    </CardTitle>
                    <CardDescription>
                      Ideal for open-source, part-time, or fellowship-style
                      collaborations.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form
                      className="grid gap-6"
                      onSubmit={handleContributorSubmit}
                    >
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="contributor-name">Full name</Label>
                          <Input
                            id="contributor-name"
                            value={contributorForm.fullName}
                            onChange={(event) =>
                              setContributorForm((prev) => ({
                                ...prev,
                                fullName: event.target.value,
                              }))
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contributor-email">Email</Label>
                          <Input
                            id="contributor-email"
                            type="email"
                            value={contributorForm.email}
                            onChange={(event) =>
                              setContributorForm((prev) => ({
                                ...prev,
                                email: event.target.value,
                              }))
                            }
                            required
                          />
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="contributor-location">
                            Location (optional)
                          </Label>
                          <Input
                            id="contributor-location"
                            value={contributorForm.location}
                            onChange={(event) =>
                              setContributorForm((prev) => ({
                                ...prev,
                                location: event.target.value,
                              }))
                            }
                            placeholder="City, Country"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Availability</Label>
                          <Select
                            value={contributorForm.availability}
                            onValueChange={(value) =>
                              setContributorForm((prev) => ({
                                ...prev,
                                availability: value,
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select weekly availability" />
                            </SelectTrigger>
                            <SelectContent>
                              {contributorAvailabilityOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Primary skill</Label>
                          <Select
                            value={contributorForm.primarySkill}
                            onValueChange={(value) =>
                              setContributorForm((prev) => ({
                                ...prev,
                                primarySkill: value,
                              }))
                            }
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Where do you create the most impact?" />
                            </SelectTrigger>
                            <SelectContent>
                              {contributorPrimarySkills.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contributor-portfolio">
                            Portfolio or profile link
                          </Label>
                          <Input
                            id="contributor-portfolio"
                            value={contributorForm.portfolioUrl}
                            onChange={(event) =>
                              setContributorForm((prev) => ({
                                ...prev,
                                portfolioUrl: event.target.value,
                              }))
                            }
                            placeholder="https://"
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label>Focus areas you are excited about</Label>
                        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                          {contributorInterestOptions.map((interest) => (
                            <label
                              key={interest}
                              className="flex cursor-pointer items-start gap-3 rounded-lg border border-border/50 bg-background/40 p-3 text-sm transition hover:border-aethex-400/60"
                            >
                              <Checkbox
                                checked={contributorForm.interests.includes(
                                  interest,
                                )}
                                onCheckedChange={() =>
                                  toggleContributorInterest(interest)
                                }
                                className="mt-0.5"
                              />
                              <span>{interest}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contributor-message">
                          Tell us about a project you are proud of or what you
                          want to build here
                        </Label>
                        <Textarea
                          id="contributor-message"
                          value={contributorForm.message}
                          onChange={(event) =>
                            setContributorForm((prev) => ({
                              ...prev,
                              message: event.target.value,
                            }))
                          }
                          rows={5}
                          placeholder="Share context, links, or ideas you want to explore with AeThex."
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full sm:w-auto"
                        disabled={submittingContributor}
                      >
                        {submittingContributor ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending application...
                          </>
                        ) : (
                          "Submit contributor application"
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="career" className="mt-6">
                <Card className="border-border/40 bg-background/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Career application
                    </CardTitle>
                    <CardDescription>
                      Ideal for full-time or long-term contract positions within
                      AeThex.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="grid gap-6" onSubmit={handleCareerSubmit}>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="career-name">Full name</Label>
                          <Input
                            id="career-name"
                            value={careerForm.fullName}
                            onChange={(event) =>
                              setCareerForm((prev) => ({
                                ...prev,
                                fullName: event.target.value,
                              }))
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="career-email">Email</Label>
                          <Input
                            id="career-email"
                            type="email"
                            value={careerForm.email}
                            onChange={(event) =>
                              setCareerForm((prev) => ({
                                ...prev,
                                email: event.target.value,
                              }))
                            }
                            required
                          />
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="career-location">
                            Location (optional)
                          </Label>
                          <Input
                            id="career-location"
                            value={careerForm.location}
                            onChange={(event) =>
                              setCareerForm((prev) => ({
                                ...prev,
                                location: event.target.value,
                              }))
                            }
                            placeholder="City, Country"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Role focus</Label>
                          <Select
                            value={careerForm.roleInterest}
                            onValueChange={(value) =>
                              setCareerForm((prev) => ({
                                ...prev,
                                roleInterest: value,
                              }))
                            }
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select the role you are pursuing" />
                            </SelectTrigger>
                            <SelectContent>
                              {careerRoleOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Experience level</Label>
                          <Select
                            value={careerForm.experienceLevel}
                            onValueChange={(value) =>
                              setCareerForm((prev) => ({
                                ...prev,
                                experienceLevel: value,
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select your level" />
                            </SelectTrigger>
                            <SelectContent>
                              {careerExperienceLevels.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="career-portfolio">
                            Portfolio or work samples
                          </Label>
                          <Input
                            id="career-portfolio"
                            value={careerForm.portfolioUrl}
                            onChange={(event) =>
                              setCareerForm((prev) => ({
                                ...prev,
                                portfolioUrl: event.target.value,
                              }))
                            }
                            placeholder="https://"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="career-resume">
                          Resume, CV, or LinkedIn
                        </Label>
                        <Input
                          id="career-resume"
                          value={careerForm.resumeUrl}
                          onChange={(event) =>
                            setCareerForm((prev) => ({
                              ...prev,
                              resumeUrl: event.target.value,
                            }))
                          }
                          placeholder="https://"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="career-message">
                          Why AeThex, why now?
                        </Label>
                        <Textarea
                          id="career-message"
                          value={careerForm.message}
                          onChange={(event) =>
                            setCareerForm((prev) => ({
                              ...prev,
                              message: event.target.value,
                            }))
                          }
                          rows={5}
                          placeholder="Share recent accomplishments, what motivates you, or ideas you want to ship with AeThex."
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full sm:w-auto"
                        disabled={submittingCareer}
                      >
                        {submittingCareer ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending application...
                          </>
                        ) : (
                          "Submit career application"
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section className="relative z-10 border-b border-border/30">
          <div className="container mx-auto px-4 py-16">
            <div className="mb-10 text-center">
              <Badge
                variant="outline"
                className="border-border/50 bg-background/40 text-muted-foreground"
              >
                From hello to shipped impact
              </Badge>
              <h2 className="mt-4 text-3xl font-semibold text-white">
                What happens after you apply
              </h2>
              <p className="mt-2 text-muted-foreground">
                A guided experience that helps you connect with squads, evaluate
                fit, and start shipping meaningful work.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {applicationMilestones.map(
                ({ icon: Icon, title, description }) => (
                  <Card
                    key={title}
                    className="border-border/40 bg-background/40 backdrop-blur"
                  >
                    <CardHeader className="space-y-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-aethex-500/15 text-aethex-200">
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-xl text-white">
                        {title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {description}
                      </p>
                    </CardContent>
                  </Card>
                ),
              )}
            </div>
          </div>
        </section>

        <section className="relative z-10">
          <div className="container mx-auto px-4 py-16">
            <div className="mb-10 text-center">
              <Badge
                variant="outline"
                className="border-border/50 bg-background/40 text-muted-foreground"
              >
                Frequently asked questions
              </Badge>
              <h2 className="mt-4 text-3xl font-semibold text-white">
                Everything you need to know
              </h2>
              <p className="mt-2 text-muted-foreground">
                From application timelines to cross-team collaboration, here are
                answers to what most applicants ask.
              </p>
            </div>
            <div className="mx-auto grid max-w-4xl gap-4">
              {faqs.map((item) => (
                <Card
                  key={item.question}
                  className="border-border/40 bg-background/50 backdrop-blur"
                >
                  <CardHeader>
                    <CardTitle className="text-lg text-white">
                      {item.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.answer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Opportunities;
