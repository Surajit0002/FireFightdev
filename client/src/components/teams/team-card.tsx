import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Shield, Users, Settings, LogOut, Crown } from "lucide-react";

interface TeamCardProps {
  team: {
    id: string;
    name: string;
    type: string;
    maxMembers: number;
    leaderId: string;
    logoUrl?: string;
    isActive: boolean;
  };
  userRole?: string;
}

export default function TeamCard({ team, userRole = "member" }: TeamCardProps) {
  const isLeader = userRole === "leader";
  const memberCount = Math.floor(Math.random() * team.maxMembers) + 1; // Mock member count

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'duo':
        return 'bg-accent text-background';
      case 'squad':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="bg-muted border-border hover:border-primary/50 transition-all">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarImage src={team.logoUrl} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                <Shield className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold flex items-center space-x-2">
                <span>{team.name}</span>
                {isLeader && <Crown className="h-4 w-4 text-yellow-500" />}
              </h4>
              <p className="text-sm text-muted-foreground capitalize">{team.type} Team</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getTypeColor(team.type)}>
              {isLeader ? "LEADER" : "MEMBER"}
            </Badge>
          </div>
        </div>
        
        <div className="flex justify-between items-center text-sm mb-4">
          <span className="text-muted-foreground flex items-center">
            <Users className="mr-1 h-3 w-3" />
            Members: <span className="text-foreground ml-1">{memberCount}/{team.maxMembers}</span>
          </span>
          <Badge variant={team.isActive ? "default" : "secondary"}>
            {team.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" className="flex-1">
            <Settings className="mr-1 h-3 w-3" />
            {isLeader ? "Manage" : "View"}
          </Button>
          <Button size="sm" variant="outline" className="text-destructive hover:text-destructive">
            <LogOut className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
