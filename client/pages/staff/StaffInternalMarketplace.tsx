import { useState, useEffect } from "react";
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
  Clock,
  Gift,
  Star,
  Package,
  Loader2,
  Coins,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { aethexToast } from "@/components/ui/aethex-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  category: string;
  points_cost: number;
  image_url?: string;
  stock_count?: number;
  is_available: boolean;
}

interface Order {
  id: string;
  quantity: number;
  status: string;
  created_at: string;
  item?: {
    name: string;
    image_url?: string;
  };
}

interface Points {
  balance: number;
  lifetime_earned: number;
}

export default function StaffInternalMarketplace() {
  const { session } = useAuth();
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [points, setPoints] = useState<Points>({ balance: 0, lifetime_earned: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [orderDialog, setOrderDialog] = useState<MarketplaceItem | null>(null);
  const [shippingAddress, setShippingAddress] = useState("");

  useEffect(() => {
    if (session?.access_token) {
      fetchMarketplace();
    }
  }, [session?.access_token]);

  const fetchMarketplace = async () => {
    try {
      const res = await fetch("/api/staff/marketplace", {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setItems(data.items || []);
        setOrders(data.orders || []);
        setPoints(data.points || { balance: 0, lifetime_earned: 0 });
      }
    } catch (err) {
      aethexToast.error("Failed to load marketplace");
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async () => {
    if (!orderDialog) return;
    try {
      const res = await fetch("/api/staff/marketplace", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          item_id: orderDialog.id,
          quantity: 1,
          shipping_address: shippingAddress,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        aethexToast.success("Order placed successfully!");
        setOrderDialog(null);
        setShippingAddress("");
        fetchMarketplace();
      } else {
        aethexToast.error(data.error || "Failed to place order");
      }
    } catch (err) {
      aethexToast.error("Failed to place order");
    }
  };

  const categories = ["All", ...new Set(items.map((i) => i.category))];

  const filtered = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "shipped":
        return "bg-green-500/20 text-green-300";
      case "processing":
        return "bg-blue-500/20 text-blue-300";
      case "pending":
        return "bg-amber-500/20 text-amber-300";
      default:
        return "bg-slate-500/20 text-slate-300";
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title="Points Marketplace"
        description="Redeem your points for rewards"
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
                <Gift className="h-6 w-6 text-amber-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-amber-100">
                  Points Marketplace
                </h1>
                <p className="text-amber-200/70">
                  Redeem your earned points for rewards
                </p>
              </div>
            </div>

            {/* Points Summary */}
            <div className="grid md:grid-cols-3 gap-4 mb-12">
              <Card className="bg-amber-950/30 border-amber-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-amber-200/70">Your Balance</p>
                      <p className="text-3xl font-bold text-amber-100">
                        {points.balance.toLocaleString()}
                      </p>
                    </div>
                    <Coins className="h-8 w-8 text-amber-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-amber-950/30 border-amber-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-amber-200/70">Lifetime Earned</p>
                      <p className="text-3xl font-bold text-amber-100">
                        {points.lifetime_earned.toLocaleString()}
                      </p>
                    </div>
                    <Star className="h-8 w-8 text-amber-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-amber-950/30 border-amber-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-amber-200/70">My Orders</p>
                      <p className="text-3xl font-bold text-amber-100">
                        {orders.length}
                      </p>
                    </div>
                    <Package className="h-8 w-8 text-amber-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filter */}
            <div className="mb-8 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Search rewards..."
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

            {/* Items Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {filtered.map((item) => (
                <Card
                  key={item.id}
                  className="bg-slate-800/50 border-slate-700/50 hover:border-amber-500/50 transition-all"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-amber-100">
                          {item.name}
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                          {item.category}
                        </CardDescription>
                      </div>
                      {item.stock_count !== null && item.stock_count < 10 && (
                        <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                          Only {item.stock_count} left
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-slate-300">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-amber-400 font-semibold">
                        <Coins className="h-4 w-4" />
                        {item.points_cost.toLocaleString()} pts
                      </div>
                      <Button
                        size="sm"
                        className="bg-amber-600 hover:bg-amber-700"
                        disabled={points.balance < item.points_cost}
                        onClick={() => setOrderDialog(item)}
                      >
                        Redeem
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-12 mb-12">
                <p className="text-slate-400">No rewards found</p>
              </div>
            )}

            {/* Recent Orders */}
            {orders.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-amber-100 mb-6">Recent Orders</h2>
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order) => (
                    <Card key={order.id} className="bg-slate-800/50 border-slate-700/50">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-amber-100 font-semibold">
                              {order.item?.name || "Unknown Item"}
                            </p>
                            <p className="text-sm text-slate-400">
                              Qty: {order.quantity} • {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.replace(/\b\w/g, (l) => l.toUpperCase())}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Dialog */}
      <Dialog open={!!orderDialog} onOpenChange={() => setOrderDialog(null)}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-amber-100">
              Redeem {orderDialog?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-slate-700/50 rounded">
              <div className="flex justify-between mb-2">
                <span className="text-slate-300">Cost</span>
                <span className="text-amber-400 font-semibold">
                  {orderDialog?.points_cost.toLocaleString()} pts
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Your Balance After</span>
                <span className="text-slate-100">
                  {(points.balance - (orderDialog?.points_cost || 0)).toLocaleString()} pts
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-2 block">Shipping Address</label>
              <Input
                placeholder="Enter your shipping address"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="bg-slate-700 border-slate-600 text-slate-100"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOrderDialog(null)}>
                Cancel
              </Button>
              <Button
                className="bg-amber-600 hover:bg-amber-700"
                onClick={placeOrder}
              >
                Confirm Order
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
