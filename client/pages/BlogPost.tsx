import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Calendar } from "lucide-react";
import NotFound from "./NotFound";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!slug) return;
        const res = await fetch(`/api/blog/${encodeURIComponent(slug)}`);
        const data = res.ok ? await res.json() : null;
        if (!cancelled) setPost(data);
      } catch (e) {
        console.warn("Blog post fetch failed:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) return null;
  if (!post) return <NotFound />;

  return (
    <Layout>
      <div className="min-h-screen bg-aethex-gradient py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card className="overflow-hidden border-border/50 animate-scale-in">
            {post.image && (
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-64 object-cover"
              />
            )}
            <CardHeader>
              {post.category && (
                <Badge className="mb-4 bg-gradient-to-r from-aethex-500 to-neon-blue">
                  {post.category}
                </Badge>
              )}
              <CardTitle className="text-3xl mt-2">{post.title}</CardTitle>
              {post.excerpt && (
                <CardDescription className="text-muted-foreground mt-2">
                  {post.excerpt}
                </CardDescription>
              )}
              <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                {post.author && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" /> <span>{post.author}</span>
                  </div>
                )}
                {post.date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> <span>{post.date}</span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="prose max-w-none mt-6">
              {post.body ? (
                <div dangerouslySetInnerHTML={{ __html: post.body }} />
              ) : (
                <p>{post.excerpt}</p>
              )}
              <div className="pt-6">
                <Link to="/blog" className="text-aethex-400 underline">
                  Back to Blog
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
