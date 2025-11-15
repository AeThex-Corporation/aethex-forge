import { useState } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useAethexToast } from "@/hooks/use-aethex-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";

const ARMS = [
  { id: "labs", label: "Labs", color: "bg-yellow-500" },
  { id: "gameforge", label: "GameForge", color: "bg-green-500" },
  { id: "corp", label: "Corp", color: "bg-blue-500" },
  { id: "foundation", label: "Foundation", color: "bg-red-500" },
  { id: "devlink", label: "Dev-Link", color: "bg-cyan-500" },
  { id: "nexus", label: "Nexus", color: "bg-purple-500" },
  { id: "staff", label: "Staff", color: "bg-indigo-500" },
];

export default function AdminFeed() {
  const { user } = useAuth();
  const { toast } = useAethexToast();

  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedArm, setSelectedArm] = useState("labs");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isDraft, setIsDraft] = useState(false);

  // Check admin access
  if (!user?.user_metadata?.is_admin) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Only administrators can access this page.
              </p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast({
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }

    if (!user?.id) {
      toast({
        description: "You must be logged in to create posts",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/community/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          arm_affiliation: selectedArm,
          author_id: user.id,
          tags: tags,
          category: "announcement",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create post");
      }

      const { post } = await response.json();

      toast({
        description: "Post created successfully! 🎉",
      });

      // Reset form
      setTitle("");
      setContent("");
      setTags([]);
      setTagInput("");
      setSelectedArm("labs");
    } catch (error: any) {
      console.error("Failed to create post:", error);
      toast({
        description: error.message || "Failed to create post",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedArmData = ARMS.find((arm) => arm.id === selectedArm);

  return (
    <Layout>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(110,141,255,0.12),transparent_60%)]">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 sm:gap-6 lg:gap-8 px-3 sm:px-4 pb-16 pt-6 sm:pt-10 lg:px-6">
          {/* Header */}
          <div className="space-y-1 sm:space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 sm:h-6 w-5 sm:w-6 text-aethex-400" />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                Feed Manager
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Create system announcements and showcase Arm-to-Arm partnerships.
              This is how we prove the Axiom Model in action.
            </p>
          </div>

          {/* Main Form */}
          <Card className="border-border/40 bg-background/70 shadow-xl backdrop-blur-lg">
            <CardHeader className="p-3 sm:p-4 lg:p-6">
              <CardTitle className="text-lg sm:text-xl">
                Create a New Post
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <form
                onSubmit={handleSubmit}
                className="space-y-4 sm:space-y-5 lg:space-y-6"
              >
                {/* Title */}
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="block text-xs sm:text-sm font-medium text-foreground">
                    Title <span className="text-red-400">*</span>
                  </label>
                  <Input
                    placeholder="e.g., Announcing our partnership with GameForge..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={500}
                    className="border-border/40 bg-background/80 text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    {title.length}/500 characters
                  </p>
                </div>

                {/* Content */}
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="block text-xs sm:text-sm font-medium text-foreground">
                    Content <span className="text-red-400">*</span>
                  </label>
                  <Textarea
                    placeholder="Share your announcement, partnership details, or showcase..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    maxLength={5000}
                    rows={8}
                    className="border-border/40 bg-background/80 resize-none text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    {content.length}/5000 characters
                  </p>
                </div>

                {/* Arm Selection */}
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="block text-xs sm:text-sm font-medium text-foreground">
                    Arm Affiliation <span className="text-red-400">*</span>
                  </label>
                  <Select value={selectedArm} onValueChange={setSelectedArm}>
                    <SelectTrigger className="border-border/40 bg-background/80">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ARMS.map((arm) => (
                        <SelectItem key={arm.id} value={arm.id}>
                          <div className="flex items-center gap-2">
                            <div
                              className={`h-2 w-2 rounded-full ${arm.color}`}
                            />
                            {arm.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    This determines which section and color badge the post
                    displays under.
                  </p>
                </div>

                {/* Tags */}
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="block text-xs sm:text-sm font-medium text-foreground">
                    Tags (Optional)
                  </label>
                  <div className="flex gap-2 flex-col sm:flex-row">
                    <Input
                      placeholder="Add a tag and press Enter..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                      className="border-border/40 bg-background/80 flex-1 text-sm"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addTag}
                      className="border-border/40 text-sm"
                    >
                      Add
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-2">
                      {tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="cursor-pointer border-border/40"
                          onClick={() => removeTag(tag)}
                        >
                          {tag} ✕
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 gap-2 rounded-full bg-gradient-to-r from-aethex-500 to-neon-blue text-white hover:shadow-lg disabled:opacity-50 text-sm sm:text-base"
                  >
                    {isLoading && (
                      <Loader2 className="h-3 sm:h-4 w-3 sm:w-4 animate-spin" />
                    )}
                    {isLoading ? "Publishing..." : "Publish Post"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Quick Reference */}
          <Card className="border-border/40 bg-background/70 shadow-xl backdrop-blur-lg">
            <CardHeader className="p-3 sm:p-4 lg:p-6">
              <CardTitle className="text-base sm:text-lg">
                Arm Color Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="grid gap-2 sm:gap-3 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
                {ARMS.map((arm) => (
                  <div
                    key={arm.id}
                    className="flex items-center gap-2 rounded-lg border border-border/30 bg-background/60 p-2 sm:p-3"
                  >
                    <div
                      className={`h-2 sm:h-3 w-2 sm:w-3 rounded-full ${arm.color}`}
                    />
                    <span className="text-xs sm:text-sm font-medium text-foreground">
                      {arm.label}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Guidelines */}
          <Card className="border-border/40 bg-background/70 shadow-xl backdrop-blur-lg">
            <CardHeader className="p-3 sm:p-4 lg:p-6">
              <CardTitle className="text-base sm:text-lg">
                Phase 1 Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 lg:p-6 space-y-2 sm:space-y-3 text-xs sm:text-sm text-muted-foreground">
              <p>
                ✨ <strong>System Posts Only:</strong> Use this for official
                announcements, partnerships, and Arm-to-Arm collaborations.
              </p>
              <p>
                🔗 <strong>Firewall in Action:</strong> Every post shows the Arm
                color badge. This proves our Guardian (Foundation) ↔ Engine
                (Corp/Labs) separation is real.
              </p>
              <p>
                🤝 <strong>Partnership Showcase:</strong> Use these posts to
                show how different Arms collaborate. Example: "Corp hired 3
                Architects from Foundation via Nexus."
              </p>
              <p>
                🚀 <strong>Phase 2:</strong> User-generated posts coming soon.
                This Phase 1 proves the system works with curated content first.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
