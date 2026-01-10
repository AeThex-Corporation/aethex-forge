import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, Eye, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

interface MarketplaceCardProps {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  sales: number;
  author: string;
  authorAvatar?: string;
  thumbnail: string;
  isPro?: boolean;
  isFeatured?: boolean;
  tags: string[];
}

export function MarketplaceCard({
  id,
  name,
  description,
  category,
  price,
  rating,
  reviews,
  sales,
  author,
  thumbnail,
  isPro = false,
  isFeatured = false,
  tags,
}: MarketplaceCardProps) {
  return (
    <Card className="overflow-hidden hover:border-primary/50 transition-all duration-200 group">
      <Link to={`/dev-platform/marketplace/${id}`}>
        <div className="aspect-video bg-gradient-to-br from-primary/20 to-purple-500/20 relative overflow-hidden">
          {isFeatured && (
            <Badge className="absolute top-2 left-2 bg-yellow-500 text-black">
              <TrendingUp className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          )}
          {isPro && (
            <Badge className="absolute top-2 right-2 bg-primary">
              Pro
            </Badge>
          )}
          <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-primary/20">
            {name.substring(0, 2).toUpperCase()}
          </div>
        </div>
      </Link>

      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <Link to={`/dev-platform/marketplace/${id}`} className="flex-1">
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1">
              {name}
            </h3>
          </Link>
        </div>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className="text-xs">
            {category}
          </Badge>
          {tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
            {rating.toFixed(1)} ({reviews})
          </span>
          <span className="flex items-center gap-1">
            <ShoppingCart className="w-4 h-4" />
            {sales}
          </span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">by {author}</p>
            <p className="text-2xl font-bold text-primary">
              {price === 0 ? "Free" : `$${price}`}
            </p>
          </div>

          <Link to={`/dev-platform/marketplace/${id}`}>
            <Button size="sm">
              <Eye className="w-4 h-4 mr-2" />
              View
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
