import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  ArrowLeft,
  Calendar,
  Users,
  TrendingUp,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface ClientProject {
  id: number;
  name: string;
  description: string;
  status: "Planning" | "In Progress" | "Review" | "Completed" | "On Hold";
  progress: number;
  startDate: string;
  dueDate: string;
  budget: number;
  spent: number;
  team: Array<{ name: string; role: string; avatar?: string }>;
  deliverables: Array<{ name: string; completed: boolean }>;
}

const mockProjects: ClientProject[] = [
  {
    id: 1,
    name: "Roblox Game Development",
    description:
      "Custom game development for multiplayer Roblox experience with advanced mechanics",
    status: "In Progress",
    progress: 65,
    startDate: "2024-12-01",
    dueDate: "2025-02-28",
    budget: 50000,
    spent: 32500,
    team: [
      { name: "Alex Chen", role: "Lead Developer" },
      { name: "Jordan Smith", role: "Game Designer" },
      { name: "Taylor Brown", role: "QA Engineer" },
    ],
    deliverables: [
      { name: "Core mechanics implementation", completed: true },
      { name: "UI/UX design", completed: true },
      { name: "Multiplayer networking", completed: false },
      { name: "Testing and optimization", completed: false },
      { name: "Deployment and launch", completed: false },
    ],
  },
  {
    id: 2,
    name: "AI Integration Project",
    description:
      "Integration of AI-powered features into existing game platform",
    status: "In Progress",
    progress: 45,
    startDate: "2025-01-15",
    dueDate: "2025-03-15",
    budget: 35000,
    spent: 15750,
    team: [
      { name: "Casey Johnson", role: "AI Specialist" },
      { name: "Morgan Davis", role: "Backend Engineer" },
    ],
    deliverables: [
      { name: "AI model training", completed: true },
      { name: "API integration", completed: false },
      { name: "Performance testing", completed: false },
    ],
  },
  {
    id: 3,
    name: "Mobile App Launch",
    description: "iOS and Android mobile application for player engagement",
    status: "On Hold",
    progress: 30,
    startDate: "2025-02-01",
    dueDate: "2025-04-01",
    budget: 45000,
    spent: 13500,
    team: [
      { name: "Alex Chen", role: "Full Stack Developer" },
      { name: "Jordan Smith", role: "Mobile Architect" },
    ],
    deliverables: [
      { name: "Design mockups", completed: true },
      { name: "iOS development", completed: false },
      { name: "Android development", completed: false },
      { name: "App store submission", completed: false },
    ],
  },
];

const statusColors: Record<ClientProject["status"], string> = {
  Planning: "bg-slate-500/20 text-slate-300",
  "In Progress": "bg-blue-500/20 text-blue-300",
  Review: "bg-amber-500/20 text-amber-300",
  Completed: "bg-green-500/20 text-green-300",
  "On Hold": "bg-red-500/20 text-red-300",
};

export default function ClientProjects() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const filteredProjects = mockProjects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(search.toLowerCase()) ||
      project.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !selectedStatus || project.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const statuses: ClientProject["status"][] = [
    "Planning",
    "In Progress",
    "Review",
    "Completed",
    "On Hold",
  ];

  return (
    <Layout>
      <div className="relative min-h-screen bg-black text-white overflow-hidden pb-12">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_top,#3b82f6_0,rgba(0,0,0,0.45)_55%,rgba(0,0,0,0.9)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0,transparent_calc(100%-1px),rgba(59,130,246,0.05)_calc(100%-1px))] bg-[length:100%_32px]" />

        <main className="relative z-10">
          {/* Header */}
          <section className="border-b border-slate-800 py-8">
            <div className="container mx-auto max-w-7xl px-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/hub/client")}
                className="mb-4 text-slate-400"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Portal
              </Button>
              <div className="flex items-center gap-3">
                <Briefcase className="h-8 w-8 text-blue-400" />
                <h1 className="text-3xl font-bold">Projects</h1>
              </div>
              <p className="text-slate-300 mt-2">
                View and manage all your active projects
              </p>
            </div>
          </section>

          {/* Filters */}
          <section className="border-b border-slate-800 py-6">
            <div className="container mx-auto max-w-7xl px-4">
              <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <Input
                    placeholder="Search projects..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-700 text-white"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedStatus(null)}
                    className={`px-4 py-2 rounded-lg transition ${
                      selectedStatus === null
                        ? "bg-blue-500/20 text-blue-300 border border-blue-500/50"
                        : "bg-slate-800/50 text-slate-400 border border-slate-700"
                    }`}
                  >
                    All Projects
                  </button>
                  {statuses.map((status) => (
                    <button
                      key={status}
                      onClick={() =>
                        setSelectedStatus(
                          selectedStatus === status ? null : status,
                        )
                      }
                      className={`px-4 py-2 rounded-lg transition ${
                        selectedStatus === status
                          ? `${statusColors[status]} border border-opacity-50`
                          : "bg-slate-800/50 text-slate-400 border border-slate-700"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Projects Grid */}
          <section className="py-12">
            <div className="container mx-auto max-w-7xl px-4">
              {filteredProjects.length === 0 ? (
                <Card className="bg-slate-800/30 border-slate-700">
                  <CardContent className="p-12 text-center">
                    <Briefcase className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">
                      No projects found matching your criteria
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredProjects.map((project) => (
                    <Card
                      key={project.id}
                      className="bg-slate-800/30 border-slate-700 hover:border-blue-500/50 transition cursor-pointer"
                      onClick={() =>
                        navigate(`/hub/client/projects/${project.id}`)
                      }
                    >
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          {/* Left Column - Project Info */}
                          <div className="lg:col-span-2">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-xl font-semibold text-white">
                                  {project.name}
                                </h3>
                                <p className="text-sm text-slate-400 mt-1">
                                  {project.description}
                                </p>
                              </div>
                              <Badge className={statusColors[project.status]}>
                                {project.status}
                              </Badge>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-slate-400">
                                  Progress
                                </span>
                                <span className="text-sm font-semibold text-white">
                                  {project.progress}%
                                </span>
                              </div>
                              <div className="w-full bg-slate-700/50 rounded-full h-2">
                                <div
                                  className="bg-blue-500 h-2 rounded-full transition-all"
                                  style={{ width: `${project.progress}%` }}
                                />
                              </div>
                            </div>

                            {/* Details */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                              <div className="flex items-center gap-2 text-slate-300">
                                <Calendar className="h-4 w-4 text-slate-500" />
                                <span>Due {project.dueDate}</span>
                              </div>
                              <div className="flex items-center gap-2 text-slate-300">
                                <Users className="h-4 w-4 text-slate-500" />
                                <span>{project.team.length} members</span>
                              </div>
                              <div className="flex items-center gap-2 text-slate-300">
                                <TrendingUp className="h-4 w-4 text-slate-500" />
                                <span>
                                  ${project.spent.toLocaleString()} / $
                                  {project.budget.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Right Column - Team */}
                          <div className="lg:border-l lg:border-slate-700 lg:pl-6">
                            <h4 className="text-sm font-semibold text-white mb-3">
                              Team ({project.team.length})
                            </h4>
                            <div className="space-y-2">
                              {project.team.map((member) => (
                                <div
                                  key={member.name}
                                  className="text-sm text-slate-300"
                                >
                                  <p className="font-medium">{member.name}</p>
                                  <p className="text-xs text-slate-500">
                                    {member.role}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
