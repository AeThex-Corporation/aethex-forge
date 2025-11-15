import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AdminBlogEditor from "@/components/admin/AdminBlogEditor";
import { useAuth } from "@/contexts/AuthContext";
import { useAethexToast } from "@/hooks/use-aethex-toast";
import { Plus, List, FileText } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  published_at: string;
  author?: string;
  source: "ghost" | "supabase";
}

const AdminBlogManager = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const toast = useAethexToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("editor");

  // Check authorization
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (userRole !== "admin" && userRole !== "staff") {
      toast.error("Access denied: Admin/Staff only");
      navigate("/dashboard");
    }

    setIsLoading(false);
  }, [user, userRole, navigate, toast]);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/blog?limit=100");
        if (response.ok) {
          const data = await response.json();
          setPosts(data || []);
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const handlePublishSuccess = () => {
    setActiveTab("posts");
    // Refresh posts list
    setTimeout(() => {
      fetch("/api/blog?limit=100")
        .then((r) => r.json())
        .then((data) => setPosts(data || []))
        .catch(console.error);
    }, 1000);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user || (userRole !== "admin" && userRole !== "staff")) {
    return null;
  }

  return (
    <div className="space-y-8 p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Blog Management</h1>
        <p className="text-muted-foreground">
          Create and publish posts directly to Ghost.org
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2">
          <TabsTrigger value="editor" className="gap-2">
            <Plus className="h-4 w-4" />
            New Post
          </TabsTrigger>
          <TabsTrigger value="posts" className="gap-2">
            <List className="h-4 w-4" />
            All Posts ({posts.length})
          </TabsTrigger>
        </TabsList>

        {/* New Post Editor Tab */}
        <TabsContent value="editor" className="space-y-6">
          <AdminBlogEditor onPublish={handlePublishSuccess} />
        </TabsContent>

        {/* Posts List Tab */}
        <TabsContent value="posts" className="space-y-6">
          {posts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No posts yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {posts.map((post) => (
                <Card
                  key={post.id}
                  className="border-border/40 hover:border-border/60 transition cursor-pointer"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <CardTitle className="line-clamp-1">{post.title}</CardTitle>
                        {post.excerpt && (
                          <CardDescription className="line-clamp-2">
                            {post.excerpt}
                          </CardDescription>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {post.source && (
                          <span className="px-2 py-1 rounded bg-background/80">
                            {post.source === "ghost" ? "Ghost" : "Local"}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                      {post.author && <span>{post.author}</span>}
                      {post.published_at && (
                        <span>
                          {new Date(post.published_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/blog/${post.slug}`, "_blank")}
                    >
                      View Post
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Info Box */}
      <Card className="border-border/40 bg-background/60">
        <CardHeader>
          <CardTitle className="text-lg">About Blog Publishing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            ✓ Posts are published directly to Ghost.org and appear immediately on the blog
          </p>
          <p>
            ✓ All posts are authored by "AeThex Team" in Ghost (respects Ghost guidelines)
          </p>
          <p>
            ✓ Use HTML or paste from your preferred editor (Word, Google Docs, Medium, etc)
          </p>
          <p>
            ✓ Featured image and SEO metadata are optional but recommended
          </p>
          <p>
            ✓ Posts appear at /blog and in the blog listing page
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBlogManager;
