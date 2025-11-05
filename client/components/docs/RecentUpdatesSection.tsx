import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export interface FeaturedUpdate {
  title: string;
  description: string;
  date: string;
  type: string;
  isNew?: boolean;
}

const defaultUpdates: FeaturedUpdate[] = [
  {
    title: "New AI Integration Tutorials",
    description: "Learn how to integrate cutting-edge AI features",
    date: "2 days ago",
    type: "Tutorial",
    isNew: true,
  },
  {
    title: "API v2.1 Documentation",
    description: "Updated API docs with new endpoints and features",
    date: "1 week ago",
    type: "API",
  },
  {
    title: "Performance Best Practices",
    description: "New guide on optimizing application performance",
    date: "2 weeks ago",
    type: "Guide",
  },
];

interface RecentUpdatesSectionProps {
  updates?: FeaturedUpdate[];
  showViewAll?: boolean;
}

export default function RecentUpdatesSection({
  updates = defaultUpdates,
  showViewAll = true,
}: RecentUpdatesSectionProps) {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">Recent Updates</h3>
        {showViewAll && (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-slate-600 text-white hover:bg-slate-800"
          >
            <Link to="/changelog">View All Updates</Link>
          </Button>
        )}
      </div>
      <div className="space-y-4">
        {updates.map((update, index) => (
          <Card
            key={index}
            className="bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all duration-300 cursor-pointer"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-white font-medium">{update.title}</h4>
                    {update.isNew && (
                      <Badge className="bg-green-600 text-white text-xs">
                        New
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {update.type}
                    </Badge>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {update.description}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{update.date}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
