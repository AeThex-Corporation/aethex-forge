import { useState } from "react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { MarketplaceCard } from "@/components/dev-platform/MarketplaceCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Search, TrendingUp, Zap, Package, ShoppingBag } from "lucide-react";

const categories = [
  "All Items",
  "Integrations",
  "Plugins",
  "Themes",
  "Components",
  "Bots",
  "Tools",
];

const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "recent", label: "Recently Added" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

const marketplaceItems = [
  {
    id: "premium-analytics-dashboard",
    name: "Premium Analytics Dashboard",
    description: "Advanced analytics dashboard with real-time metrics, custom reports, and data export features",
    category: "Components",
    price: 49,
    rating: 4.8,
    reviews: 124,
    sales: 892,
    author: "DataViz Studio",
    thumbnail: "",
    isPro: true,
    isFeatured: true,
    tags: ["analytics", "charts", "dashboard"],
  },
  {
    id: "discord-advanced-bot",
    name: "Discord Advanced Bot Framework",
    description: "Complete Discord bot with moderation, leveling, economy, and custom commands system",
    category: "Bots",
    price: 79,
    rating: 4.9,
    reviews: 267,
    sales: 1543,
    author: "BotMakers Inc",
    thumbnail: "",
    isPro: true,
    isFeatured: true,
    tags: ["discord", "moderation", "leveling"],
  },
  {
    id: "payment-gateway-integration",
    name: "Multi-Payment Gateway Integration",
    description: "Accept payments via Stripe, PayPal, and crypto. Includes webhooks and refund handling",
    category: "Integrations",
    price: 99,
    rating: 4.7,
    reviews: 89,
    sales: 456,
    author: "PayFlow Solutions",
    thumbnail: "",
    isPro: true,
    tags: ["payments", "stripe", "crypto"],
  },
  {
    id: "auth-system-pro",
    name: "Advanced Auth System",
    description: "Complete authentication with OAuth, 2FA, magic links, and session management",
    category: "Integrations",
    price: 0,
    rating: 4.6,
    reviews: 342,
    sales: 3421,
    author: "SecureAuth Team",
    thumbnail: "",
    isFeatured: true,
    tags: ["auth", "oauth", "security"],
  },
  {
    id: "neon-ui-theme",
    name: "Neon Cyberpunk Theme Pack",
    description: "Premium dark theme with neon accents, custom animations, and 50+ styled components",
    category: "Themes",
    price: 39,
    rating: 4.9,
    reviews: 178,
    sales: 1234,
    author: "DesignCraft",
    thumbnail: "",
    isPro: true,
    tags: ["theme", "dark-mode", "neon"],
  },
  {
    id: "email-templates",
    name: "Professional Email Templates",
    description: "20+ responsive email templates for transactional emails, newsletters, and marketing",
    category: "Components",
    price: 29,
    rating: 4.5,
    reviews: 93,
    sales: 678,
    author: "EmailPro",
    thumbnail: "",
    tags: ["email", "templates", "responsive"],
  },
  {
    id: "ai-chatbot-plugin",
    name: "AI-Powered Chatbot Plugin",
    description: "Integrate GPT-powered chatbot with custom training, conversation history, and analytics",
    category: "Plugins",
    price: 149,
    rating: 4.8,
    reviews: 156,
    sales: 543,
    author: "AI Innovations",
    thumbnail: "",
    isPro: true,
    isFeatured: true,
    tags: ["ai", "chatbot", "gpt"],
  },
  {
    id: "seo-optimizer",
    name: "SEO & Meta Tag Optimizer",
    description: "Automated SEO optimization with meta tags, sitemaps, and structured data generation",
    category: "Tools",
    price: 0,
    rating: 4.4,
    reviews: 267,
    sales: 2341,
    author: "SEO Masters",
    thumbnail: "",
    tags: ["seo", "optimization", "meta"],
  },
  {
    id: "notification-system",
    name: "Multi-Channel Notifications",
    description: "Send notifications via email, SMS, push, and in-app with templates and scheduling",
    category: "Integrations",
    price: 59,
    rating: 4.7,
    reviews: 201,
    sales: 987,
    author: "NotifyHub",
    thumbnail: "",
    isPro: true,
    tags: ["notifications", "email", "push"],
  },
];

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Items");
  const [sortBy, setSortBy] = useState("popular");

  const filteredItems = marketplaceItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "All Items" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <SEO pageTitle="Developer Marketplace" description="Premium integrations, plugins, and tools to supercharge your projects" />
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-6 border-primary/20 bg-primary/5">
            <TrendingUp className="w-8 h-8 text-primary mb-2" />
            <h3 className="font-semibold mb-1">Featured Items</h3>
            <p className="text-sm text-muted-foreground">
              Hand-picked quality integrations
            </p>
          </Card>
          <Card className="p-6">
            <Zap className="w-8 h-8 text-yellow-500 mb-2" />
            <h3 className="font-semibold mb-1">Instant Delivery</h3>
            <p className="text-sm text-muted-foreground">
              Download immediately after purchase
            </p>
          </Card>
          <Card className="p-6">
            <ShoppingBag className="w-8 h-8 text-green-500 mb-2" />
            <h3 className="font-semibold mb-1">30-Day Guarantee</h3>
            <p className="text-sm text-muted-foreground">
              Full refund if not satisfied
            </p>
          </Card>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search marketplace..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-md border border-input bg-background text-sm"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""} found
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Package className="w-4 h-4 mr-2" />
              Sell Your Product
            </Button>
          </div>
        </div>

        {/* Marketplace Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No items found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <MarketplaceCard key={item.id} {...item} />
            ))}
          </div>
        )}

        {/* Become a Seller CTA */}
        <div className="mt-12 p-8 border-2 border-primary/30 rounded-lg text-center bg-primary/5">
          <Package className="w-12 h-12 mx-auto text-primary mb-4" />
          <h3 className="text-2xl font-semibold mb-2">Become a Seller</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Share your integrations, plugins, and tools with thousands of developers.
            Earn revenue and build your reputation in the AeThex community.
          </p>
          <Button size="lg">
            Start Selling Today
          </Button>
        </div>
      </div>
    </Layout>
  );
}
