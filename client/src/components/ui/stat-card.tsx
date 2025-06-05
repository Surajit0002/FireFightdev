import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  gradient: string;
  textColor?: string;
}

export default function StatCard({ title, value, icon: Icon, gradient, textColor = "text-foreground" }: StatCardProps) {
  return (
    <Card className={`bg-gradient-to-br from-card to-card/80 border-border/50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <p className={`text-2xl font-bold ${textColor}`}>
              {value}
            </p>
          </div>
          <div className={`w-12 h-12 ${gradient} rounded-xl flex items-center justify-center shadow-lg`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}