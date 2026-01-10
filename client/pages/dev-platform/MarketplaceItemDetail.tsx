import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { CodeBlock } from "@/components/dev-platform/ui/CodeBlock";
import { Callout } from "@/components/dev-platform/ui/Callout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  ShoppingCart,
  Download,
  Shield,
  RefreshCw,
  Heart,
  Share2,
  MessageSquare,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

const itemData: Record<string, any> = {
  "premium-analytics-dashboard": {
    name: "Premium Analytics Dashboard",
    description: "Advanced analytics dashboard with real-time metrics, custom reports, and data export features",
    longDescription:
      "Transform your data into actionable insights with our Premium Analytics Dashboard. Built with React and recharts, this component library provides everything you need to visualize complex data patterns, track KPIs, and make data-driven decisions. Includes 20+ chart types, real-time updates, and export functionality.",
    category: "Components",
    price: 49,
    rating: 4.8,
    reviews: 124,
    sales: 892,
    author: "DataViz Studio",
    authorRating: 4.9,
    authorSales: 3456,
    isPro: true,
    isFeatured: true,
    tags: ["analytics", "charts", "dashboard", "react", "recharts"],
    version: "3.2.1",
    lastUpdated: "2026-01-05",
    license: "Commercial",
    features: [
      "20+ customizable chart types (line, bar, pie, scatter, heatmap)",
      "Real-time data updates with WebSocket support",
      "Advanced filtering and data transformation",
      "Export to PDF, Excel, and CSV formats",
      "Responsive design for mobile and desktop",
      "Dark mode with custom theming",
      "Built-in date range picker and time zone support",
      "TypeScript definitions included",
      "Comprehensive documentation and examples",
      "Free lifetime updates",
    ],
    requirements: [
      "React 18 or higher",
      "TypeScript 5.0+ (optional but recommended)",
      "Node.js 18+",
      "Modern browser with ES6 support",
    ],
    demoUrl: "https://demo-analytics.aethex.dev",
    docsUrl: "https://docs.aethex.dev/analytics-dashboard",
  },
  "discord-advanced-bot": {
    name: "Discord Advanced Bot Framework",
    description: "Complete Discord bot with moderation, leveling, economy, and custom commands system",
    longDescription:
      "Build powerful Discord bots in minutes with our Advanced Bot Framework. Includes pre-built moderation tools, XP/leveling system, virtual economy, custom commands, and more. Perfect for community servers, gaming guilds, and educational communities.",
    category: "Bots",
    price: 79,
    rating: 4.9,
    reviews: 267,
    sales: 1543,
    author: "BotMakers Inc",
    authorRating: 4.9,
    authorSales: 5678,
    isPro: true,
    isFeatured: true,
    tags: ["discord", "moderation", "leveling", "economy"],
    version: "2.5.0",
    lastUpdated: "2026-01-06",
    license: "Commercial",
    features: [
      "Advanced moderation with auto-mod, warnings, and bans",
      "XP and leveling system with role rewards",
      "Virtual economy with currency, shop, and trading",
      "Custom command builder with permissions",
      "Reaction roles and welcome messages",
      "Music player with playlist support",
      "Ticket system for support channels",
      "Activity logging and audit trails",
      "Dashboard web interface",
      "24/7 support and updates",
    ],
    requirements: [
      "Discord Developer Account",
      "Node.js 18+",
      "PostgreSQL or MongoDB database",
      "VPS or hosting service",
    ],
    demoUrl: "https://discord.gg/demo-bot",
    docsUrl: "https://docs.aethex.dev/discord-bot",
  },
};

