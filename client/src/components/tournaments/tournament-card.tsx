
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
  MapPin,
  Calendar,
  TrendingUp,
  Eye,
  Swords,
  Timer,
  Gift,
  Medal,
  Play,
  Info,
  Settings
} from "lucide-react";

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
    gameMode?: string;
    mapName?: string;
    difficulty?: string;
    rules?: string;
    firstPrize?: string;
    secondPrize?: string;
    thirdPrize?: string;
    sponsorName?: string;
    registrationDeadline?: string;
  };
}

export default function TournamentCard({ tournament }: TournamentCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isJoining, setIsJoining] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const joinTournamentMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/tournaments/${tournament.id}/join`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments"] });
      toast({
        title: "🔥 Tournament Joined!",
        description: "Welcome to the battlefield! Good luck!",
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
        description: "Unable to join tournament. Please try again.",
        variant: "destructive",
      });
      setIsJoining(false);
    },
  });

  // Enhanced theme system with more variety
  const getAdvancedTheme = (id: string) => {
    const themes = [
      {
        name: 'Fire Dragon',
        primary: 'from-red-600 via-orange-500 to-yellow-500',
        secondary: 'from-red-500 to-orange-400',
        accent: 'bg-gradient-to-br from-red-50 to-orange-50 border-red-200',
        text: 'text-red-700',
        neon: 'shadow-red-500/40 hover:shadow-red-500/70',
        glow: 'drop-shadow-[0_0_12px_rgba(239,68,68,0.6)]',
        bg: 'bg-gradient-to-br from-red-900/10 to-orange-900/10',
        pattern: 'bg-red-100'
      },
      {
        name: 'Ocean Storm',
        primary: 'from-blue-600 via-cyan-500 to-teal-500',
        secondary: 'from-blue-500 to-cyan-400',
        accent: 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200',
        text: 'text-blue-700',
        neon: 'shadow-blue-500/40 hover:shadow-blue-500/70',
        glow: 'drop-shadow-[0_0_12px_rgba(59,130,246,0.6)]',
        bg: 'bg-gradient-to-br from-blue-900/10 to-cyan-900/10',
        pattern: 'bg-blue-100'
      },
      {
        name: 'Electric Thunder',
        primary: 'from-purple-600 via-violet-500 to-indigo-500',
        secondary: 'from-purple-500 to-violet-400',
        accent: 'bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200',
        text: 'text-purple-700',
        neon: 'shadow-purple-500/40 hover:shadow-purple-500/70',
        glow: 'drop-shadow-[0_0_12px_rgba(147,51,234,0.6)]',
        bg: 'bg-gradient-to-br from-purple-900/10 to-violet-900/10',
        pattern: 'bg-purple-100'
      },
      {
        name: 'Forest Guardian',
        primary: 'from-green-600 via-emerald-500 to-teal-500',
        secondary: 'from-green-500 to-emerald-400',
        accent: 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200',
        text: 'text-green-700',
        neon: 'shadow-green-500/40 hover:shadow-green-500/70',
        glow: 'drop-shadow-[0_0_12px_rgba(34,197,94,0.6)]',
        bg: 'bg-gradient-to-br from-green-900/10 to-emerald-900/10',
        pattern: 'bg-green-100'
      },
      {
        name: 'Solar Flare',
        primary: 'from-yellow-500 via-orange-500 to-red-500',
        secondary: 'from-yellow-400 to-orange-400',
        accent: 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200',
        text: 'text-yellow-700',
        neon: 'shadow-yellow-500/40 hover:shadow-yellow-500/70',
        glow: 'drop-shadow-[0_0_12px_rgba(234,179,8,0.6)]',
        bg: 'bg-gradient-to-br from-yellow-900/10 to-orange-900/10',
        pattern: 'bg-yellow-100'
      },
      {
        name: 'Royal Crown',
        primary: 'from-indigo-600 via-purple-500 to-pink-500',
        secondary: 'from-indigo-500 to-purple-400',
        accent: 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200',
        text: 'text-indigo-700',
        neon: 'shadow-indigo-500/40 hover:shadow-indigo-500/70',
        glow: 'drop-shadow-[0_0_12px_rgba(99,102,241,0.6)]',
        bg: 'bg-gradient-to-br from-indigo-900/10 to-purple-900/10',
        pattern: 'bg-indigo-100'
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
          label: 'SOLO BATTLE',
          bgColor: 'bg-gradient-to-r from-yellow-500 to-amber-500',
          description: 'Individual Championship',
          shortDesc: '1v99'
        };
      case 'duo':
        return {
          icon: Users,
          label: 'DUO COMBAT',
          bgColor: 'bg-gradient-to-r from-pink-500 to-rose-500',
          description: 'Partner Challenge',
          shortDesc: '2v2'
        };
      case 'squad':
        return {
          icon: Shield,
          label: 'SQUAD WAR',
          bgColor: 'bg-gradient-to-r from-indigo-500 to-purple-500',
          description: 'Team Warfare',
          shortDesc: '4v4'
        };
      default:
        return {
          icon: Star,
          label: type.toUpperCase(),
          bgColor: 'bg-gradient-to-r from-gray-500 to-slate-500',
          description: 'Special Mode',
          shortDesc: 'Custom'
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
          textColor: 'text-red-600',
          borderColor: 'border-red-500'
        };
      case 'upcoming':
        return {
          label: 'UPCOMING',
          bgColor: 'bg-gradient-to-r from-emerald-600 to-green-500',
          animation: '',
          icon: Clock,
          textColor: 'text-green-600',
          borderColor: 'border-green-500'
        };
      case 'completed':
        return {
          label: 'FINISHED',
          bgColor: 'bg-gradient-to-r from-gray-600 to-slate-500',
          animation: '',
          icon: Award,
          textColor: 'text-gray-600',
          borderColor: 'border-gray-500'
        };
      default:
        return {
          label: 'ACTIVE',
          bgColor: 'bg-gradient-to-r from-blue-600 to-blue-500',
          animation: '',
          icon: GamepadIcon,
          textColor: 'text-blue-600',
          borderColor: 'border-blue-500'
        };
    }
  };

  const getDifficultyConfig = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return { icon: Star, color: 'text-green-500', bg: 'bg-green-100', label: 'EASY' };
      case 'medium':
        return { icon: Target, color: 'text-yellow-500', bg: 'bg-yellow-100', label: 'MEDIUM' };
      case 'hard':
        return { icon: Flame, color: 'text-orange-500', bg: 'bg-orange-100', label: 'HARD' };
      case 'expert':
        return { icon: Crown, color: 'text-red-500', bg: 'bg-red-100', label: 'EXPERT' };
      case 'legendary':
        return { icon: Trophy, color: 'text-purple-500', bg: 'bg-purple-100', label: 'LEGENDARY' };
      default:
        return { icon: GamepadIcon, color: 'text-gray-500', bg: 'bg-gray-100', label: 'STANDARD' };
    }
  };

  const handleJoin = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsJoining(true);
    joinTournamentMutation.mutate();
  };

  const isFull = tournament.currentParticipants >= tournament.maxParticipants;
  const isUpcoming = tournament.status === 'upcoming';
  const participationPercentage = (tournament.currentParticipants / tournament.maxParticipants) * 100;
  
  const theme = getAdvancedTheme(tournament.id);
  const typeConfig = getTypeConfig(tournament.type);
  const statusConfig = getStatusConfig(tournament.status);
  const difficultyConfig = getDifficultyConfig(tournament.difficulty);
  const TypeIcon = typeConfig.icon;
  const StatusIcon = statusConfig.icon;
  const DifficultyIcon = difficultyConfig.icon;

  return (
    <Card 
      className={`group relative overflow-hidden bg-white border-2 border-gray-100 shadow-xl hover:shadow-2xl ${theme.neon} transition-all duration-700 transform hover:-translate-y-3 hover:scale-[1.02] cursor-pointer rounded-3xl ${
        isHovered ? 'animate-pulse' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.primary} opacity-0 group-hover:opacity-15 transition-opacity duration-700`} />
      
      {/* Glowing border effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
      
      {/* Header Section with Enhanced Banner */}
      <div className="relative h-44 sm:h-48 overflow-hidden rounded-t-3xl">
        {/* Dynamic Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.primary} opacity-95`} />
        
        {/* Geometric Pattern Overlay */}
        <div className="absolute inset-0 bg-[url(&#39;data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fill-opacity=&quot;0.15&quot;%3E%3Cpath d=&quot;M30 30l15-15v30l-15-15zM15 15l15 15-15 15V15z&quot;/&gt;%3C/g%3E%3C/g%3E%3C/svg%3E&#39;)] opacity-40" />
        
        {/* Tournament Image or Fire Fight Branding */}
        {tournament.imageUrl ? (
          <img 
            src={tournament.imageUrl} 
            alt={tournament.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
          />
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="text-center text-white z-10">
              <Flame className={`h-16 w-16 sm:h-20 sm:w-20 mx-auto mb-3 ${theme.glow} animate-bounce`} />
              <p className="text-lg font-black tracking-wider">FIRE FIGHT</p>
              <p className="text-sm opacity-80 font-medium">{theme.name}</p>
            </div>
          </div>
        )}
        
        {/* Status Badge - Top Right */}
        <div className="absolute top-4 right-4">
          <Badge className={`${statusConfig.bgColor} text-white border-0 shadow-xl ${statusConfig.animation} px-4 py-2 text-xs font-black tracking-widest rounded-full backdrop-blur-sm`}>
            <StatusIcon className="mr-2 h-4 w-4" />
            {statusConfig.label}
          </Badge>
        </div>
        
        {/* Type Badge - Top Left */}
        <div className="absolute top-4 left-4">
          <Badge className={`${typeConfig.bgColor} text-white border-0 shadow-xl px-4 py-2 text-xs font-black tracking-widest rounded-full backdrop-blur-sm`}>
            <TypeIcon className="mr-2 h-4 w-4" />
            {typeConfig.label}
          </Badge>
        </div>

        {/* Difficulty Badge - Bottom Left */}
        <div className="absolute bottom-4 left-4">
          <Badge className={`${difficultyConfig.bg} ${difficultyConfig.color} border-0 shadow-lg px-3 py-1.5 text-xs font-bold tracking-wider rounded-full backdrop-blur-sm`}>
            <DifficultyIcon className="mr-1.5 h-3.5 w-3.5" />
            {difficultyConfig.label}
          </Badge>
        </div>

        {/* Prize Pool Highlight - Bottom Right */}
        <div className="absolute bottom-4 right-4">
          <div className="bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center space-x-1">
            <Trophy className="h-4 w-4 text-yellow-400" />
            <span className="text-white text-sm font-bold">₹{tournament.prizePool}</span>
          </div>
        </div>

        {/* Participation indicator */}
        {!isFull && isUpcoming && (
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
            <div className="flex items-center space-x-2 bg-green-500/20 backdrop-blur-sm rounded-full px-3 py-1.5 border border-green-400/30">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
              <span className="text-white text-xs font-bold tracking-wider">OPEN</span>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Content Section */}
      <CardContent className="p-6 space-y-5">
        {/* Tournament Title & Meta */}
        <div className="space-y-2">
          <h3 className="font-black text-xl sm:text-2xl text-gray-900 leading-tight group-hover:text-gray-800 transition-colors line-clamp-2">
            {tournament.name}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 font-semibold">{typeConfig.description}</p>
            <div className="flex items-center space-x-2">
              {tournament.gameMode && (
                <Badge variant="outline" className="text-xs font-medium px-2 py-1">
                  <GamepadIcon className="h-3 w-3 mr-1" />
                  {tournament.gameMode}
                </Badge>
              )}
              {tournament.mapName && (
                <Badge variant="outline" className="text-xs font-medium px-2 py-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  {tournament.mapName}
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Entry Fee */}
          <div className={`${theme.accent} rounded-2xl p-4 border-2 group-hover:border-opacity-60 transition-all duration-300 relative overflow-hidden`}>
            <div className="relative z-10">
              <div className="flex items-center space-x-3">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${theme.secondary} shadow-lg`}>
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold tracking-wider uppercase">Entry Fee</p>
                  <p className={`text-xl font-black ${theme.text}`}>₹{tournament.entryFee}</p>
                  <p className="text-xs text-gray-500 font-medium">Per Player</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Prize Pool */}
          <div className={`${theme.accent} rounded-2xl p-4 border-2 group-hover:border-opacity-60 transition-all duration-300 relative overflow-hidden`}>
            <div className="relative z-10">
              <div className="flex items-center space-x-3">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${theme.secondary} shadow-lg`}>
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold tracking-wider uppercase">Total Prize</p>
                  <p className={`text-xl font-black ${theme.text}`}>₹{tournament.prizePool}</p>
                  <p className="text-xs text-gray-500 font-medium">Winner Takes</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Prize Breakdown - if available */}
        {(tournament.firstPrize || tournament.secondPrize || tournament.thirdPrize) && (
          <div className={`${theme.bg} rounded-2xl p-4 border border-gray-200 group-hover:border-opacity-60 transition-all duration-300`}>
            <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center">
              <Medal className="h-4 w-4 mr-2" />
              Prize Distribution
            </h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              {tournament.firstPrize && (
                <div className="space-y-1">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full mx-auto flex items-center justify-center">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  <p className="text-xs font-bold text-gray-700">₹{tournament.firstPrize}</p>
                </div>
              )}
              {tournament.secondPrize && (
                <div className="space-y-1">
                  <div className="w-6 h-6 bg-gray-400 rounded-full mx-auto flex items-center justify-center">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  <p className="text-xs font-bold text-gray-700">₹{tournament.secondPrize}</p>
                </div>
              )}
              {tournament.thirdPrize && (
                <div className="space-y-1">
                  <div className="w-6 h-6 bg-orange-500 rounded-full mx-auto flex items-center justify-center">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  <p className="text-xs font-bold text-gray-700">₹{tournament.thirdPrize}</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Enhanced Players Progress Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-bold text-gray-700 tracking-wide">PARTICIPANTS</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-lg font-black text-gray-800">
                {tournament.currentParticipants}/{tournament.maxParticipants}
              </span>
              {isFull ? (
                <Badge className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
                  FULL
                </Badge>
              ) : (
                <Badge className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                  {tournament.maxParticipants - tournament.currentParticipants} SPOTS LEFT
                </Badge>
              )}
            </div>
          </div>
          
          {/* Enhanced Progress Bar with Animation */}
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
              <div 
                className={`h-full bg-gradient-to-r ${theme.secondary} rounded-full transition-all duration-2000 ease-out relative overflow-hidden`}
                style={{ width: `${participationPercentage}%` }}
              >
                <div className="absolute inset-0 bg-white/40 animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
            </div>
            <div className="absolute inset-0 rounded-full ring-1 ring-gray-300 ring-opacity-50" />
          </div>
          
          {/* Participation Stats */}
          <div className="flex justify-between text-xs text-gray-600 font-medium">
            <span>{participationPercentage.toFixed(0)}% filled</span>
            <span className="flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              {isUpcoming ? 'Filling Fast' : 'Registration Closed'}
            </span>
          </div>
        </div>
        
        {/* Tournament Schedule */}
        <div className="grid grid-cols-1 gap-3">
          {/* Start Time for Upcoming */}
          {isUpcoming && (
            <div className={`${theme.bg} rounded-2xl p-4 border border-gray-200 group-hover:border-opacity-60 transition-all duration-300`}>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <Timer className={`h-5 w-5 ${theme.text}`} />
                  <span className={`text-sm font-bold ${theme.text} tracking-wider uppercase`}>Tournament Starts In</span>
                </div>
                <CountdownTimer 
                  targetDate={tournament.startTime}
                  className={`font-mono text-2xl font-black ${theme.text} tracking-wider`}
                />
                <div className="mt-2 flex items-center justify-center space-x-4 text-xs text-gray-600">
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(tournament.startTime).toLocaleDateString()}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {new Date(tournament.startTime).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {/* Registration Deadline */}
          {tournament.registrationDeadline && isUpcoming && (
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 bg-gray-50 rounded-xl p-3">
              <Info className="h-4 w-4" />
              <span className="font-medium">Registration closes: {new Date(tournament.registrationDeadline).toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Sponsor Information */}
        {tournament.sponsorName && (
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-3 border border-yellow-200">
            <Gift className="h-4 w-4 text-yellow-600" />
            <span className="font-semibold">Sponsored by: <span className="text-yellow-700 font-bold">{tournament.sponsorName}</span></span>
          </div>
        )}
        
        {/* Enhanced Action Button */}
        <Button
          className={`w-full h-14 font-black text-white border-0 shadow-xl hover:shadow-2xl transform transition-all duration-500 rounded-2xl text-base tracking-widest relative overflow-hidden ${
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
          {/* Button glow effect */}
          <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
          
          {isJoining || joinTournamentMutation.isPending ? (
            <div className="flex items-center justify-center space-x-3 relative z-10">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              <span className="text-base">JOINING BATTLE...</span>
            </div>
          ) : isFull ? (
            <div className="flex items-center justify-center space-x-3 relative z-10">
              <Users className="h-6 w-6" />
              <span className="text-base">TOURNAMENT FULL</span>
            </div>
          ) : tournament.status === 'live' ? (
            <div className="flex items-center justify-center space-x-3 relative z-10">
              <Play className="h-6 w-6" />
              <span className="text-base font-black tracking-widest">JOIN LIVE BATTLE</span>
            </div>
          ) : tournament.status === 'upcoming' ? (
            <div className="flex items-center justify-center space-x-3 relative z-10">
              <Swords className="h-6 w-6" />
              <span className="text-base font-black tracking-widest">ENTER TOURNAMENT</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-3 relative z-10">
              <Eye className="h-6 w-6" />
              <span className="text-base">VIEW RESULTS</span>
            </div>
          )}
        </Button>

        {/* Details Toggle Button */}
        <Button
          variant="outline"
          onClick={() => setShowDetails(!showDetails)}
          className="w-full h-10 text-sm font-semibold border-gray-300 hover:border-gray-400 transition-all duration-300"
        >
          <Settings className="h-4 w-4 mr-2" />
          {showDetails ? 'Hide Details' : 'Show More Details'}
        </Button>

        {/* Expandable Details Section */}
        {showDetails && tournament.rules && (
          <div className="mt-4 space-y-3 animate-in slide-in-from-top-2 duration-300">
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
              <h4 className="font-bold text-gray-800 mb-2 flex items-center">
                <Info className="h-4 w-4 mr-2" />
                Tournament Rules
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">{tournament.rules}</p>
            </div>
          </div>
        )}
        
        {/* Floating Action Indicators */}
        {isUpcoming && !isFull && (
          <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${theme.secondary} animate-ping`} />
          </div>
        )}
      </CardContent>
      
      {/* Enhanced Hover Glow Effect */}
      <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-r ${theme.primary} blur-2xl -z-10 transform scale-110`} />
      
      {/* Corner Accent */}
      <div className="absolute top-0 right-0 w-16 h-16 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
        <div className={`w-full h-full bg-gradient-to-bl ${theme.secondary} rounded-bl-full`} />
      </div>
    </Card>
  );
}
