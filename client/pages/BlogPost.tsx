import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Calendar } from "lucide-react";
import NotFound from "./NotFound";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();

  const featuredPost = {
    title: "The Future of Quantum Game Development",
    excerpt:
      "Exploring how quantum computing will revolutionize game AI, physics simulations, and procedural generation in the next decade.",
    author: "Dr. Sarah Chen",
    date: "December 15, 2024",
    readTime: "8 min read",
    category: "Research",
    likes: 124,
    comments: 23,
    image:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&h=600&fit=crop",
  };

  const posts = [
    featuredPost,
    {
      title: "Building Scalable Game Architecture with Microservices",
      excerpt:
        "Learn how to design game backends that can handle millions of concurrent players using modern microservices patterns.",
      author: "Marcus Rodriguez",
      date: "December 12, 2024",
      readTime: "6 min read",
      category: "Technology",
    },
    {
      title: "Advanced Unity Optimization Techniques",
      excerpt:
        "Performance optimization strategies that can boost your Unity game's frame rate by up to 300%.",
      author: "Alex Thompson",
      date: "December 10, 2024",
      readTime: "12 min read",
      category: "Tutorials",
    },
  ];

  const normalize = (t?: string) =>
    (t || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  const post = useMemo(() => {
    if (!slug) return null;
    return posts.find((p) => normalize(p.title) === normalize(slug));
  }, [slug]);

  if (!post) {
    return <NotFound />;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-aethex-gradient py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card className="overflow-hidden border-border/50 animate-scale-in">
            <img src={post.image} alt={post.title} className="w-full h-64 object-cover" />
            <CardHeader>
              <Badge className="mb-4 bg-gradient-to-r from-aethex-500 to-neon-blue">{post.category}</Badge>
              <CardTitle className="text-3xl mt-2">{post.title}</CardTitle>
              <CardDescription className="text-muted-foreground mt-2">{post.excerpt}</CardDescription>
              <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" /> <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> <span>{post.date}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="prose max-w-none mt-6">
              {/* Simple placeholder content for the article body */}
              <p>
                {post.excerpt}
              </p>

              <p>
                This is a sample article page. In production the blog content would be loaded from the CMS or database and rendered here.
              </p>

              <p>
                <strong>Author:</strong> {post.author}
              </p>

              <div className="pt-6">
                <Link to="/blog" className="text-aethex-400 underline">Back to Blog</Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
