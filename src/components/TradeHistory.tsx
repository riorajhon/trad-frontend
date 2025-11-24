import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const trades = [
  {
    pair: "BTC/USD",
    type: "BUY",
    entry: 44500,
    exit: 45234,
    profit: 734,
    status: "closed",
    time: "10:23 AM",
  },
  {
    pair: "ETH/USD",
    type: "SELL",
    entry: 3300,
    exit: 3245,
    profit: 55,
    status: "closed",
    time: "10:15 AM",
  },
  {
    pair: "BTC/USD",
    type: "BUY",
    entry: 45100,
    exit: null,
    profit: 134,
    status: "active",
    time: "09:45 AM",
  },
  {
    pair: "SOL/USD",
    type: "BUY",
    entry: 110,
    exit: 108,
    profit: -2,
    status: "closed",
    time: "09:30 AM",
  },
];

export const TradeHistory = () => {
  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
      <h3 className="text-lg font-semibold mb-4">Recent Trades</h3>
      <div className="space-y-3">
        {trades.map((trade, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors duration-200"
          >
            <div className="flex items-center gap-4 flex-1">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{trade.pair}</span>
                  <Badge
                    variant={trade.type === "BUY" ? "default" : "destructive"}
                    className={`text-xs ${
                      trade.type === "BUY"
                        ? "bg-profit/20 text-profit border-profit/30"
                        : "bg-loss/20 text-loss border-loss/30"
                    }`}
                  >
                    {trade.type}
                  </Badge>
                  {trade.status === "active" && (
                    <Badge variant="outline" className="text-xs">
                      Active
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Entry: ${trade.entry.toLocaleString()}
                  {trade.exit && ` → Exit: $${trade.exit.toLocaleString()}`}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p
                className={`font-semibold ${
                  trade.profit >= 0 ? "text-profit" : "text-loss"
                }`}
              >
                {trade.profit >= 0 ? "+" : ""}${trade.profit}
              </p>
              <p className="text-xs text-muted-foreground">{trade.time}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
