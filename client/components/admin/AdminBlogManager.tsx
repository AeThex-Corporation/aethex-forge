import { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  Trash2,
  ExternalLink,
  RefreshCw,
  Plus,
  X,
  Send,
} from "lucide-react";
import { aethexToast } from "@/lib/aethex-toast";

const API_BASE = import.meta.env.VITE_API_BASE || "";

interface BlogPost {
  id?: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  author?: string | null;
  date?: string | null;
  category?: string | null;
  image?: string | null;
  published_at?: string | null;
  body_html?: string | null;
}

export default function AdminBlogManager() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [activeTab, setActiveTab] = useState("manage");
  const [isPublishing, setIsPublishing] = useState(false);

  // Create post state
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [html, setHtml] = useState("");
  const [slug, setSlug] = useState("");
  const [featureImage, setFeatureImage] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  const loadBlogPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/blog?limit=100`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setBlogPosts(data);
          aethexToast.success({
            title: "Blog posts loaded",
            description: `Loaded ${data.length} blog posts`,
          });
        }
      } else {
        const errorText = await res.text();
        console.error("Failed to load blog posts:", errorText);
        aethexToast.error({
          title: "Failed to load blog posts",
          description: res.statusText || "Unknown error",
        });
      }
    } catch (error) {
      console.error("Error loading blog posts:", error);
      aethexToast.error({
        title: "Error loading blog posts",
        description: String(error),
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBlogPosts();
  }, [loadBlogPosts]);

  const handleDeleteBlogPost = useCallback(async (slug: string) => {
    setDeleting(slug);
    try {
      const res = await fetch(`${API_BASE}/api/blog/${slug}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setBlogPosts((posts) => posts.filter((p) => p.slug !== slug));
        aethexToast.success({
          title: "Blog post deleted",
          description: `Post "${slug}" has been removed`,
        });
      } else {
        aethexToast.error({
          title: "Failed to delete blog post",
          description: res.statusText || "Unknown error",
        });
      }
    } catch (error) {
      console.error("Error deleting blog post:", error);
      aethexToast.error({
        title: "Error deleting blog post",
        description: String(error),
      });
    } finally {
      setDeleting(null);
    }
  }, []);

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.author &&
        post.author.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = !filterCategory || post.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(
    new Set(blogPosts.map((p) => p.category).filter(Boolean)),
  );

  const autoSlug =
    slug ||
    title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handlePublish = async () => {
    if (!title.trim() || !html.trim()) {
      aethexToast.error({
        title: "Missing required fields",
        description: "Title and body are required",
      });
      return;
    }

    setIsPublishing(true);
    try {
      const response = await fetch(`${API_BASE}/api/blog/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          excerpt: excerpt || undefined,
          html,
          slug: autoSlug,
          feature_image: featureImage || undefined,
          tags,
          meta_title: metaTitle || title,
          meta_description: metaDescription || excerpt,
          status: "published",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to publish post");
      }

      aethexToast.success({
        title: "Post published!",
        description: "Successfully published to Ghost",
      });

      // Reset form
      setTitle("");
      setExcerpt("");
      setHtml("");
      setSlug("");
      setFeatureImage("");
      setTags([]);
      setMetaTitle("");
      setMetaDescription("");
      setActiveTab("manage");
      loadBlogPosts();
    } catch (error: any) {
      aethexToast.error({
        title: "Failed to publish",
        description: error.message || "Unknown error",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manage">Manage Posts</TabsTrigger>
          <TabsTrigger value="create" className="gap-2">
            <Plus className="h-4 w-4" />
            Create New
          </TabsTrigger>
        </TabsList>

        {/* Manage Posts Tab */}
        <TabsContent value="manage" className="space-y-6">
          <Card className="bg-card/60 border-border/40 backdrop-blur">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Blog Posts</CardTitle>
                  <CardDescription>
                    {blogPosts.length} published{" "}
                    {blogPosts.length === 1 ? "post" : "posts"}
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={loadBlogPosts}
                  disabled={loading}
                  className="gap-2"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  {loading ? "Loading..." : "Refresh"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex-1">
                  <Label htmlFor="search-blogs" className="text-xs mb-1 block">
                    Search
                  </Label>
                  <Input
                    id="search-blogs"
                    placeholder="Search by title, slug, or author..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8"
                  />
                </div>
                <div className="flex-1">
                  <Label
                    htmlFor="filter-category"
                    className="text-xs mb-1 block"
                  >
                    Category
                  </Label>
                  <select
                    id="filter-category"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                  >
                    <option value="">All categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat || ""}>
                        {cat || "Uncategorized"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {filteredPosts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {blogPosts.length === 0
                      ? "No blog posts found"
                      : "No matching blog posts"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead>Title</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="w-20 text-right">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPosts.map((post) => (
                        <TableRow key={post.slug} className="hover:bg-muted/50">
                          <TableCell className="font-medium">
                            <div className="max-w-xs">
                              <p className="truncate">{post.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {post.slug}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {post.author || "—"}
                          </TableCell>
                          <TableCell>
                            {post.category ? (
                              <Badge variant="outline" className="text-xs">
                                {post.category}
                              </Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                —
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(post.published_at || post.date)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-1 justify-end">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  window.open(`/blog/${post.slug}`, "_blank")
                                }
                                title="View published post"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setDeleteConfirm(post)}
                                disabled={deleting === post.slug}
                                title="Delete post"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Create Post Tab */}
        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Post</CardTitle>
              <CardDescription>
                Publish directly to Ghost.org immediately
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="post-title" className="font-medium">
                  Title
                </Label>
                <Input
                  id="post-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Post title"
                  className="border-border/50"
                />
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <Label htmlFor="post-slug" className="font-medium">
                  URL Slug
                </Label>
                <Input
                  id="post-slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="Leave blank to auto-generate"
                  className="border-border/50"
                />
                {!slug && title && (
                  <p className="text-xs text-muted-foreground">
                    Auto-slug:{" "}
                    <code className="bg-background/80 px-2 py-1">
                      {autoSlug}
                    </code>
                  </p>
                )}
              </div>

              {/* Excerpt */}
              <div className="space-y-2">
                <Label htmlFor="post-excerpt" className="font-medium">
                  Excerpt
                </Label>
                <Textarea
                  id="post-excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief summary (optional)"
                  className="border-border/50 h-20"
                />
              </div>

              {/* Featured Image */}
              <div className="space-y-2">
                <Label htmlFor="post-image" className="font-medium">
                  Featured Image URL
                </Label>
                <Input
                  id="post-image"
                  value={featureImage}
                  onChange={(e) => setFeatureImage(e.target.value)}
                  placeholder="https://..."
                  className="border-border/50"
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="post-tags" className="font-medium">
                  Tags
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="post-tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                    placeholder="Add tag and press Enter"
                    className="border-border/50"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addTag}
                    disabled={!tagInput.trim()}
                  >
                    Add
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="gap-2 cursor-pointer hover:bg-destructive/20"
                        onClick={() => removeTag(tag)}
                      >
                        {tag}
                        <X className="h-3 w-3" />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* HTML Editor */}
          <Card>
            <CardHeader>
              <CardTitle>Post Body</CardTitle>
              <CardDescription>HTML content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={html}
                onChange={(e) => setHtml(e.target.value)}
                placeholder="<p>Write your post content here...</p>"
                className="border-border/50 font-mono h-96"
              />
              <div className="text-xs text-muted-foreground">
                💡 Paste from Word, Google Docs, Medium, or any editor
              </div>
            </CardContent>
          </Card>

          {/* SEO */}
          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meta-title" className="font-medium">
                  Meta Title
                </Label>
                <Input
                  id="meta-title"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Leave blank to use post title"
                  className="border-border/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta-desc" className="font-medium">
                  Meta Description
                </Label>
                <Textarea
                  id="meta-desc"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Leave blank to use excerpt"
                  className="border-border/50 h-20"
                />
              </div>
            </CardContent>
          </Card>

          {/* Publish Button */}
          <Button
            onClick={handlePublish}
            disabled={!title.trim() || !html.trim() || isPublishing}
            className="w-full bg-gradient-to-r from-aethex-500 to-neon-blue h-12"
          >
            {isPublishing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Publish to Ghost
              </>
            )}
          </Button>
        </TabsContent>
      </Tabs>

      {deleteConfirm && (
        <AlertDialog
          open={!!deleteConfirm}
          onOpenChange={(open) => !open && setDeleteConfirm(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete blog post?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{deleteConfirm.title}"? This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex gap-2 justify-end">
              <AlertDialogCancel onClick={() => setDeleteConfirm(null)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  handleDeleteBlogPost(deleteConfirm.slug);
                  setDeleteConfirm(null);
                }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
