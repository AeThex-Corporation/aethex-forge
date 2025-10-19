import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Calendar } from "lucide-react";
import FourOhFourPage from "./404";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!slug) return;
        // Primary: try server API
        let res = await fetch(`/api/blog/${encodeURIComponent(slug)}`);
        let data: any = null;

        try {
          // Attempt to parse JSON response from server route
          if (res.ok) data = await res.json();
        } catch (e) {
          // If server returned HTML (dev server) or invalid JSON, fall back to Supabase REST
          try {
            const sbUrl = import.meta.env.VITE_SUPABASE_URL;
            const sbKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
            if (sbUrl && sbKey) {
              const url = `${sbUrl.replace(/\/$/, "")}/rest/v1/blog_posts?slug=eq.${encodeURIComponent(
                String(slug),
              )}&select=id,slug,title,excerpt,author,date,read_time,category,image,body_html,published_at`;
              const sbRes = await fetch(url, {
                headers: {
                  apikey: sbKey as string,
                  Authorization: `Bearer ${sbKey}`,
                },
              });
              if (sbRes.ok) {
                const arr = await sbRes.json();
                data = Array.isArray(arr) && arr.length ? arr[0] : null;
              }
            }
          } catch (err) {
            console.warn("Supabase fallback fetch failed:", err);
          }
        }

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
  if (!post) return <FourOhFourPage />;

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
