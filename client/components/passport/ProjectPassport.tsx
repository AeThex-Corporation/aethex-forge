import { ExternalLink, Users, Calendar, Badge } from "lucide-react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

interface ProjectOwner {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
}

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
  status?: string;
  image_url?: string;
  website?: string;
}

interface ProjectPassportProps {
  project: Project;
  owner?: ProjectOwner;
  isSubdomain?: boolean;
}

const ProjectPassport = ({
  project,
  owner,
  isSubdomain = false,
}: ProjectPassportProps) => {
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Recently";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Recently";
    }
  };

  const statusColors: Record<string, string> = {
    draft: "bg-gray-500/10 text-gray-300 border-gray-500/30",
    active: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    archived: "bg-slate-500/10 text-slate-300 border-slate-500/30",
    planning: "bg-blue-500/10 text-blue-300 border-blue-500/30",
    "in-progress": "bg-yellow-500/10 text-yellow-300 border-yellow-500/30",
    completed: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  };

  const statusLabel = project.status || "active";
  const statusClass = statusColors[statusLabel] || statusColors["active"];

  return (
    <Layout>
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6 sm:pt-10">
        {/* Hero Section */}
        {project.image_url && (
          <div className="mb-8 h-64 w-full overflow-hidden rounded-2xl sm:h-80 lg:h-96">
            <img
              src={project.image_url}
              alt={project.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {/* Project Header */}
        <div className="mb-8 space-y-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground sm:text-5xl">
              {project.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <Badge
                variant="outline"
                className={`border ${statusClass} font-semibold uppercase text-xs`}
              >
                {statusLabel}
              </Badge>
              {isSubdomain && (
                <Badge
                  variant="outline"
                  className="border-aethex-500/30 bg-aethex-500/10 text-aethex-300"
                >
                  🌐 Public Portfolio
                </Badge>
              )}
            </div>
          </div>

          {project.description && (
            <p className="text-lg text-muted-foreground">
              {project.description}
            </p>
          )}
        </div>

        {/* Owner Card */}
        {owner && (
          <Card className="mb-8 border-border/40 bg-background/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Project Lead</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={owner.avatar_url || undefined} />
                    <AvatarFallback>{owner.username[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">
                      {owner.full_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      @{owner.username}
                    </p>
                  </div>
                </div>
                <Link to={`/passport/${owner.username}`}>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Metadata Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card className="border-border/40 bg-background/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">Created</span>
                </div>
                <p className="text-lg font-semibold text-foreground">
                  {formatDate(project.created_at)}
                </p>
              </div>
            </CardContent>
          </Card>

          {project.website && (
            <Card className="border-border/40 bg-background/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <ExternalLink className="h-4 w-4" />
                    <span className="text-sm font-medium">Website</span>
                  </div>
                  <a
                    href={project.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold text-aethex-400 hover:underline"
                  >
                    Visit Project
                  </a>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Call to Action */}
        <Card className="mt-8 border-aethex-500/30 bg-gradient-to-br from-aethex-500/10 to-neon-blue/10 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-aethex-400" />
                <h3 className="text-lg font-semibold text-foreground">
                  Get Involved
                </h3>
              </div>
              <p className="text-muted-foreground">
                Interested in this project? Explore opportunities, connect with
                the team, and contribute to the AeThex ecosystem.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link to="/nexus">
                  <Button
                    variant="default"
                    className="bg-gradient-to-r from-aethex-500 to-neon-blue"
                  >
                    Explore Opportunities
                  </Button>
                </Link>
                <Link to="/creators">
                  <Button variant="outline">Browse Creators</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ProjectPassport;
