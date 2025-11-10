import { useState } from "react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Search,
  Users,
  Clock,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface Service {
  id: string;
  name: string;
  provider: string;
  category: string;
  description: string;
  availability: "Available" | "Booked" | "Coming Soon";
  turnaround: string;
  requests: number;
}

const services: Service[] = [
  {
    id: "1",
    name: "Design Consultation",
    provider: "Design Team",
    category: "Design",
    description: "1-on-1 design review and UX guidance for your project",
    availability: "Available",
    turnaround: "2 days",
    requests: 8,
  },
  {
    id: "2",
    name: "Code Review",
    provider: "Engineering",
    category: "Development",
    description: "Thorough code review with architectural feedback",
    availability: "Available",
    turnaround: "1 day",
    requests: 15,
  },
  {
    id: "3",
    name: "Security Audit",
    provider: "Security Team",
    category: "Security",
    description: "Comprehensive security review of your application",
    availability: "Booked",
    turnaround: "5 days",
    requests: 4,
  },
  {
    id: "4",
    name: "Performance Optimization",
    provider: "DevOps",
    category: "Infrastructure",
    description: "Optimize your application performance and scalability",
    availability: "Available",
    turnaround: "3 days",
    requests: 6,
  },
  {
    id: "5",
    name: "Product Strategy Session",
    provider: "Product Team",
    category: "Product",
    description: "Alignment session on product roadmap and features",
    availability: "Coming Soon",
    turnaround: "4 days",
    requests: 12,
  },
  {
    id: "6",
    name: "API Integration Support",
    provider: "Backend Team",
    category: "Development",
    description: "Help integrating with AeThex APIs and services",
    availability: "Available",
    turnaround: "2 days",
    requests: 10,
  },
];

const getAvailabilityColor = (availability: string) => {
  switch (availability) {
    case "Available":
      return "bg-green-500/20 text-green-300 border-green-500/30";
    case "Booked":
      return "bg-amber-500/20 text-amber-300 border-amber-500/30";
    case "Coming Soon":
      return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    default:
      return "bg-slate-500/20 text-slate-300";
  }
};

export default function StaffInternalMarketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Design",
    "Development",
    "Security",
    "Infrastructure",
    "Product",
  ];

  const filtered = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.provider.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <SEO
        title="Internal Marketplace"
        description="Request services from other teams"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Background effects */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-96 h-96 bg-amber-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="container mx-auto max-w-6xl px-4 py-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-amber-500/20 border border-amber-500/30">
                <ShoppingCart className="h-6 w-6 text-amber-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-amber-100">
                  Internal Marketplace
                </h1>
                <p className="text-amber-200/70">
                  Request services and resources from other teams
                </p>
              </div>
            </div>

            {/* Summary */}
            <div className="grid md:grid-cols-3 gap-4 mb-12">
              <Card className="bg-amber-950/30 border-amber-500/30">
                <CardContent className="pt-6">
                  <p className="text-2xl font-bold text-amber-100">
                    {services.length}
                  </p>
                  <p className="text-sm text-amber-200/70">
                    Available Services
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-amber-950/30 border-amber-500/30">
                <CardContent className="pt-6">
                  <p className="text-2xl font-bold text-amber-100">
                    {
                      services.filter((s) => s.availability === "Available")
                        .length
                    }
                  </p>
                  <p className="text-sm text-amber-200/70">Ready to Book</p>
                </CardContent>
              </Card>
              <Card className="bg-amber-950/30 border-amber-500/30">
                <CardContent className="pt-6">
                  <p className="text-2xl font-bold text-amber-100">
                    {services.reduce((sum, s) => sum + s.requests, 0)}
                  </p>
                  <p className="text-sm text-amber-200/70">Total Requests</p>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filter */}
            <div className="mb-8 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-700 text-slate-100"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={
                      selectedCategory === category
                        ? "bg-amber-600 hover:bg-amber-700"
                        : "border-amber-500/30 text-amber-300 hover:bg-amber-500/10"
                    }
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Services Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {filtered.map((service) => (
                <Card
                  key={service.id}
                  className="bg-slate-800/50 border-slate-700/50 hover:border-amber-500/50 transition-all"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-amber-100">
                          {service.name}
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                          {service.provider}
                        </CardDescription>
                      </div>
                      <Badge
                        className={`border ${getAvailabilityColor(service.availability)}`}
                      >
                        {service.availability}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-slate-300">
                      {service.description}
                    </p>
                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock className="h-4 w-4" />
                        {service.turnaround}
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <AlertCircle className="h-4 w-4" />
                        {service.requests} requests
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="w-full bg-amber-600 hover:bg-amber-700"
                      disabled={service.availability === "Coming Soon"}
                    >
                      {service.availability === "Coming Soon"
                        ? "Coming Soon"
                        : "Request Service"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-400">No services found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
