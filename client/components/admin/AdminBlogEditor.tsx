import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAethexToast } from "@/hooks/use-aethex-toast";
import { Loader2, X } from "lucide-react";

interface BlogEditorProps {
  onPublish?: (success: boolean) => void;
  initialData?: {
    title: string;
    excerpt: string;
    html: string;
    slug?: string;
    feature_image?: string;
    tags?: string[];
    meta_title?: string;
    meta_description?: string;
  };
}

const BlogEditor = ({ onPublish, initialData }: BlogEditorProps) => {
  const toast = useAethexToast();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState(initialData?.title || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [html, setHtml] = useState(initialData?.html || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [featureImage, setFeatureImage] = useState(
    initialData?.feature_image || "",
  );
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [metaTitle, setMetaTitle] = useState(initialData?.meta_title || "");
  const [metaDescription, setMetaDescription] = useState(
    initialData?.meta_description || "",
  );

  // Auto-generate slug from title if not manually set
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
      toast.error("Title and body are required");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/blog/publish", {
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

      const data = await response.json();
      toast.success(`Post published: ${data.url}`);
      onPublish?.(true);

      // Reset form
      setTitle("");
      setExcerpt("");
      setHtml("");
      setSlug("");
      setFeatureImage("");
      setTags([]);
      setMetaTitle("");
      setMetaDescription("");
    } catch (error: any) {
      toast.error(error.message || "Failed to publish post");
      onPublish?.(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Post Details</CardTitle>
          <CardDescription>
            Publish directly to Ghost.org with AeThex as author
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title"
              className="border-border/50"
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <label className="text-sm font-medium">URL Slug</label>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="Leave blank to auto-generate from title"
              className="border-border/50"
            />
            {!slug && title && (
              <p className="text-xs text-muted-foreground">
                Auto-slug:{" "}
                <code className="bg-background/80 px-2 py-1">{autoSlug}</code>
              </p>
            )}
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Excerpt</label>
            <Textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief summary (optional)"
              className="border-border/50 h-20"
            />
          </div>

          {/* Featured Image */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Featured Image URL</label>
            <Input
              value={featureImage}
              onChange={(e) => setFeatureImage(e.target.value)}
              placeholder="https://..."
              className="border-border/50"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tags</label>
            <div className="flex gap-2">
              <Input
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

          {/* SEO */}
          <div className="space-y-4 border-t border-border/30 pt-4">
            <h3 className="font-medium">SEO</h3>
            <div className="space-y-2">
              <label className="text-sm font-medium">Meta Title</label>
              <Input
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="Leave blank to use post title"
                className="border-border/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Meta Description</label>
              <Textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Leave blank to use excerpt"
                className="border-border/50 h-20"
              />
            </div>
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
            💡 Tip: You can use plain HTML or paste from your favorite editor
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      {html && (
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            {title && <h1>{title}</h1>}
            {excerpt && (
              <p className="text-muted-foreground italic">{excerpt}</p>
            )}
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </CardContent>
        </Card>
      )}

      {/* Publish Button */}
      <Button
        onClick={handlePublish}
        disabled={!title.trim() || !html.trim() || isLoading}
        className="w-full bg-gradient-to-r from-aethex-500 to-neon-blue h-12"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Publishing...
          </>
        ) : (
          "Publish to Ghost"
        )}
      </Button>
    </div>
  );
};

export default BlogEditor;
