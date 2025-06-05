
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CountdownTimer from "@/components/ui/countdown-timer";
import { Clock, Play, CheckCircle, Copy, Trophy, Target, Zap, Award, GamepadIcon, Flame, Star, Crown, Sword } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useState } from "react";

interface MatchCardProps {
  match: {
    id: string;
    tournamentName: string;
    type: string;
    entryFee: string;
    status: 'upcoming' | 'live' | 'completed';
    startTime: string;
    roomId?: string | null;
    password?: string | null;
    rank?: number;
    kills?: number;
    earning?: string;
  };
}

export default function MatchCard({ match }: MatchCardProps) {
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);

  // Dynamic theme based on match ID for color variety
  const getMatchTheme = (id: string) => {
    const themes = [
      {
        primary: 'from-red-600 via-red-500 to-orange-500',
        secondary: 'from-red-400 to-orange-400',
        border: 'border-red-300',
        neon: 'hover:shadow-red-500/25 hover:shadow-2xl',
        accent: 'bg-red-500',
        textAccent: 'text-red-400',
        bgPattern: 'bg-red-50'
      },
      {
        primary: 'from-blue-600 via-blue-500 to-cyan-500',
        secondary: 'from-blue-400 to-cyan-400',
        border: 'border-blue-300',
        neon: 'hover:shadow-blue-500/25 hover:shadow-2xl',
        accent: 'bg-blue-500',
        textAccent: 'text-blue-400',
        bgPattern: 'bg-blue-50'
      },
      {
        primary: 'from-purple-600 via-purple-500 to-pink-500',
        secondary: 'from-purple-400 to-pink-400',
        border: 'border-purple-300',
        neon: 'hover:shadow-purple-500/25 hover:shadow-2xl',
        accent: 'bg-purple-500',
        textAccent: 'text-purple-400',
        bgPattern: 'bg-purple-50'
      },
      {
        primary: 'from-green-600 via-green-500 to-emerald-500',
        secondary: 'from-green-400 to-emerald-400',
        border: 'border-green-300',
        neon: 'hover:shadow-green-500/25 hover:shadow-2xl',
        accent: 'bg-green-500',
        textAccent: 'text-green-400',
        bgPattern: 'bg-green-50'
      },
      {
        primary: 'from-orange-600 via-orange-500 to-yellow-500',
        secondary: 'from-orange-400 to-yellow-400',
        border: 'border-orange-300',
        neon: 'hover:shadow-orange-500/25 hover:shadow-2xl',
        accent: 'bg-orange-500',
        textAccent: 'text-orange-400',
        bgPattern: 'bg-orange-50'
      },
      {
        primary: 'from-indigo-600 via-indigo-500 to-purple-500',
        secondary: 'from-indigo-400 to-purple-400',
        border: 'border-indigo-300',
        neon: 'hover:shadow-indigo-500/25 hover:shadow-2xl',
        accent: 'bg-indigo-500',
        textAccent: 'text-indigo-400',
        bgPattern: 'bg-indigo-50'
      }
    ];
    
    const hash = id.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return themes[Math.abs(hash) % themes.length];
  };

  const theme = getMatchTheme(match.id);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'live':
        return {
          label: '🔴 LIVE NOW',
          bgColor: 'bg-gradient-to-r from-red-600 to-red-500',
          animation: 'animate-pulse',
          icon: Zap,
          textColor: 'text-red-600',
          badgeStyle: 'bg-red-500 text-white animate-pulse'
        };
      case 'upcoming':
        return {
          label: '🟢 UPCOMING',
          bgColor: 'bg-gradient-to-r from-emerald-600 to-green-500',
          animation: '',
          icon: Clock,
          textColor: 'text-green-600',
          badgeStyle: 'bg-green-500 text-white'
        };
      case 'completed':
        return {
          label: '⚪ FINISHED',
          bgColor: 'bg-gradient-to-r from-gray-600 to-slate-500',
          animation: '',
          icon: Award,
          textColor: 'text-gray-600',
          badgeStyle: 'bg-gray-500 text-white'
        };
      default:
        return {
          label: '🔵 ACTIVE',
          bgColor: 'bg-gradient-to-r from-blue-600 to-blue-500',
          animation: '',
          icon: GamepadIcon,
          textColor: 'text-blue-600',
          badgeStyle: 'bg-blue-500 text-white'
        };
    }
  };

  const statusConfig = getStatusConfig(match.status);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied! 🎉",
      description: `${label} copied to clipboard`,
    });
  };

  const isRoomCodeAvailable = match.status === 'live' && match.roomId;

  return (
    <Card 
      className={`group relative overflow-hidden bg-white border-2 ${theme.border} shadow-xl ${theme.neon} transition-all duration-700 transform hover:-translate-y-3 hover:scale-[1.02] cursor-pointer rounded-3xl ${
        isHovered ? 'animate-pulse' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.primary} opacity-0 group-hover:opacity-10 transition-opacity duration-700`} />
      
      {/* Geometric pattern overlay */}
      <div className="absolute inset-0 opacity-5 group-hover:opacity-15 transition-opacity duration-500">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23000000" fill-opacity="0.1"%3E%3Cpath d="M30 30L0 0h60z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
      </div>

      {/* Glowing border effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500" />

      <CardContent className="p-0 relative">
        {/* Header Section with Gradient Banner */}
        <div className="relative h-28 overflow-hidden rounded-t-3xl">
          {/* Dynamic gradient background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${theme.primary} opacity-95`} />
          
          {/* Decorative elements */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              {match.status === 'live' ? (
                <Zap className="h-8 w-8 mx-auto mb-1 drop-shadow-lg animate-bounce text-yellow-300" />
              ) : match.status === 'completed' ? (
                <Crown className="h-8 w-8 mx-auto mb-1 drop-shadow-lg text-yellow-300" />
              ) : (
                <Sword className="h-8 w-8 mx-auto mb-1 drop-shadow-lg text-white" />
              )}
              <p className="text-xs font-bold drop-shadow tracking-widest opacity-80">FIRE FIGHT</p>
            </div>
          </div>

          {/* Status Badge - Top Right */}
          <div className="absolute top-3 right-3">
            <Badge className={`${statusConfig.badgeStyle} font-bold text-xs px-3 py-1 rounded-full shadow-lg border-0`}>
              {statusConfig.label}
            </Badge>
          </div>

          {/* Match Type Badge - Top Left */}
          <div className="absolute top-3 left-3">
            <Badge className="bg-black/30 text-white border-0 backdrop-blur-sm font-semibold text-xs px-3 py-1 rounded-full">
              {match.type.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-4">
          {/* Tournament Name & Details */}
          <div className="space-y-2">
            <h3 className="font-black text-lg text-gray-800 group-hover:text-gray-900 transition-colors line-clamp-2">
              {match.tournamentName}
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${theme.accent} animate-pulse`} />
                <span className="text-sm font-bold text-gray-600">
                  Entry: <span className={`${theme.textAccent} font-black`}>₹{match.entryFee}</span>
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium">
                {format(new Date(match.startTime), 'MMM dd, HH:mm')}
              </p>
            </div>
          </div>

          {/* Status Specific Content */}
          <div className="space-y-4">
            {match.status === 'upcoming' && (
              <div className={`${theme.bgPattern} rounded-2xl p-4 border-2 border-dashed ${theme.border}`}>
                <div className="text-center space-y-2">
                  <div className="text-sm font-bold text-gray-600">⏰ Tournament Starts In</div>
                  <CountdownTimer 
                    targetDate={match.startTime}
                    className={`font-mono ${theme.textAccent} font-black text-lg tracking-wider`}
                  />
                  <div className="flex items-center justify-center space-x-2 mt-3">
                    <Star className={`h-4 w-4 ${theme.textAccent}`} />
                    <span className="text-xs font-bold text-gray-600">GET READY TO BATTLE!</span>
                    <Star className={`h-4 w-4 ${theme.textAccent}`} />
                  </div>
                </div>
              </div>
            )}

            {match.status === 'live' && isRoomCodeAvailable && (
              <div className={`bg-gradient-to-r ${theme.secondary} rounded-2xl p-4 border-2 ${theme.border} shadow-inner`}>
                <div className="text-center space-y-3">
                  <div className="text-xs font-black text-white tracking-widest">🎮 ROOM DETAILS</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                      <div className="text-xs text-white/80 font-bold mb-1">ROOM ID</div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-white font-black text-sm">{match.roomId}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 text-white hover:bg-white/20 hover:text-white"
                          onClick={() => copyToClipboard(match.roomId!, "Room ID")}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    {match.password && (
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                        <div className="text-xs text-white/80 font-bold mb-1">PASSWORD</div>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-white font-black text-sm">{match.password}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-white hover:bg-white/20 hover:text-white"
                            onClick={() => copyToClipboard(match.password!, "Password")}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {match.status === 'completed' && (
              <div className={`${theme.bgPattern} rounded-2xl p-4 border-2 ${theme.border}`}>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-1">
                    <Trophy className={`h-5 w-5 ${theme.textAccent} mx-auto`} />
                    <div className="text-xs font-bold text-gray-600">RANK</div>
                    <div className={`text-lg font-black ${theme.textAccent}`}>#{match.rank}</div>
                  </div>
                  <div className="space-y-1">
                    <Target className={`h-5 w-5 ${theme.textAccent} mx-auto`} />
                    <div className="text-xs font-bold text-gray-600">KILLS</div>
                    <div className={`text-lg font-black ${theme.textAccent}`}>{match.kills}</div>
                  </div>
                  <div className="space-y-1">
                    <Flame className={`h-5 w-5 ${theme.textAccent} mx-auto`} />
                    <div className="text-xs font-bold text-gray-600">EARNED</div>
                    <div className={`text-lg font-black ${theme.textAccent}`}>₹{match.earning}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="pt-2">
              {match.status === 'upcoming' && (
                <Button 
                  className={`w-full bg-gradient-to-r ${theme.primary} text-white font-black text-sm tracking-widest py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0`}
                  disabled
                >
                  <Clock className="mr-2 h-4 w-4" />
                  WAITING TO START
                </Button>
              )}
              
              {match.status === 'live' && (
                <Button 
                  className={`w-full bg-gradient-to-r from-red-600 to-red-500 text-white font-black text-sm tracking-widest py-3 rounded-2xl shadow-lg hover:shadow-xl hover:shadow-red-500/50 transform hover:scale-105 transition-all duration-300 border-0 animate-pulse`}
                >
                  <Zap className="mr-2 h-4 w-4" />
                  JOIN BATTLE NOW
                </Button>
              )}
              
              {match.status === 'completed' && (
                <Button 
                  variant="outline" 
                  className={`w-full border-2 ${theme.border} ${theme.textAccent} font-black text-sm tracking-widest py-3 rounded-2xl hover:bg-gradient-to-r ${theme.primary} hover:text-white transform hover:scale-105 transition-all duration-300 bg-white`}
                >
                  <Trophy className="mr-2 h-4 w-4" />
                  VIEW MATCH DETAILS
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Floating Action Indicator */}
        {match.status === 'live' && (
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
          </div>
        )}
      </CardContent>

      {/* Hover Glow Effect */}
      <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-r ${theme.primary} blur-xl -z-10 transform scale-110`} />
    </Card>
  );
}
