import { Card } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Activity } from "lucide-react";

const metrics = [
  {
    label: "Total Profit",
    value: "+$12,453",
    change: "+23.5%",
    trend: "up",
    icon: TrendingUp,
  },
  {
    label: "Win Rate",
    value: "67.8%",
    change: "+5.2%",
    trend: "up",
    icon: Activity,
  },
  {
    label: "Active Trades",
    value: "8",
    change: "2 pending",
    trend: "neutral",
    icon: Activity,
  },
  {
    label: "Today's P&L",
    value: "+$1,234",
    change: "+3.2%",
    trend: "up",
    icon: TrendingUp,
  },
];

export const PerformanceMetrics = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card
            key={index}
            className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              {metric.trend !== "neutral" && (
                <div
                  className={`flex items-center text-sm ${
                    metric.trend === "up" ? "text-profit" : "text-loss"
                  }`}
                >
                  {metric.trend === "up" ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {metric.change}
                </div>
              )}
            </div>
            <h3 className="text-sm text-muted-foreground mb-1">{metric.label}</h3>
            <p className="text-2xl font-bold">{metric.value}</p>
          </Card>
        );
      })}
    </div>
  );
};
