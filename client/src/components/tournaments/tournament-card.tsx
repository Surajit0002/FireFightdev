
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import CountdownTimer from "@/components/ui/countdown-timer";
import { Trophy, Users, Target, Clock, Zap, Star, Award, DollarSign, GamepadIcon, Flame, Shield } from "lucide-react";

interface TournamentCardProps {
  tournament: {
    id: string;
    name: string;
    type: string;
    entryFee: string;
    prizePool: string;
    maxParticipants: number;
    currentParticipants: number;
    status: string;
    startTime: string;
    imageUrl?: string;
  };
}

export default function TournamentCard({ tournament }: TournamentCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isJoining, setIsJoining] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const joinTournamentMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/tournaments/${tournament.id}/join`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments"] });
      toast({
        title: "🎉 Tournament Joined!",
        description: "Welcome to the battlefield!",
      });
      setIsJoining(false);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to join tournament. Please try again.",
        variant: "destructive",
      });
      setIsJoining(false);
    },
  });

  // Dynamic theme colors rotation
  const getThemeColors = (id: string) => {
    const themes = [
      {
        primary: 'from-red-500 to-red-700',
        secondary: 'from-red-400 to-red-600',
        accent: 'bg-red-100',
        text: 'text-red-700',
        border: 'border-red-300',
        neon: 'shadow-red-500/50',
        bg: 'bg-gradient-to-br from-red-50 to-red-100'
      },
      {
        primary: 'from-blue-500 to-blue-700',
        secondary: 'from-blue-400 to-blue-600',
        accent: 'bg-blue-100',
        text: 'text-blue-700',
        border: 'border-blue-300',
        neon: 'shadow-blue-500/50',
        bg: 'bg-gradient-to-br from-blue-50 to-blue-100'
      },
      {
        primary: 'from-orange-500 to-orange-700',
        secondary: 'from-orange-400 to-orange-600',
        accent: 'bg-orange-100',
        text: 'text-orange-700',
        border: 'border-orange-300',
        neon: 'shadow-orange-500/50',
        bg: 'bg-gradient-to-br from-orange-50 to-orange-100'
      },
      {
        primary: 'from-green-500 to-green-700',
        secondary: 'from-green-400 to-green-600',
        accent: 'bg-green-100',
        text: 'text-green-700',
        border: 'border-green-300',
        neon: 'shadow-green-500/50',
        bg: 'bg-gradient-to-br from-green-50 to-green-100'
      },
      {
        primary: 'from-purple-500 to-purple-700',
        secondary: 'from-purple-400 to-purple-600',
        accent: 'bg-purple-100',
        text: 'text-purple-700',
        border: 'border-purple-300',
        neon: 'shadow-purple-500/50',
        bg: 'bg-gradient-to-br from-purple-50 to-purple-100'
      },
      {
        primary: 'from-cyan-500 to-cyan-700',
        secondary: 'from-cyan-400 to-cyan-600',
        accent: 'bg-cyan-100',
        text: 'text-cyan-700',
        border: 'border-cyan-300',
        neon: 'shadow-cyan-500/50',
        bg: 'bg-gradient-to-br from-cyan-50 to-cyan-100'
      }
    ];
    
    const index = parseInt(id) % themes.length;
    return themes[index];
  };

  const getTypeConfig = (type: string) => {
    switch (type.toLowerCase()) {
      case 'solo':
        return {
          icon: Target,
          label: 'SOLO',
          bgColor: 'bg-gradient-to-r from-yellow-400 to-yellow-600'
        };
      case 'duo':
        return {
          icon: Users,
          label: 'DUO',
          bgColor: 'bg-gradient-to-r from-pink-400 to-pink-600'
        };
      case 'squad':
        return {
          icon: Shield,
          label: 'SQUAD',
          bgColor: 'bg-gradient-to-r from-indigo-400 to-indigo-600'
        };
      default:
        return {
          icon: Star,
          label: type.toUpperCase(),
          bgColor: 'bg-gradient-to-r from-gray-400 to-gray-600'
        };
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'live':
        return {
          label: 'LIVE',
          bgColor: 'bg-gradient-to-r from-red-500 to-red-600',
          animation: 'animate-pulse',
          icon: Zap
        };
      case 'upcoming':
        return {
          label: 'UPCOMING',
          bgColor: 'bg-gradient-to-r from-green-500 to-green-600',
          animation: '',
          icon: Clock
        };
      case 'completed':
        return {
          label: 'ENDED',
          bgColor: 'bg-gradient-to-r from-gray-500 to-gray-600',
          animation: '',
          icon: Award
        };
      default:
        return {
          label: 'ACTIVE',
          bgColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
          animation: '',
          icon: GamepadIcon
        };
    }
  };

  const handleJoin = () => {
    setIsJoining(true);
    joinTournamentMutation.mutate();
  };

  const isFull = tournament.currentParticipants >= tournament.maxParticipants;
  const isUpcoming = tournament.status === 'upcoming';
  const participationPercentage = (tournament.currentParticipants / tournament.maxParticipants) * 100;
  
  const theme = getThemeColors(tournament.id);
  const typeConfig = getTypeConfig(tournament.type);
  const statusConfig = getStatusConfig(tournament.status);
  const TypeIcon = typeConfig.icon;
  const StatusIcon = statusConfig.icon;

  return (
    <Card 
      className={`group relative overflow-hidden bg-white border-2 ${theme.border} shadow-xl hover:shadow-2xl ${theme.neon} transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 ${
        isHovered ? 'animate-pulse' : ''
      } rounded-2xl`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Dynamic background overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.primary} opacity-5 group-hover:opacity-15 transition-opacity duration-300`} />
      
      {/* Tournament Banner Image */}
      <div className="relative h-32 sm:h-36 overflow-hidden rounded-t-2xl">
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.primary} opacity-90`} />
        {tournament.imageUrl ? (
          <img 
            src={tournament.imageUrl} 
            alt={tournament.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-white">
              <Flame className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-2 drop-shadow-lg animate-bounce" />
              <p className="text-sm font-bold drop-shadow tracking-wider">FIRE FIGHT</p>
            </div>
          </div>
        )}
        
        {/* Status Badge - Top Right */}
        <div className="absolute top-2 right-2">
          <Badge className={`${statusConfig.bgColor} text-white border-0 shadow-lg ${statusConfig.animation} px-2 py-1 text-xs font-bold tracking-wider`}>
            <StatusIcon className="mr-1 h-3 w-3" />
            {statusConfig.label}
          </Badge>
        </div>
        
        {/* Type Badge - Top Left */}
        <div className="absolute top-2 left-2">
          <Badge className={`${typeConfig.bgColor} text-white border-0 shadow-lg px-2 py-1 text-xs font-bold tracking-wider`}>
            <TypeIcon className="mr-1 h-3 w-3" />
            {typeConfig.label}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-2 pt-3">
        {/* Tournament Title */}
        <h3 className="font-bold text-base sm:text-lg text-gray-900 leading-tight group-hover:text-gray-800 transition-colors line-clamp-2">
          {tournament.name}
        </h3>
      </CardHeader>
      
      <CardContent className="space-y-3 px-4 pb-4">
        {/* Entry Fee & Prize Pool */}
        <div className="grid grid-cols-2 gap-2">
          <div className={`${theme.bg} rounded-xl p-3 ${theme.border} border`}>
            <div className="flex items-center space-x-1">
              <DollarSign className={`h-4 w-4 ${theme.text}`} />
              <div>
                <p className="text-xs text-gray-600 font-medium">Entry</p>
                <p className={`text-sm font-bold ${theme.text}`}>₹{tournament.entryFee}</p>
              </div>
            </div>
          </div>
          
          <div className={`${theme.bg} rounded-xl p-3 ${theme.border} border`}>
            <div className="flex items-center space-x-1">
              <Trophy className={`h-4 w-4 ${theme.text}`} />
              <div>
                <p className="text-xs text-gray-600 font-medium">Prize</p>
                <p className={`text-sm font-bold ${theme.text}`}>₹{tournament.prizePool}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Players Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-1">
              <Users className="h-3.5 w-3.5 text-gray-600" />
              <span className="text-xs font-medium text-gray-700">Players</span>
            </div>
            <span className="text-xs font-bold text-gray-800">
              {tournament.currentParticipants}/{tournament.maxParticipants}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${theme.secondary} rounded-full transition-all duration-1000 ease-out`}
              style={{ width: `${participationPercentage}%` }}
            />
          </div>
        </div>
        
        {/* Countdown Timer */}
        {isUpcoming && (
          <div className={`${theme.bg} rounded-xl p-3 ${theme.border} border`}>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Clock className={`h-3.5 w-3.5 ${theme.text}`} />
                <span className={`text-xs font-medium ${theme.text}`}>Starts in</span>
              </div>
              <CountdownTimer 
                targetDate={tournament.startTime}
                className={`font-mono text-sm font-bold ${theme.text}`}
              />
            </div>
          </div>
        )}
        
        {/* Join Button */}
        <Button
          className={`w-full h-10 font-bold text-white border-0 shadow-lg hover:shadow-xl transform transition-all duration-300 rounded-xl ${
            tournament.status === 'live' 
              ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:scale-105 animate-pulse'
              : tournament.status === 'upcoming'
              ? `bg-gradient-to-r ${theme.primary} hover:scale-105 hover:shadow-2xl ${theme.neon}`
              : 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed'
          } ${isHovered && !isFull && isUpcoming ? 'animate-bounce' : ''}`}
          onClick={handleJoin}
          disabled={
            !isUpcoming || 
            isFull || 
            isJoining || 
            joinTournamentMutation.isPending
          }
        >
          {isJoining || joinTournamentMutation.isPending ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span className="text-sm">Joining...</span>
            </div>
          ) : isFull ? (
            <div className="flex items-center justify-center space-x-2">
              <Users className="h-4 w-4" />
              <span className="text-sm">FULL</span>
            </div>
          ) : tournament.status === 'live' ? (
            <div className="flex items-center justify-center space-x-2">
              <Zap className="h-4 w-4" />
              <span className="text-sm font-bold tracking-wider">JOIN LIVE</span>
            </div>
          ) : tournament.status === 'upcoming' ? (
            <div className="flex items-center justify-center space-x-2">
              <Flame className="h-4 w-4" />
              <span className="text-sm font-bold tracking-wider">JOIN NOW</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <Award className="h-4 w-4" />
              <span className="text-sm">ENDED</span>
            </div>
          )}
        </Button>
        
        {/* Floating notification dot */}
        {isUpcoming && !isFull && (
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${theme.secondary} animate-ping`} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
