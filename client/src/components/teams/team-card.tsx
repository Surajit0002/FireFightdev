
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
import { Shield, Users, Settings, LogOut, Crown, MoreVertical, Eye, Edit, Trash2, UserPlus } from "lucide-react";

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
          bgColor: 'from-blue-100 to-blue-200',
          borderColor: 'border-blue-300',
          textColor: 'text-blue-800',
          badgeColor: 'bg-blue-500 text-white'
        };
      case 'squad':
        return {
          bgColor: 'from-purple-100 to-purple-200',
          borderColor: 'border-purple-300',
          textColor: 'text-purple-800',
          badgeColor: 'bg-purple-500 text-white'
        };
      default:
        return {
          bgColor: 'from-gray-100 to-gray-200',
          borderColor: 'border-gray-300',
          textColor: 'text-gray-800',
          badgeColor: 'bg-gray-500 text-white'
        };
    }
  };

  const typeConfig = getTypeConfig(team.type);

  // Mock member data for profile pics
  const mockMembers = Array.from({ length: memberCount }, (_, i) => ({
    id: `member-${i}`,
    name: `Player ${i + 1}`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=player${i + 1}`
  }));

  return (
    <Card className={`bg-gradient-to-br ${typeConfig.bgColor} ${typeConfig.borderColor} border-2 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
      <CardContent className="p-5">
        {/* Header with logo/info left, menu right */}
        <div className="flex items-start justify-between mb-4">
          {/* Left side - Logo and team info */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-14 w-14 border-3 border-white shadow-lg">
              <AvatarImage src={team.logoUrl} />
              <AvatarFallback className="bg-white text-gray-700 font-bold">
                <Shield className="h-7 w-7" />
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h4 className={`font-bold text-lg ${typeConfig.textColor}`}>
                  {team.name}
                </h4>
                {isLeader && <Crown className="h-5 w-5 text-yellow-600" />}
              </div>
              
              <p className={`text-sm font-medium ${typeConfig.textColor} opacity-80`}>
                {team.type.charAt(0).toUpperCase() + team.type.slice(1)} Team
              </p>
              
              <div className="flex items-center space-x-3">
                <Badge className={typeConfig.badgeColor}>
                  {isLeader ? "LEADER" : "MEMBER"}
                </Badge>
                <Badge variant={team.isActive ? "default" : "secondary"} className="bg-white text-gray-700">
                  {team.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Right side - 3 dot menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-white/20">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem className="cursor-pointer">
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              {isLeader && (
                <DropdownMenuItem className="cursor-pointer">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                {isLeader ? "Delete" : "Leave"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Member count info */}
        <div className="flex justify-between items-center mb-4">
          <span className={`text-sm font-medium ${typeConfig.textColor} flex items-center`}>
            <Users className="mr-2 h-4 w-4" />
            Members: {memberCount}/{team.maxMembers}
          </span>
        </div>

        {/* Member profile pics row */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h5 className={`text-sm font-semibold ${typeConfig.textColor}`}>Team Members</h5>
            {memberCount < team.maxMembers && isLeader && (
              <Button size="sm" variant="outline" className="h-7 text-xs bg-white/50 hover:bg-white/70">
                <UserPlus className="mr-1 h-3 w-3" />
                Add
              </Button>
            )}
          </div>
          
          <div className="flex items-center space-x-2 overflow-x-auto pb-1">
            {mockMembers.map((member, index) => (
              <div key={member.id} className="flex flex-col items-center space-y-1 min-w-0">
                <Avatar className="h-10 w-10 border-2 border-white shadow-md">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback className="bg-white text-gray-600 text-xs">
                    P{index + 1}
                  </AvatarFallback>
                </Avatar>
                <span className={`text-xs font-medium ${typeConfig.textColor} truncate max-w-16`}>
                  {member.name}
                </span>
              </div>
            ))}
            
            {/* Empty slots */}
            {Array.from({ length: team.maxMembers - memberCount }, (_, i) => (
              <div key={`empty-${i}`} className="flex flex-col items-center space-y-1">
                <div className="h-10 w-10 border-2 border-dashed border-white/60 rounded-full flex items-center justify-center bg-white/20">
                  <UserPlus className="h-4 w-4 text-white/60" />
                </div>
                <span className="text-xs text-white/60">Empty</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
