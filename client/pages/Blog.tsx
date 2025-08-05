import { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LoadingScreen from "@/components/LoadingScreen";
import { aethexToast } from "@/lib/aethex-toast";
import { Link } from "react-router-dom";
import {
  PenTool,
  Calendar,
  User,
  ArrowRight,
  Search,
  Filter,
  Bookmark,
  Share,
  ThumbsUp,
  MessageCircle,
  TrendingUp,
} from "lucide-react";

export default function Blog() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const toastShownRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (!toastShownRef.current) {
        aethexToast.system("AeThex Blog loaded successfully");
        toastShownRef.current = true;
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const categories = [
    { id: "all", name: "All Posts", count: 45 },
    { id: "technology", name: "Technology", count: 18 },
    { id: "tutorials", name: "Tutorials", count: 12 },
    { id: "research", name: "Research", count: 8 },
    { id: "company", name: "Company News", count: 7 },
  ];

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
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=300&fit=crop",
  };

  const posts = [
    {
      title: "Building Scalable Game Architecture with Microservices",
      excerpt:
        "Learn how to design game backends that can handle millions of concurrent players using modern microservices patterns.",
      author: "Marcus Rodriguez",
      date: "December 12, 2024",
      readTime: "6 min read",
      category: "Technology",
      likes: 89,
      comments: 15,
      trending: true,
    },
    {
      title: "Advanced Unity Optimization Techniques",
      excerpt:
        "Performance optimization strategies that can boost your Unity game's frame rate by up to 300%.",
      author: "Alex Thompson",
      date: "December 10, 2024",
      readTime: "12 min read",
      category: "Tutorials",
      likes: 156,
      comments: 34,
      trending: false,
    },
    {
      title: "AeThex Labs: Breakthrough in Neural Network Compression",
      excerpt:
        "Our research team achieves 90% model size reduction while maintaining accuracy for mobile game AI.",
      author: "Dr. Aisha Patel",
      date: "December 8, 2024",
      readTime: "5 min read",
      category: "Research",
      likes: 203,
      comments: 41,
      trending: true,
    },
    {
      title: "Introducing AeThex Cloud Gaming Platform",
      excerpt:
        "Launch games instantly across any device with our new cloud gaming infrastructure and global CDN.",
      author: "AeThex Team",
      date: "December 5, 2024",
      readTime: "4 min read",
      category: "Company News",
      likes: 278,
      comments: 52,
      trending: false,
    },
    {
      title: "Real-time Ray Tracing in Web Games",
      excerpt:
        "Tutorial: Implementing hardware-accelerated ray tracing in browser-based games using WebGPU.",
      author: "Jordan Kim",
      date: "December 3, 2024",
      readTime: "15 min read",
      category: "Tutorials",
      likes: 94,
      comments: 18,
      trending: false,
    },
    {
      title: "The Evolution of Game AI: From Scripts to Neural Networks",
      excerpt:
        "A comprehensive look at how artificial intelligence in games has evolved and where it's heading next.",
      author: "Dr. Michael Chen",
      date: "December 1, 2024",
      readTime: "10 min read",
      category: "Technology",
      likes: 167,
      comments: 29,
      trending: false,
    },
  ];

  const filteredPosts =
    selectedCategory === "all"
      ? posts
      : posts.filter(
          (post) => post.category.toLowerCase() === selectedCategory,
        );

  if (isLoading) {
    return (
      <LoadingScreen
        message="Loading AeThex Blog..."
        showProgress={true}
        duration={1000}
      />
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-aethex-gradient">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32">
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-4xl mx-auto space-y-8">
              <Badge
                variant="outline"
                className="border-aethex-400/50 text-aethex-400 animate-bounce-gentle"
              >
                <PenTool className="h-3 w-3 mr-1" />
                AeThex Blog
              </Badge>

              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="text-gradient-purple">
                  Insights & Innovation
                </span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Stay updated with the latest developments in game technology, AI
                research, and industry insights from the AeThex team.
              </p>

              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-border/50 bg-background/50 backdrop-blur-sm focus:border-aethex-400 focus:outline-none"
                  />
                </div>
                <Button
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 bg-background/30">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
              {categories.map((category, index) => (
                <Button
                  key={category.id}
                  variant={
                    selectedCategory === category.id ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`animate-scale-in ${
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-aethex-500 to-neon-blue"
                      : ""
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {category.name} ({category.count})
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Post */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Card className="max-w-4xl mx-auto overflow-hidden border-border/50 hover:border-aethex-400/50 transition-all duration-300 animate-scale-in">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <Badge className="mb-4 bg-gradient-to-r from-aethex-500 to-neon-blue">
                    Featured
                  </Badge>
                  <CardTitle className="text-2xl mb-4 text-gradient">
                    {featuredPost.title}
                  </CardTitle>
                  <CardDescription className="text-base mb-6">
                    {featuredPost.excerpt}
                  </CardDescription>

                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{featuredPost.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{featuredPost.date}</span>
                      </div>
                    </div>
                    <Badge variant="outline">{featuredPost.readTime}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <Button asChild>
                      <Link to="/blog/quantum-game-development">
                        Read Article
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{featuredPost.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{featuredPost.comments}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Recent Posts */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-slide-up">
              <h2 className="text-3xl lg:text-4xl font-bold text-gradient mb-4">
                Recent Articles
              </h2>
              <p className="text-lg text-muted-foreground">
                Latest insights and tutorials from our team
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {filteredPosts.map((post, index) => (
                <Card
                  key={index}
                  className="border-border/50 hover:border-aethex-400/50 transition-all duration-300 hover-lift animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {post.category}
                      </Badge>
                      {post.trending && (
                        <Badge className="bg-gradient-to-r from-orange-500 to-red-600 text-xs">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg hover:text-gradient transition-colors cursor-pointer">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <User className="h-3 w-3" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-3 w-3" />
                        <span>{post.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {post.readTime}
                      </Badge>
                      <div className="flex items-center space-x-3">
                        <Button size="sm" variant="ghost">
                          <Bookmark className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Share className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/30">
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <ThumbsUp className="h-3 w-3" />
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="h-3 w-3" />
                          <span>{post.comments}</span>
                        </div>
                      </div>
                      <Button size="sm" asChild>
                        <Link
                          to={`/blog/${post.title.toLowerCase().replace(/\s+/g, "-")}`}
                        >
                          Read More
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-20 bg-background/30">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto space-y-8 animate-scale-in">
              <h2 className="text-3xl lg:text-4xl font-bold text-gradient-purple">
                Stay in the Loop
              </h2>
              <p className="text-xl text-muted-foreground">
                Subscribe to our newsletter for the latest articles, tutorials,
                and technology insights delivered directly to your inbox.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg border border-border/50 bg-background/50 backdrop-blur-sm focus:border-aethex-400 focus:outline-none"
                />
                <Button className="bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90 glow-blue">
                  Subscribe
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                Join 10,000+ developers getting weekly insights. Unsubscribe
                anytime.
              </p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
