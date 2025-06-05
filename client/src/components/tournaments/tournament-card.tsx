
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import CountdownTimer from "@/components/ui/countdown-timer";
import { Trophy, Users, Target, Clock, Zap, Star, Award, DollarSign } from "lucide-react";

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
        title: "Success!",
        description: "Successfully joined the tournament",
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

  const getTypeConfig = (type: string) => {
    switch (type.toLowerCase()) {
      case 'solo':
        return {
          color: 'from-blue-400 to-cyan-400',
          bgColor: 'bg-gradient-to-r from-blue-50 to-cyan-50',
          textColor: 'text-blue-700',
          icon: Target
        };
      case 'duo':
        return {
          color: 'from-purple-400 to-pink-400',
          bgColor: 'bg-gradient-to-r from-purple-50 to-pink-50',
          textColor: 'text-purple-700',
          icon: Users
        };
      case 'squad':
        return {
          color: 'from-orange-400 to-red-400',
          bgColor: 'bg-gradient-to-r from-orange-50 to-red-50',
          textColor: 'text-orange-700',
          icon: Trophy
        };
      default:
        return {
          color: 'from-gray-400 to-slate-400',
          bgColor: 'bg-gradient-to-r from-gray-50 to-slate-50',
          textColor: 'text-gray-700',
          icon: Star
        };
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'live':
        return {
          color: 'from-green-400 to-emerald-400',
          bgColor: 'bg-gradient-to-r from-green-50 to-emerald-50',
          textColor: 'text-green-700',
          animation: 'animate-pulse',
          icon: Zap
        };
      case 'upcoming':
        return {
          color: 'from-yellow-400 to-amber-400',
          bgColor: 'bg-gradient-to-r from-yellow-50 to-amber-50',
          textColor: 'text-yellow-700',
          animation: '',
          icon: Clock
        };
      case 'completed':
        return {
          color: 'from-gray-400 to-slate-400',
          bgColor: 'bg-gradient-to-r from-gray-50 to-slate-50',
          textColor: 'text-gray-700',
          animation: '',
          icon: Award
        };
      default:
        return {
          color: 'from-indigo-400 to-blue-400',
          bgColor: 'bg-gradient-to-r from-indigo-50 to-blue-50',
          textColor: 'text-indigo-700',
          animation: '',
          icon: Trophy
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
  
  const typeConfig = getTypeConfig(tournament.type);
  const statusConfig = getStatusConfig(tournament.status);
  const TypeIcon = typeConfig.icon;
  const StatusIcon = statusConfig.icon;

  return (
    <Card 
      className={`group relative overflow-hidden bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
        isHovered ? 'scale-105' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${typeConfig.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
      
      {/* Tournament Image with overlay */}
      <div className="relative h-48 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${typeConfig.color} opacity-90`} />
        {tournament.imageUrl ? (
          <img 
            src={tournament.imageUrl} 
            alt={tournament.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-white">
              <Trophy className="h-16 w-16 mx-auto mb-3 drop-shadow-lg" />
              <p className="text-lg font-semibold drop-shadow">Arena</p>
            </div>
          </div>
        )}
        
        {/* Status badge overlay */}
        <div className="absolute top-4 right-4">
          <Badge className={`${statusConfig.bgColor} ${statusConfig.textColor} border-0 shadow-lg ${statusConfig.animation} px-3 py-1.5`}>
            <StatusIcon className="mr-1.5 h-3.5 w-3.5" />
            {tournament.status.toUpperCase()}
          </Badge>
        </div>
        
        {/* Type badge overlay */}
        <div className="absolute top-4 left-4">
          <Badge className={`${typeConfig.bgColor} ${typeConfig.textColor} border-0 shadow-lg px-3 py-1.5`}>
            <TypeIcon className="mr-1.5 h-3.5 w-3.5" />
            {tournament.type.toUpperCase()}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-4">
        <div className="space-y-2">
          <h3 className="font-bold text-xl text-gray-800 leading-tight group-hover:text-gray-900 transition-colors">
            {tournament.name}
          </h3>
          
          {/* Prize and Fee Grid */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className={`${typeConfig.bgColor} rounded-xl p-4 border border-opacity-20`}>
              <div className="flex items-center space-x-2">
                <DollarSign className={`h-5 w-5 ${typeConfig.textColor}`} />
                <div>
                  <p className="text-xs text-gray-600 font-medium">Entry Fee</p>
                  <p className={`text-lg font-bold ${typeConfig.textColor}`}>₹{tournament.entryFee}</p>
                </div>
              </div>
            </div>
            
            <div className={`${statusConfig.bgColor} rounded-xl p-4 border border-opacity-20`}>
              <div className="flex items-center space-x-2">
                <Trophy className={`h-5 w-5 ${statusConfig.textColor}`} />
                <div>
                  <p className="text-xs text-gray-600 font-medium">Prize Pool</p>
                  <p className={`text-lg font-bold ${statusConfig.textColor}`}>₹{tournament.prizePool}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-5">
        {/* Participants Progress */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Participants</span>
            </div>
            <span className="text-sm font-bold text-gray-800">
              {tournament.currentParticipants}/{tournament.maxParticipants}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${typeConfig.color} rounded-full transition-all duration-700 ease-out`}
              style={{ width: `${participationPercentage}%` }}
            />
          </div>
          
          <div className="text-xs text-gray-500 text-right">
            {Math.round(participationPercentage)}% filled
          </div>
        </div>
        
        {/* Countdown Timer */}
        {isUpcoming && (
          <div className={`${statusConfig.bgColor} rounded-xl p-4 border border-opacity-20`}>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Clock className={`h-4 w-4 ${statusConfig.textColor}`} />
                <span className={`text-sm font-medium ${statusConfig.textColor}`}>Starts in</span>
              </div>
              <CountdownTimer 
                targetDate={tournament.startTime}
                className={`font-mono text-lg font-bold ${statusConfig.textColor}`}
              />
            </div>
          </div>
        )}
        
        {/* Dynamic Join Button */}
        <Button
          className={`w-full h-12 font-bold text-white border-0 shadow-lg hover:shadow-xl transform transition-all duration-300 ${
            tournament.status === 'live' 
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 hover:scale-105'
              : tournament.status === 'upcoming'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 hover:scale-105'
              : 'bg-gradient-to-r from-gray-400 to-slate-400 cursor-not-allowed'
          } ${isHovered && !isFull && isUpcoming ? 'animate-pulse' : ''}`}
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
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Joining...</span>
            </div>
          ) : isFull ? (
            <div className="flex items-center justify-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Tournament Full</span>
            </div>
          ) : tournament.status === 'live' ? (
            <div className="flex items-center justify-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Join Live Battle</span>
            </div>
          ) : tournament.status === 'upcoming' ? (
            <div className="flex items-center justify-center space-x-2">
              <Trophy className="h-5 w-5" />
              <span>Join Tournament</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <Award className="h-5 w-5" />
              <span>Tournament Ended</span>
            </div>
          )}
        </Button>
        
        {/* Floating action indicator */}
        {isUpcoming && !isFull && (
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${statusConfig.color} animate-ping`} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
