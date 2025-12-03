import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { aethexToast } from "@/lib/aethex-toast";
import ArmPostCard, { ArmType } from "@/components/feed/ArmPostCard";
import { Loader2, X, Tag } from "lucide-react";

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

const CATEGORIES = [
  "Announcement",
  "Tutorial",
  "Update",
  "Question",
  "Discussion",
  "Showcase",
  "Resource",
  "Other",
];

interface Post {
  id?: string;
  title: string;
  content: string;
  arm_affiliation: ArmType;
  tags?: string[];
  category?: string;
  user_profiles?: {
    id: string;
    username?: string;
    full_name?: string;
    avatar_url?: string;
  };
  created_at?: string;
}

interface PostComposerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserId?: string;
  currentUserProfile?: {
    id: string;
    username?: string;
    full_name?: string;
    avatar_url?: string;
  };
  editingPost?: Post;
  onSuccess?: () => void;
}

export default function PostComposer({
  open,
  onOpenChange,
  currentUserId,
  currentUserProfile,
  editingPost,
  onSuccess,
}: PostComposerProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [armAffiliation, setArmAffiliation] = useState<ArmType>("labs");
  const [category, setCategory] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with editing post data
  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title);
      setContent(editingPost.content);
      setArmAffiliation(editingPost.arm_affiliation);
      setCategory(editingPost.category || "");
      setTags(editingPost.tags || []);
    } else {
      resetForm();
    }
  }, [editingPost, open]);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setArmAffiliation("labs");
    setCategory("");
    setTagInput("");
    setTags([]);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmedTag = tagInput.trim().toLowerCase();
      if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
        setTags([...tags, trimmedTag]);
        setTagInput("");
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUserId) {
      aethexToast.error({
        title: "Not authenticated",
        description: "Please log in to create posts",
      });
      return;
    }

    if (!title.trim()) {
      aethexToast.error({
        title: "Empty title",
        description: "Please enter a title",
      });
      return;
    }

    if (!content.trim()) {
      aethexToast.error({
        title: "Empty content",
        description: "Please write some content",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const url = `${API_BASE}/api/posts`;
      const method = editingPost ? "PUT" : "POST";

      const payload = {
        ...(editingPost && { id: editingPost.id }),
        title: title.trim(),
        content: content.trim(),
        arm_affiliation: armAffiliation,
        author_id: currentUserId,
        category: category || null,
        tags: tags,
        ...(editingPost && { user_id: currentUserId }),
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();

        // Send to Discord if it's a new post
        if (!editingPost && data.post?.id) {
          try {
            await fetch(`${API_BASE}/api/discord/send-community-post`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                post_id: data.post.id,
                title: title.trim(),
                content: content.trim(),
                arm_affiliation: armAffiliation,
                author_id: currentUserId,
                tags: tags,
                category: category || null,
              }),
            }).catch((error) => {
              console.error("Error sending to Discord:", error);
              // Don't fail the post creation if Discord sends fails
            });
          } catch (error) {
            console.error("Error calling Discord endpoint:", error);
          }
        }

        aethexToast.success({
          title: editingPost ? "Post updated" : "Post created",
          description: editingPost
            ? "Your post has been updated"
            : "Your post has been published to the community feed",
        });
        resetForm();
        onOpenChange(false);
        onSuccess?.();
      } else {
        const error = await response.json();
        aethexToast.error({
          title: editingPost
            ? "Failed to update post"
            : "Failed to create post",
          description: error.error || "Please try again",
        });
      }
    } catch (error) {
      console.error("Error submitting post:", error);
      aethexToast.error({
        title: editingPost ? "Failed to update post" : "Failed to create post",
        description: "An unexpected error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewPost: Post = {
    title: title || "Untitled Post",
    content: content || "Start typing your post content...",
    arm_affiliation: armAffiliation,
    tags,
    category: category || undefined,
    user_profiles: currentUserProfile,
    created_at: new Date().toISOString(),
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingPost ? "Edit Post" : "Create a Community Post"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-semibold">
                Title *
              </Label>
              <Input
                id="title"
                placeholder="Give your post a catchy title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={500}
                disabled={isSubmitting}
                className="text-base"
              />
              <p className="text-xs text-muted-foreground text-right">
                {title.length}/500
              </p>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content" className="text-sm font-semibold">
                Content *
              </Label>
              <Textarea
                id="content"
                placeholder="Share your thoughts, updates, or insights with the community..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={5000}
                disabled={isSubmitting}
                className="resize-none h-32 text-base"
              />
              <p className="text-xs text-muted-foreground text-right">
                {content.length}/5000
              </p>
            </div>

            {/* Arm Affiliation */}
            <div className="space-y-2">
              <Label htmlFor="arm" className="text-sm font-semibold">
                Arm Affiliation *
              </Label>
              <Select
                value={armAffiliation}
                onValueChange={(value) => setArmAffiliation(value as ArmType)}
              >
                <SelectTrigger id="arm" disabled={isSubmitting}>
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

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-semibold">
                Category
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category" disabled={isSubmitting}>
                  <SelectValue placeholder="Select a category (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags" className="text-sm font-semibold">
                Tags (max 5)
              </Label>
              <Input
                id="tags"
                placeholder="Type and press Enter to add tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                disabled={isSubmitting || tags.length >= 5}
                className="text-sm"
              />
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || !title.trim() || !content.trim()}
              className="w-full bg-gradient-to-r from-aethex-600 to-neon-blue hover:from-aethex-700 hover:to-neon-blue/90 text-white font-semibold"
            >
              {isSubmitting && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {editingPost ? "Update Post" : "Publish Post"}
            </Button>
          </form>

          {/* Preview Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Preview</h3>
            <Separator />
            <div className="flex-1">
              <ArmPostCard post={previewPost} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
