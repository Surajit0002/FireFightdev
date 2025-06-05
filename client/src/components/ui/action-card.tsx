import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface ActionCardProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  gradient: string;
  children: React.ReactNode;
}

export default function ActionCard({ title, description, icon: Icon, gradient, children }: ActionCardProps) {
  return (
    <Card className="bg-gradient-to-br from-card to-card/80 border-border/50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-2xl font-bold">
          <div className={`w-8 h-8 ${gradient} rounded-lg flex items-center justify-center mr-3 shadow-lg`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          {title}
        </CardTitle>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}