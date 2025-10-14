import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MessageCircle, Share2, ThumbsUp, User } from "lucide-react";
import type { BlogPost } from "./types";

interface BlogPostGridProps {
  posts: BlogPost[];
  placeholderImage?: string;
  emptyState?: React.ReactNode;
}

const BlogPostGrid = ({
  posts,
  placeholderImage = "/placeholder.svg",
  emptyState,
}: BlogPostGridProps) => {
  if (!posts.length) {
    return (
      <div className="rounded-2xl border border-border/40 bg-background/70 p-12 text-center text-muted-foreground">
        {emptyState || "No posts found. Try adjusting your filters."}
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
      {posts.map((post, index) => (
        <Card
          key={post.slug}
          className="group flex h-full flex-col overflow-hidden border-border/40 bg-background/80 transition hover:border-aethex-400/50 hover:shadow-lg"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          {post.image ? (
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
          ) : (
            <div className="flex h-48 w-full items-center justify-center bg-muted/10">
              <img
                src={placeholderImage}
                alt="Placeholder"
                className="h-16 w-16 opacity-50"
              />
            </div>
          )}

          <CardHeader className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge
                variant="outline"
                className="text-xs uppercase tracking-wide"
              >
                {post.category || "General"}
              </Badge>
              {post.readTime ? (
                <span className="text-xs text-muted-foreground">
                  {post.readTime}
                </span>
              ) : null}
            </div>
            <CardTitle className="text-xl leading-tight text-white">
              <Link
                to={`/blog/${post.slug}`}
                className="transition hover:text-aethex-200"
              >
                {post.title}
              </Link>
            </CardTitle>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {post.excerpt}
            </p>
          </CardHeader>

          <CardContent className="mt-auto space-y-6">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <User className="h-3.5 w-3.5" />
                {post.author || "AeThex Team"}
              </span>
              <span className="inline-flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" />
                {post.date || "Recently"}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <ThumbsUp className="h-3.5 w-3.5" />
                {post.likes?.toLocaleString() ?? 0}
              </span>
              <span className="inline-flex items-center gap-2">
                <MessageCircle className="h-3.5 w-3.5" />
                {post.comments?.toLocaleString() ?? 0}
              </span>
              <Button asChild size="sm" variant="outline" className="ml-auto">
                <Link
                  to={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 text-xs"
                >
                  Read article
                  <Share2 className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BlogPostGrid;
