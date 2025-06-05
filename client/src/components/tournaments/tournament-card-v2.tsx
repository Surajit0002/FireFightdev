
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import CountdownTimer from "@/components/ui/countdown-timer";
import { 
  Trophy, 
  Users, 
  Target, 
  Clock, 
  Zap, 
  Star, 
  Award, 
  DollarSign, 
  GamepadIcon, 
  Flame, 
  Shield,
  Crown,
  Swords,
  Eye,
  Play
} from "lucide-react";

interface TournamentCardV2Props {
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
  onClick?: () => void;
}

export default function TournamentCardV2({ tournament, onClick }: TournamentCardV2Props) {
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
        title: "🔥 Joined Successfully!",
        description: "Get ready for battle!",
      });
      setIsJoining(false);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Authentication Required",
          description: "Please login to join tournaments",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Join Failed",
        description: "Unable to join tournament. Try again.",
        variant: "destructive",
      });
      setIsJoining(false);
    },
  });

  // Enhanced color themes with neon accents
  const getAdvancedTheme = (id: string) => {
    const themes = [
      {
        name: 'Fire',
        primary: 'from-red-600 via-red-500 to-orange-500',
        secondary: 'from-red-500 to-orange-400',
        accent: 'bg-red-50 border-red-200',
        text: 'text-red-700',
        neon: 'shadow-red-500/30 hover:shadow-red-500/60',
        glow: 'drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]',
        bg: 'bg-gradient-to-br from-red-900/10 to-orange-900/10'
      },
      {
        name: 'Ocean',
        primary: 'from-blue-600 via-blue-500 to-cyan-500',
        secondary: 'from-blue-500 to-cyan-400',
        accent: 'bg-blue-50 border-blue-200',
        text: 'text-blue-700',
        neon: 'shadow-blue-500/30 hover:shadow-blue-500/60',
        glow: 'drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]',
        bg: 'bg-gradient-to-br from-blue-900/10 to-cyan-900/10'
      },
      {
        name: 'Electric',
        primary: 'from-yellow-500 via-orange-500 to-red-500',
        secondary: 'from-yellow-400 to-orange-400',
        accent: 'bg-yellow-50 border-yellow-200',
        text: 'text-yellow-700',
        neon: 'shadow-yellow-500/30 hover:shadow-yellow-500/60',
        glow: 'drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]',
        bg: 'bg-gradient-to-br from-yellow-900/10 to-orange-900/10'
      },
      {
        name: 'Forest',
        primary: 'from-green-600 via-green-500 to-emerald-500',
        secondary: 'from-green-500 to-emerald-400',
        accent: 'bg-green-50 border-green-200',
        text: 'text-green-700',
        neon: 'shadow-green-500/30 hover:shadow-green-500/60',
        glow: 'drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]',
        bg: 'bg-gradient-to-br from-green-900/10 to-emerald-900/10'
      },
      {
        name: 'Royal',
        primary: 'from-purple-600 via-purple-500 to-pink-500',
        secondary: 'from-purple-500 to-pink-400',
        accent: 'bg-purple-50 border-purple-200',
        text: 'text-purple-700',
        neon: 'shadow-purple-500/30 hover:shadow-purple-500/60',
        glow: 'drop-shadow-[0_0_8px_rgba(147,51,234,0.5)]',
        bg: 'bg-gradient-to-br from-purple-900/10 to-pink-900/10'
      },
      {
        name: 'Cosmic',
        primary: 'from-indigo-600 via-indigo-500 to-purple-500',
        secondary: 'from-indigo-500 to-purple-400',
        accent: 'bg-indigo-50 border-indigo-200',
        text: 'text-indigo-700',
        neon: 'shadow-indigo-500/30 hover:shadow-indigo-500/60',
        glow: 'drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]',
        bg: 'bg-gradient-to-br from-indigo-900/10 to-purple-900/10'
      }
    ];
    
    const index = parseInt(tournament.id) % themes.length;
    return themes[index];
  };

  const getTypeConfig = (type: string) => {
    switch (type.toLowerCase()) {
      case 'solo':
        return {
          icon: Target,
          label: 'SOLO',
          bgColor: 'bg-gradient-to-r from-yellow-500 to-amber-500',
          description: 'Individual Battle'
        };
      case 'duo':
        return {
          icon: Users,
          label: 'DUO',
          bgColor: 'bg-gradient-to-r from-pink-500 to-rose-500',
          description: 'Team of 2'
        };
      case 'squad':
        return {
          icon: Shield,
          label: 'SQUAD',
          bgColor: 'bg-gradient-to-r from-indigo-500 to-purple-500',
          description: 'Team of 4'
        };
      default:
        return {
          icon: Star,
          label: type.toUpperCase(),
          bgColor: 'bg-gradient-to-r from-gray-500 to-slate-500',
          description: 'Custom Mode'
        };
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'live':
        return {
          label: 'LIVE NOW',
          bgColor: 'bg-gradient-to-r from-red-600 to-red-500',
          animation: 'animate-pulse',
          icon: Zap,
          textColor: 'text-red-600'
        };
      case 'upcoming':
        return {
          label: 'UPCOMING',
          bgColor: 'bg-gradient-to-r from-emerald-600 to-green-500',
          animation: '',
          icon: Clock,
          textColor: 'text-green-600'
        };
      case 'completed':
        return {
          label: 'FINISHED',
          bgColor: 'bg-gradient-to-r from-gray-600 to-slate-500',
          animation: '',
          icon: Award,
          textColor: 'text-gray-600'
        };
      default:
        return {
          label: 'ACTIVE',
          bgColor: 'bg-gradient-to-r from-blue-600 to-blue-500',
          animation: '',
          icon: GamepadIcon,
          textColor: 'text-blue-600'
        };
    }
  };

  const handleJoin = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsJoining(true);
    joinTournamentMutation.mutate();
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const isFull = tournament.currentParticipants >= tournament.maxParticipants;
  const isUpcoming = tournament.status === 'upcoming';
  const participationPercentage = (tournament.currentParticipants / tournament.maxParticipants) * 100;
  
  const theme = getAdvancedTheme(tournament.id);
  const typeConfig = getTypeConfig(tournament.type);
  const statusConfig = getStatusConfig(tournament.status);
  const TypeIcon = typeConfig.icon;
  const StatusIcon = statusConfig.icon;

  return (
    <Card 
      className={`group relative overflow-hidden bg-white border-2 border-gray-100 shadow-lg hover:shadow-2xl ${theme.neon} transition-all duration-700 transform hover:-translate-y-2 hover:scale-[1.02] cursor-pointer rounded-3xl ${
        isHovered ? 'animate-pulse' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Animated background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.primary} opacity-0 group-hover:opacity-10 transition-opacity duration-700`} />
      
      {/* Glowing border effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
      
      {/* Header Section with Banner */}
      <div className="relative h-36 sm:h-40 overflow-hidden rounded-t-3xl">
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.primary} opacity-95`} />
        
        {/* Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
        
        {/* Tournament Image or Default */}
        {tournament.imageUrl ? (
          <img 
            src={tournament.imageUrl} 
            alt={tournament.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
          />
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="text-center text-white z-10">
              <Flame className={`h-12 w-12 sm:h-14 sm:w-14 mx-auto mb-2 ${theme.glow} animate-bounce`} />
              <p className="text-sm font-black tracking-wider">FIRE FIGHT</p>
            </div>
          </div>
        )}
        
        {/* Status Badge - Top Right */}
        <div className="absolute top-3 right-3">
          <Badge className={`${statusConfig.bgColor} text-white border-0 shadow-xl ${statusConfig.animation} px-3 py-1.5 text-xs font-black tracking-widest rounded-full`}>
            <StatusIcon className="mr-1.5 h-3.5 w-3.5" />
            {statusConfig.label}
          </Badge>
        </div>
        
        {/* Type Badge - Top Left */}
        <div className="absolute top-3 left-3">
          <Badge className={`${typeConfig.bgColor} text-white border-0 shadow-xl px-3 py-1.5 text-xs font-black tracking-widest rounded-full`}>
            <TypeIcon className="mr-1.5 h-3.5 w-3.5" />
            {typeConfig.label}
          </Badge>
        </div>

        {/* Participation indicator */}
        {!isFull && isUpcoming && (
          <div className="absolute bottom-3 left-3">
            <div className="flex items-center space-x-1 bg-black/30 backdrop-blur-sm rounded-full px-2 py-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
              <span className="text-white text-xs font-medium">Open</span>
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <CardContent className="p-5 space-y-4">
        {/* Tournament Title */}
        <div>
          <h3 className="font-black text-lg sm:text-xl text-gray-900 leading-tight group-hover:text-gray-800 transition-colors line-clamp-2 mb-1">
            {tournament.name}
          </h3>
          <p className="text-sm text-gray-500 font-medium">{typeConfig.description}</p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Entry Fee */}
          <div className={`${theme.accent} rounded-2xl p-4 border-2 group-hover:border-opacity-50 transition-all duration-300`}>
            <div className="flex items-center space-x-2">
              <div className={`p-2 rounded-xl bg-gradient-to-br ${theme.secondary}`}>
                <DollarSign className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold tracking-wider uppercase">Entry</p>
                <p className={`text-lg font-black ${theme.text}`}>₹{tournament.entryFee}</p>
              </div>
            </div>
          </div>
          
          {/* Prize Pool */}
          <div className={`${theme.accent} rounded-2xl p-4 border-2 group-hover:border-opacity-50 transition-all duration-300`}>
            <div className="flex items-center space-x-2">
              <div className={`p-2 rounded-xl bg-gradient-to-br ${theme.secondary}`}>
                <Trophy className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold tracking-wider uppercase">Prize</p>
                <p className={`text-lg font-black ${theme.text}`}>₹{tournament.prizePool}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Players Progress Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-bold text-gray-700 tracking-wide">PLAYERS</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-black text-gray-800">
                {tournament.currentParticipants}/{tournament.maxParticipants}
              </span>
              {isFull && (
                <Badge className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  FULL
                </Badge>
              )}
            </div>
          </div>
          
          {/* Enhanced Progress Bar */}
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
              <div 
                className={`h-full bg-gradient-to-r ${theme.secondary} rounded-full transition-all duration-1500 ease-out relative overflow-hidden`}
                style={{ width: `${participationPercentage}%` }}
              >
                <div className="absolute inset-0 bg-white/30 animate-pulse" />
              </div>
            </div>
            <div className="absolute inset-0 rounded-full ring-1 ring-gray-300 ring-opacity-50" />
          </div>
        </div>
        
        {/* Countdown Timer for Upcoming */}
        {isUpcoming && (
          <div className={`${theme.bg} rounded-2xl p-4 border-2 ${theme.accent.includes('border') ? theme.accent.split(' ')[1] : 'border-gray-200'} group-hover:border-opacity-50 transition-all duration-300`}>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Clock className={`h-4 w-4 ${theme.text}`} />
                <span className={`text-sm font-bold ${theme.text} tracking-wider uppercase`}>Starting In</span>
              </div>
              <CountdownTimer 
                targetDate={tournament.startTime}
                className={`font-mono text-lg font-black ${theme.text} tracking-wider`}
              />
            </div>
          </div>
        )}
        
        {/* Action Button */}
        <Button
          className={`w-full h-12 font-black text-white border-0 shadow-xl hover:shadow-2xl transform transition-all duration-500 rounded-2xl text-sm tracking-wider ${
            tournament.status === 'live' 
              ? 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 hover:scale-105 animate-pulse'
              : tournament.status === 'upcoming'
              ? `bg-gradient-to-r ${theme.primary} hover:scale-105 hover:shadow-2xl ${theme.neon}`
              : 'bg-gradient-to-r from-gray-500 to-gray-400 cursor-not-allowed'
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
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span className="text-sm">JOINING...</span>
            </div>
          ) : isFull ? (
            <div className="flex items-center justify-center space-x-3">
              <Users className="h-5 w-5" />
              <span className="text-sm">TOURNAMENT FULL</span>
            </div>
          ) : tournament.status === 'live' ? (
            <div className="flex items-center justify-center space-x-3">
              <Play className="h-5 w-5" />
              <span className="text-sm font-black tracking-widest">JOIN LIVE BATTLE</span>
            </div>
          ) : tournament.status === 'upcoming' ? (
            <div className="flex items-center justify-center space-x-3">
              <Swords className="h-5 w-5" />
              <span className="text-sm font-black tracking-widest">ENTER TOURNAMENT</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-3">
              <Eye className="h-5 w-5" />
              <span className="text-sm">VIEW RESULTS</span>
            </div>
          )}
        </Button>
        
        {/* Floating Action Indicator */}
        {isUpcoming && !isFull && (
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${theme.secondary} animate-ping`} />
          </div>
        )}
      </CardContent>
      
      {/* Hover Glow Effect */}
      <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-r ${theme.primary} blur-xl -z-10 transform scale-110`} />
    </Card>
  );
}
