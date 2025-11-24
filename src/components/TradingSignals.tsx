import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown } from "lucide-react";

const signals = [
  {
    pair: "BTC/USD",
    signal: "BUY",
    strength: "Strong",
    price: 45234,
    target: 47500,
    time: "2m ago",
  },
  {
    pair: "ETH/USD",
    signal: "SELL",
    strength: "Medium",
    price: 3245,
    target: 3100,
    time: "5m ago",
  },
  {
    pair: "SOL/USD",
    signal: "BUY",
    strength: "Strong",
    price: 112,
    target: 125,
    time: "8m ago",
  },
];

export const TradingSignals = () => {
  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
      <h3 className="text-lg font-semibold mb-4">Trading Signals</h3>
      <div className="space-y-4">
        {signals.map((signal, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors duration-200"
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-2 rounded-full ${
                  signal.signal === "BUY" ? "bg-profit/20" : "bg-loss/20"
                }`}
              >
                {signal.signal === "BUY" ? (
                  <ArrowUp className="w-5 h-5 text-profit" />
                ) : (
                  <ArrowDown className="w-5 h-5 text-loss" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{signal.pair}</span>
                  <Badge
                    variant={signal.signal === "BUY" ? "default" : "destructive"}
                    className={
                      signal.signal === "BUY"
                        ? "bg-profit/20 text-profit border-profit/30"
                        : "bg-loss/20 text-loss border-loss/30"
                    }
                  >
                    {signal.signal}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {signal.strength}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Entry: ${signal.price.toLocaleString()} → Target: $
                  {signal.target.toLocaleString()}
                </p>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">{signal.time}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};
