import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
    period: string;
  };
  className?: string;
}

export function StatsCard({ title, value, icon, trend, className }: StatsCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
          </div>
          <div className="p-3 bg-primary/10 rounded-full">
            {icon}
          </div>
        </div>
        {trend && (
          <p className="text-sm text-muted-foreground mt-2">
            <span className={trend.isPositive ? "text-emerald-500" : "text-destructive"}>
              {trend.value}
            </span>{" "}
            {trend.period}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
