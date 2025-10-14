import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Flame, MessageCircle, ThumbsUp } from "lucide-react";
import type { BlogPost } from "./types";

interface BlogTrendingRailProps {
  posts: BlogPost[];
}

const BlogTrendingRail = ({ posts }: BlogTrendingRailProps) => {
  if (!posts.length) return null;

  return (
    <section className="border-b border-border/30 bg-background/60 py-12 backdrop-blur">
      <div className="container mx-auto space-y-6 px-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
              Trending now
            </p>
            <h2 className="text-2xl font-semibold text-white">
              High-signal reads across AeThex
            </h2>
          </div>
          <Badge className="hidden lg:inline-flex items-center gap-1 bg-gradient-to-r from-orange-500 to-rose-500 text-xs uppercase tracking-widest">
            <Flame className="h-3.5 w-3.5" /> Hot topics
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {posts.map((post) => (
            <Card
              key={post.slug}
              className="group border-border/40 bg-background/80 transition hover:border-aethex-400/60 hover:shadow-xl"
            >
              <CardContent className="space-y-4 p-6">
                <Badge variant="outline" className="text-xs">
                  {post.category || "General"}
                </Badge>
                <Link
                  to={`/blog/${post.slug}`}
                  className="block text-lg font-semibold leading-snug text-white transition group-hover:text-aethex-200"
                >
                  {post.title}
                </Link>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{post.author || "AeThex Team"}</span>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      {post.likes?.toLocaleString() ?? 0}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      {post.comments?.toLocaleString() ?? 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogTrendingRail;