export default function MarketplaceItemDetail() {
  const { id } = useParams<{ id: string }>();
  const [liked, setLiked] = useState(false);

  const item = itemData[id || ""] || itemData["premium-analytics-dashboard"];

  return (
    <Layout>
      <SEO pageTitle={item.name} description={item.description} />
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-lg flex items-center justify-center text-6xl font-bold text-primary/30 mb-4">
              {item.name.substring(0, 2).toUpperCase()}
            </div>
            {item.demoUrl && (
              <Button variant="outline" className="w-full" asChild>
                <a href={item.demoUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Live Demo
                </a>
              </Button>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline">{item.category}</Badge>
                {item.isPro && <Badge className="bg-primary">Pro</Badge>}
                {item.isFeatured && (
                  <Badge className="bg-yellow-500 text-black">Featured</Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold mb-3">{item.name}</h1>
              <p className="text-muted-foreground mb-4">{item.longDescription}</p>

              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(item.rating)
                            ? "fill-yellow-500 text-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold">{item.rating}</span>
                  <span className="text-muted-foreground">({item.reviews} reviews)</span>
                </div>
                <span className="text-muted-foreground">{item.sales} sales</span>
              </div>
            </div>

            <Card className="p-6 border-primary/30 bg-primary/5">
              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Price</p>
                  <p className="text-4xl font-bold text-primary">
                    ${item.price}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">One-time payment</p>
                  <p className="text-xs text-muted-foreground">Lifetime updates</p>
                </div>
              </div>

              <Button size="lg" className="w-full mb-3">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setLiked(!liked)}
                >
                  <Heart
                    className={`w-4 h-4 mr-2 ${liked ? "fill-red-500 text-red-500" : ""}`}
                  />
                  {liked ? "Saved" : "Save"}
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>

              <div className="mt-4 pt-4 border-t border-border space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Secure payment via Stripe</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Download className="w-4 h-4 text-blue-500" />
                  <span>Instant download after purchase</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <RefreshCw className="w-4 h-4 text-purple-500" />
                  <span>30-day money-back guarantee</span>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  {item.author.substring(0, 2)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{item.author}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                    <span>{item.authorRating} rating</span>
                    <span>•</span>
                    <span>{item.authorSales} sales</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="features" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="installation">Installation</TabsTrigger>
            <TabsTrigger value="docs">Documentation</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({item.reviews})</TabsTrigger>
          </TabsList>

          <TabsContent value="features" className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">What's Included</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {item.features.map((feature: string, index: number) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Requirements</h3>
              <ul className="space-y-2">
                {item.requirements.map((req: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-primary">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-2">
              <p className="text-sm text-muted-foreground w-full mb-2">Tags:</p>
              {item.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            <Card className="p-4 bg-muted">
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Version</p>
                  <p className="font-semibold">{item.version}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Last Updated</p>
                  <p className="font-semibold">{item.lastUpdated}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">License</p>
                  <p className="font-semibold">{item.license}</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="installation" className="space-y-6">
            <Callout variant="info">
              <p className="font-medium">Purchase required</p>
              <p className="text-sm mt-1">
                Installation instructions will be available after purchase.
              </p>
            </Callout>

            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Start</h3>
              <p className="text-muted-foreground mb-4">
                After purchasing, you'll receive a download link with the complete package.
              </p>
              <CodeBlock
                code={`# Install via npm
npm install @aethex/${item.name.toLowerCase().replace(/\s+/g, "-")}

# Or download from your purchases dashboard
# Visit: https://aethex.dev/dashboard/purchases`}
                language="bash"
              />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">What You'll Get</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>Complete source code</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>Installation guide and documentation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>Example projects and demos</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>Lifetime updates and bug fixes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>Priority support access</span>
                </li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="docs" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">Documentation</h3>
              <p className="text-muted-foreground mb-4">
                Comprehensive documentation is included with your purchase, covering
                installation, configuration, API reference, and examples.
              </p>
              {item.docsUrl && (
                <Button variant="outline" asChild>
                  <a href={item.docsUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Documentation Preview
                  </a>
                </Button>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-3">Support</h3>
              <p className="text-muted-foreground mb-4">
                Get help from the author via email or Discord. Response time is typically
                within 24 hours.
              </p>
              <Button variant="outline">
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold mb-1">{item.rating} out of 5</h3>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(item.rating)
                            ? "fill-yellow-500 text-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-muted-foreground">{item.reviews} reviews</span>
                </div>
              </div>
              <Button variant="outline">Write a Review</Button>
            </div>

            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    U{i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-semibold">User {i + 1}</p>
                      <div className="flex">
                        {[...Array(5)].map((_, j) => (
                          <Star
                            key={j}
                            className="w-4 h-4 fill-yellow-500 text-yellow-500"
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {i + 1} day{i > 0 ? "s" : ""} ago
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Excellent product! Easy to integrate and great documentation. The support
                      team was very helpful when I had questions.
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* Back Link */}
        <div className="pt-8 border-t border-border">
          <Link to="/dev-platform/marketplace">
            <Button variant="ghost">← Back to Marketplace</Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
