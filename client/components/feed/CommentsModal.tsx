import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { aethexToast } from "@/lib/aethex-toast";
import { MessageCircle, Send, Trash2, Loader2 } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  user_profiles?: {
    id: string;
    username?: string;
    full_name?: string;
    avatar_url?: string;
  };
}

interface CommentsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: string;
  currentUserId?: string;
  onCommentAdded?: () => void;
}

export default function CommentsModal({
  open,
  onOpenChange,
  postId,
  currentUserId,
  onCommentAdded,
}: CommentsModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load comments when modal opens
  useEffect(() => {
    if (open) {
      loadComments();
    }
  }, [open]);

  const loadComments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE}/api/community/post-comments?post_id=${postId}&limit=50`,
      );
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
      } else {
        aethexToast.error({
          title: "Failed to load comments",
          description: "Please try again",
        });
      }
    } catch (error) {
      console.error("Failed to load comments:", error);
      aethexToast.error({
        title: "Failed to load comments",
        description: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUserId) {
      aethexToast.error({
        title: "Not authenticated",
        description: "Please log in to comment",
      });
      return;
    }

    if (newComment.trim().length === 0) {
      aethexToast.error({
        title: "Empty comment",
        description: "Please write something",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/api/community/post-comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post_id: postId,
          user_id: currentUserId,
          content: newComment,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setComments((prev) => [data.comment, ...prev]);
        setNewComment("");
        aethexToast.success({
          title: "Comment added",
          description: "Your comment has been posted",
        });
        onCommentAdded?.();
      } else {
        const error = await response.json();
        aethexToast.error({
          title: "Failed to add comment",
          description: error.error || "Please try again",
        });
      }
    } catch (error) {
      console.error("Failed to add comment:", error);
      aethexToast.error({
        title: "Failed to add comment",
        description: "An unexpected error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/api/community/post-comments`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment_id: commentId,
          user_id: currentUserId,
        }),
      });

      if (response.ok) {
        setComments((prev) =>
          prev.filter((comment) => comment.id !== commentId),
        );
        aethexToast.success({
          title: "Comment deleted",
          description: "Your comment has been removed",
        });
        onCommentAdded?.();
      } else {
        const error = await response.json();
        aethexToast.error({
          title: "Failed to delete comment",
          description: error.error || "Please try again",
        });
      }
    } catch (error) {
      console.error("Failed to delete comment:", error);
      aethexToast.error({
        title: "Failed to delete comment",
        description: "An unexpected error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] flex flex-col h-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Comments ({comments.length})
          </DialogTitle>
        </DialogHeader>

        <Separator />

        <ScrollArea className="flex-1 pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <MessageCircle className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                No comments yet. Be the first to comment!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2 flex-1">
                      {comment.user_profiles?.avatar_url && (
                        <img
                          src={comment.user_profiles.avatar_url}
                          alt={comment.user_profiles.full_name || "User"}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-border/40"
                        />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">
                          {comment.user_profiles?.full_name ||
                            comment.user_profiles?.username ||
                            "Anonymous"}
                        </p>
                        <p className="text-xs text-muted-foreground mb-2">
                          {formatDate(comment.created_at)}
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                    {currentUserId === comment.user_id && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-destructive/20 hover:text-destructive"
                        onClick={() => handleDeleteComment(comment.id)}
                        disabled={isSubmitting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <Separator />

        <form onSubmit={handleAddComment} className="flex flex-col gap-2">
          <Textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="resize-none h-20 text-sm"
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting || !newComment.trim()}
            className="flex items-center gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Comment
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
