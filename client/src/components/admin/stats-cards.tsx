import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, Trophy, DollarSign } from "lucide-react";

export default function StatsCards() {
  // Mock stats data - in real app this would come from API
  const stats = [
    {
      title: "Total Revenue",
      value: "₹1,23,450",
      change: "+12.5%",
      icon: DollarSign,
      color: "neon-green",
    },
    {
      title: "Active Users",
      value: "2,847",
      change: "+8.2%",
      icon: Users,
      color: "neon-blue",
    },
    {
      title: "Live Tournaments",
      value: "12",
      change: "+3",
      icon: Trophy,
      color: "neon-red",
    },
    {
      title: "Growth Rate",
      value: "18.4%",
      change: "+2.1%",
      icon: TrendingUp,
      color: "text-foreground",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-primary">{stat.change}</span> from last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                  <Icon className="h-6 w-6 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
