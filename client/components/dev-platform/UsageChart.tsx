import { useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface UsageChartProps {
  data: Record<string, number>; // { "2026-01-07": 120, "2026-01-06": 95, ... }
  title: string;
  chartType?: "line" | "bar";
}

export function UsageChart({ data, title, chartType = "line" }: UsageChartProps) {
  // Transform data for recharts
  const chartData = useMemo(() => {
    return Object.entries(data)
      .map(([date, count]) => ({
        date: new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        requests: count,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data]);

  // Calculate trend
  const trend = useMemo(() => {
    if (chartData.length < 2) return null;
    const recent = chartData.slice(-7).reduce((sum, d) => sum + d.requests, 0);
    const previous = chartData
      .slice(-14, -7)
      .reduce((sum, d) => sum + d.requests, 0);
    if (previous === 0) return null;
    const change = ((recent - previous) / previous) * 100;
    return { change, isPositive: change > 0 };
  }, [chartData]);

  if (chartData.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">{title}</h3>
        <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
          No usage data available
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        {trend && (
          <div
            className={`flex items-center gap-1.5 text-xs ${
              trend.isPositive ? "text-green-500" : "text-red-500"
            }`}
          >
            {trend.isPositive ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            <span>{Math.abs(trend.change).toFixed(1)}%</span>
          </div>
        )}
      </div>

      <ResponsiveContainer width="100%" height={250}>
        {chartType === "line" ? (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Line
              type="monotone"
              dataKey="requests"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--primary))", r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        ) : (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Bar dataKey="requests" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </Card>
  );
}
