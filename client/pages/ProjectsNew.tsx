import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import LoadingScreen from "@/components/LoadingScreen";
import { useAuth } from "@/contexts/AuthContext";
import { aethexToast } from "@/lib/aethex-toast";
import {
  aethexProjectService,
  aethexAchievementService,
} from "@/lib/aethex-database-adapter";

export default function ProjectsNew() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [status, setStatus] = useState<
    "planning" | "in_progress" | "completed" | "on_hold"
  >("planning");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    return (
      <LoadingScreen
        message="Please sign in to create a project..."
        showProgress={true}
        duration={800}
      />
    );
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!title.trim()) {
      aethexToast.error({
        title: "Title required",
        description: "Please provide a project title.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const techArray = technologies
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const project = await aethexProjectService.createProject({
        user_id: user.id,
        title: title.trim(),
        description: description.trim(),
        status,
        technologies: techArray,
        github_url: githubUrl.trim() || undefined,
        live_url: liveUrl.trim() || undefined,
      } as any);

      if (project) {
        try {
          await aethexAchievementService.checkAndAwardProjectAchievements(
            user.id,
          );
        } catch {}
        aethexToast.success({
          title: "Project created",
          description: "Your project has been created.",
        });
        navigate("/dashboard");
      } else {
        throw new Error("Project creation failed");
      }
    } catch (err: any) {
      const { normalizeErrorMessage } = await import("@/lib/error-utils");
      const msg = normalizeErrorMessage(err);
      console.error("Error creating project:", msg, err);
      aethexToast.error({
        title: "Failed to create project",
        description: msg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-2xl font-bold mb-4">Start a New Project</h1>

          <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-card/50 border-border/50 p-6 rounded-lg"
          >
            <div>
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Decentralized Chat App"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description of the project"
              />
            </div>

            <div>
              <Label htmlFor="technologies">
                Technologies (comma separated)
              </Label>
              <Input
                id="technologies"
                value={technologies}
                onChange={(e) => setTechnologies(e.target.value)}
                placeholder="React, Node.js, Supabase, Typescript"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="github">GitHub URL</Label>
                <Input
                  id="github"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/your/repo"
                />
              </div>

              <div>
                <Label htmlFor="live">Live URL</Label>
                <Input
                  id="live"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full p-2 rounded border border-border/30 bg-background"
              >
                <option value="planning">Planning</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
              </select>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="hover-lift"
              >
                {isSubmitting ? "Creating..." : "Create Project"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
