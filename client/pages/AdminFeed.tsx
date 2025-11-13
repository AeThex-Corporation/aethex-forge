import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { aethexToast } from "@/lib/aethex-toast";
import LoadingScreen from "@/components/LoadingScreen";
import ArmPostCard, { ArmType } from "@/components/feed/ArmPostCard";
import { PenTool, Trash2, Eye, Lock } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "";

const ARM_OPTIONS: { id: ArmType; label: string }[] = [
  { id: "labs", label: "Labs" },
  { id: "gameforge", label: "GameForge" },
  { id: "corp", label: "Corp" },
  { id: "foundation", label: "Foundation" },
  { id: "devlink", label: "Dev-Link" },
  { id: "nexus", label: "Nexus" },
  { id: "staff", label: "Staff" },
];

interface AdminPost {
  id: string;
  title: string;
  content: string;
  arm_affiliation: ArmType;
  author_id: string;
  created_at: string;
  is_published: boolean;
  tags?: string[];
  category?: string;
  user_profiles?: {
    id: string;
    username?: string;
    full_name?: string;
    avatar_url?: string;
  };
}

export default function AdminFeed() {
  const { user, roles, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const hasAccess = roles.includes("admin") || roles.includes("staff");

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [armAffiliation, setArmAffiliation] = useState<ArmType>("labs");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Posts list state
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  // Load all posts
  const loadPosts = async () => {
    setIsLoadingPosts(true);
    try {
      const response = await fetch(`${API_BASE}/api/admin/feed`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error("Failed to load posts:", error);
      aethexToast.error({
        title: "Failed to load posts",
        description: "Please try again",
      });
    } finally {
      setIsLoadingPosts(false);
    }
  };

  useEffect(() => {
    if (!authLoading && (!user || !hasAccess)) {
      navigate("/login", { replace: true });
    } else {
      loadPosts();
    }
  }, [user, hasAccess, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      aethexToast.error({
        title: "Validation error",
        description: "Title and content are required",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const tagsArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const response = await fetch(`${API_BASE}/api/admin/feed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          arm_affiliation: armAffiliation,
          author_id: user?.id,
          tags: tagsArray,
          category: category || null,
          is_published: isPublished,
        }),
      });

      if (response.ok) {
        aethexToast.success({
          title: "Post created",
          description: "Your post has been published successfully",
        });

        // Reset form
        setTitle("");
        setContent("");
        setArmAffiliation("labs");
        setTags("");
        setCategory("");
        setIsPublished(true);

        // Reload posts
        loadPosts();
      } else {
        const error = await response.json();
        aethexToast.error({
          title: "Failed to create post",
          description: error.error || "Please try again",
        });
      }
    } catch (error) {
      console.error("Error creating post:", error);
      aethexToast.error({
        title: "Error",
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return <LoadingScreen message="Verifying access..." />;
  }

  if (!user || !hasAccess) {
    return (
      <Layout>
        <div className="min-h-screen bg-aethex-gradient py-12">
          <div className="container mx-auto px-4 max-w-md">
            <Card className="bg-red-500/10 border-red-500/30">
              <CardHeader>
                <CardTitle className="text-red-400">Access Denied</CardTitle>
                <CardDescription>
                  This page requires admin or staff access.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate("/dashboard")}>
                  Go to Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title="Manage Feed | AeThex Admin"
        description="Create and manage community feed posts"
      />

      <div className="min-h-screen bg-aethex-gradient py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="mb-8 animate-slide-down">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-aethex-300 via-neon-blue to-aethex-400 bg-clip-text text-transparent">
              Feed Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Create and manage community feed posts
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Create Post Form */}
            <div className="lg:col-span-2">
              <Card className="bg-card/50 border-aethex-400/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PenTool className="h-5 w-5 text-aethex-400" />
                    Create New Post
                  </CardTitle>
                  <CardDescription>
                    Create a post for the community feed with arm affiliation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Post title"
                        className="bg-background/50 border-border/50"
                        required
                      />
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <Label htmlFor="content">Content *</Label>
                      <Textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your post content here..."
                        rows={8}
                        className="bg-background/50 border-border/50 font-mono text-sm"
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Markdown formatting is supported
                      </p>
                    </div>

                    {/* Arm Affiliation */}
                    <div className="space-y-2">
                      <Label htmlFor="arm">Arm Affiliation *</Label>
                      <Select value={armAffiliation} onValueChange={(value: any) => setArmAffiliation(value)}>
                        <SelectTrigger id="arm" className="bg-background/50 border-border/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ARM_OPTIONS.map((arm) => (
                            <SelectItem key={arm.id} value={arm.id}>
                              {arm.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input
                        id="tags"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="e.g., update, announcement, showcase"
                        className="bg-background/50 border-border/50"
                      />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="e.g., announcement, showcase, discussion"
                        className="bg-background/50 border-border/50"
                      />
                    </div>

                    {/* Published Toggle */}
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-background/40 border border-border/40">
                      <Switch
                        id="published"
                        checked={isPublished}
                        onCheckedChange={setIsPublished}
                      />
                      <Label htmlFor="published" className="cursor-pointer flex-1 mb-0">
                        <div className="flex items-center gap-2">
                          {isPublished ? (
                            <>
                              <Eye className="h-4 w-4 text-green-400" />
                              <span>Publish immediately</span>
                            </>
                          ) : (
                            <>
                              <Lock className="h-4 w-4 text-yellow-400" />
                              <span>Save as draft</span>
                            </>
                          )}
                        </div>
                      </Label>
                    </div>

                    {/* Submit */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-aethex-600 to-neon-blue hover:from-aethex-700 hover:to-neon-blue/90"
                    >
                      {isSubmitting ? "Publishing..." : "Publish Post"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Preview Sidebar */}
            <div className="lg:col-span-1">
              {title && content && (
                <div className="sticky top-24">
                  <Card className="bg-card/50 border-border/40 mb-4">
                    <CardHeader>
                      <CardTitle className="text-sm">Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ArmPostCard
                        post={{
                          id: "preview",
                          title,
                          content,
                          arm_affiliation: armAffiliation,
                          author_id: user?.id || "",
                          created_at: new Date().toISOString(),
                          tags: tags
                            .split(",")
                            .map((t) => t.trim())
                            .filter((t) => t.length > 0),
                          category: category || undefined,
                          user_profiles: {
                            id: user?.id || "",
                            full_name: user?.user_metadata?.full_name || "You",
                            avatar_url: user?.user_metadata?.avatar_url,
                          },
                        }}
                      />
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>

          {/* Recent Posts */}
          <div className="mt-12">
            <Card className="bg-card/50 border-border/40">
              <CardHeader>
                <CardTitle className="text-2xl">Recent Posts</CardTitle>
                <CardDescription>
                  {posts.length} posts total
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingPosts ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading posts...</p>
                  </div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No posts yet. Create your first post above!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {posts.map((post) => (
                      <div key={post.id} className="relative">
                        <div className="absolute top-2 right-2 z-10 flex gap-2">
                          {!post.is_published && (
                            <Badge variant="outline" className="border-yellow-500/50 text-yellow-400">
                              Draft
                            </Badge>
                          )}
                        </div>
                        <ArmPostCard post={post as any} />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
