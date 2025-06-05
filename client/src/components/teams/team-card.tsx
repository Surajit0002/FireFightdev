
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Shield, Users, Crown, MoreVertical, Eye, Edit, Trash2, UserPlus } from "lucide-react";

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
  const memberCount = Math.floor(Math.random() * team.maxMembers) + 1;

  const getTypeConfig = (type: string) => {
    switch (type.toLowerCase()) {
      case 'duo':
        return {
          bgGradient: 'from-blue-500/20 via-blue-400/10 to-cyan-500/20',
          borderColor: 'border-blue-400/30',
          textColor: 'text-blue-100',
          badgeColor: 'bg-blue-500/80 text-white',
          iconColor: 'text-blue-400'
        };
      case 'squad':
        return {
          bgGradient: 'from-purple-500/20 via-purple-400/10 to-pink-500/20',
          borderColor: 'border-purple-400/30',
          textColor: 'text-purple-100',
          badgeColor: 'bg-purple-500/80 text-white',
          iconColor: 'text-purple-400'
        };
      default:
        return {
          bgGradient: 'from-gray-500/20 via-gray-400/10 to-slate-500/20',
          borderColor: 'border-gray-400/30',
          textColor: 'text-gray-100',
          badgeColor: 'bg-gray-500/80 text-white',
          iconColor: 'text-gray-400'
        };
    }
  };

  const typeConfig = getTypeConfig(team.type);

  // Mock member data for profile pics
  const mockMembers = Array.from({ length: memberCount }, (_, i) => ({
    id: `member-${i}`,
    name: `P${i + 1}`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=player${i + 1}`
  }));

  return (
    <Card className={`bg-gradient-to-br ${typeConfig.bgGradient} ${typeConfig.borderColor} border backdrop-blur-sm hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1 w-full max-w-sm`}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <Avatar className="h-10 w-10 border-2 border-white/20 shadow-md">
              <AvatarImage src={team.logoUrl} />
              <AvatarFallback className="bg-dark-card text-foreground">
                <Shield className={`h-5 w-5 ${typeConfig.iconColor}`} />
              </AvatarFallback>
            </Avatar>
            
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-1">
                <h4 className={`font-bold text-sm ${typeConfig.textColor} truncate`}>
                  {team.name}
                </h4>
                {isLeader && <Crown className="h-3 w-3 text-yellow-400 flex-shrink-0" />}
              </div>
              <p className={`text-xs ${typeConfig.textColor} opacity-80`}>
                {team.type.charAt(0).toUpperCase() + team.type.slice(1)} Team
              </p>
            </div>
          </div>

          {/* 3 dot menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-white/10">
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem className="cursor-pointer text-xs">
                <Eye className="mr-2 h-3 w-3" />
                View
              </DropdownMenuItem>
              {isLeader && (
                <DropdownMenuItem className="cursor-pointer text-xs">
                  <Edit className="mr-2 h-3 w-3" />
                  Edit
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive text-xs">
                <Trash2 className="mr-2 h-3 w-3" />
                {isLeader ? "Delete" : "Leave"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Status badges */}
        <div className="flex flex-wrap gap-1 mb-3">
          <Badge className={`${typeConfig.badgeColor} text-xs px-2 py-0.5`}>
            {isLeader ? "LEADER" : "MEMBER"}
          </Badge>
          <Badge variant={team.isActive ? "default" : "secondary"} className="bg-dark-card text-foreground text-xs px-2 py-0.5">
            {team.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>

        {/* Member count */}
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-medium ${typeConfig.textColor} flex items-center`}>
            <Users className="mr-1 h-3 w-3" />
            {memberCount}/{team.maxMembers}
          </span>
          {memberCount < team.maxMembers && isLeader && (
            <Button size="sm" variant="outline" className="h-6 text-xs px-2 bg-white/5 hover:bg-white/10 border-white/20">
              <UserPlus className="mr-1 h-2 w-2" />
              Add
            </Button>
          )}
        </div>

        {/* Member avatars */}
        <div className="space-y-2">
          <h5 className={`text-xs font-semibold ${typeConfig.textColor}`}>Members</h5>
          <div className="flex items-center justify-center space-x-1">
            {mockMembers.map((member, index) => (
              <Avatar key={member.id} className="h-7 w-7 border border-white/20">
                <AvatarImage src={member.avatar} />
                <AvatarFallback className="bg-dark-card text-foreground text-xs">
                  {member.name}
                </AvatarFallback>
              </Avatar>
            ))}
            
            {/* Empty slots */}
            {Array.from({ length: team.maxMembers - memberCount }, (_, i) => (
              <div 
                key={`empty-${i}`} 
                className="h-7 w-7 border border-dashed border-white/40 rounded-full flex items-center justify-center bg-white/5"
              >
                <UserPlus className="h-3 w-3 text-white/40" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
