import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Play, Pause, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const BotControls = () => {
  const [isActive, setIsActive] = useState(true);
  const [autoTrade, setAutoTrade] = useState(true);
  const { toast } = useToast();

  const handleToggleBot = () => {
    setIsActive(!isActive);
    toast({
      title: isActive ? "Bot Paused" : "Bot Activated",
      description: isActive
        ? "Trading bot has been paused"
        : "Trading bot is now active and monitoring markets",
    });
  };

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Bot Controls</h3>
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            isActive
              ? "bg-profit/20 text-profit"
              : "bg-muted/50 text-muted-foreground"
          }`}
        >
          {isActive ? "● Active" : "○ Paused"}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              {isActive ? (
                <Pause className="w-5 h-5 text-primary" />
              ) : (
                <Play className="w-5 h-5 text-primary" />
              )}
            </div>
            <div>
              <Label className="text-sm font-medium">Bot Status</Label>
              <p className="text-xs text-muted-foreground">
                {isActive ? "Currently monitoring markets" : "Trading paused"}
              </p>
            </div>
          </div>
          <Button
            onClick={handleToggleBot}
            variant={isActive ? "destructive" : "default"}
            size="sm"
          >
            {isActive ? "Pause" : "Start"}
          </Button>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
          <div>
            <Label htmlFor="auto-trade" className="text-sm font-medium">
              Auto Trading
            </Label>
            <p className="text-xs text-muted-foreground">
              Execute trades automatically
            </p>
          </div>
          <Switch
            id="auto-trade"
            checked={autoTrade}
            onCheckedChange={setAutoTrade}
          />
        </div>

        <Button variant="outline" className="w-full" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Configure Strategy
        </Button>
      </div>
    </Card>
  );
};
