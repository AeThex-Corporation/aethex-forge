import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface KanbanColumn {
  id: string;
  title: string;
  color:
    | "blue"
    | "yellow"
    | "green"
    | "red"
    | "purple"
    | "pink"
    | "cyan"
    | "amber";
  items: KanbanItem[];
  count?: number;
}

export interface KanbanItem {
  id: string;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  badge?: string;
  metadata?: Record<string, string | number>;
  onClick?: () => void;
}

const colorMap = {
  blue: "from-blue-950/40 to-blue-900/20 border-blue-500/20",
  yellow: "from-yellow-950/40 to-yellow-900/20 border-yellow-500/20",
  green: "from-green-950/40 to-green-900/20 border-green-500/20",
  red: "from-red-950/40 to-red-900/20 border-red-500/20",
  purple: "from-purple-950/40 to-purple-900/20 border-purple-500/20",
  pink: "from-pink-950/40 to-pink-900/20 border-pink-500/20",
  cyan: "from-cyan-950/40 to-cyan-900/20 border-cyan-500/20",
  amber: "from-amber-950/40 to-amber-900/20 border-amber-500/20",
};

const borderMap = {
  blue: "border-blue-500/10 hover:border-blue-500/30",
  yellow: "border-yellow-500/10 hover:border-yellow-500/30",
  green: "border-green-500/10 hover:border-green-500/30",
  red: "border-red-500/10 hover:border-red-500/30",
  purple: "border-purple-500/10 hover:border-purple-500/30",
  pink: "border-pink-500/10 hover:border-pink-500/30",
  cyan: "border-cyan-500/10 hover:border-cyan-500/30",
  amber: "border-amber-500/10 hover:border-amber-500/30",
};

const textColorMap = {
  blue: "text-blue-100",
  yellow: "text-yellow-100",
  green: "text-green-100",
  red: "text-red-100",
  purple: "text-purple-100",
  pink: "text-pink-100",
  cyan: "text-cyan-100",
  amber: "text-amber-100",
};

interface KanbanBoardProps {
  columns: KanbanColumn[];
  gap?: "small" | "medium" | "large";
}

export function KanbanBoard({ columns, gap = "medium" }: KanbanBoardProps) {
  const gapClass =
    gap === "small" ? "gap-3" : gap === "large" ? "gap-6" : "gap-4";

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${gapClass}`}
    >
      {columns.map((column) => (
        <Card
          key={column.id}
          className={`bg-gradient-to-br ${colorMap[column.color]} border`}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>{column.title}</span>
              {column.count !== undefined && (
                <span className="text-sm font-semibold text-gray-400">
                  ({column.count})
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {column.items.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm">No items</p>
              </div>
            ) : (
              column.items.map((item) => (
                <div
                  key={item.id}
                  onClick={item.onClick}
                  className={`p-3 bg-black/30 rounded-lg border transition cursor-move ${borderMap[column.color]} ${item.onClick ? "cursor-pointer" : ""}`}
                >
                  <div className="flex items-start gap-2">
                    {item.icon && (
                      <div className="flex-shrink-0 mt-1">{item.icon}</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white text-sm truncate">
                        {item.title}
                      </p>
                      {item.subtitle && (
                        <p className="text-xs text-gray-400 mt-1 truncate">
                          {item.subtitle}
                        </p>
                      )}
                      {item.badge && (
                        <div className="mt-2">
                          <Badge
                            className={`bg-${column.color}-600/50 ${textColorMap[column.color]} text-xs`}
                          >
                            {item.badge}
                          </Badge>
                        </div>
                      )}
                      {item.metadata && (
                        <div className="mt-2 space-y-1">
                          {Object.entries(item.metadata).map(([key, value]) => (
                            <div
                              key={key}
                              className="flex justify-between text-xs text-gray-400"
                            >
                              <span>{key}:</span>
                              <span className="font-semibold text-white">
                                {value}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default KanbanBoard;
